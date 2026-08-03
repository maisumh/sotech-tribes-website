# Tribes Admin Architecture

Compass document for the `/admin/*` section of this codebase. If you're working on the admin panel — adding a new view, changing a mutation, debugging auth — start here. For the data spec (which tables, which mutations are allowed), see `docs/admin-backend-contract.md`.

## What this is

A mobile-responsive admin panel built inside the `new-website` Next.js 15 App Router codebase. Replaces a legacy FlutterFlow admin that had communication/urgency issues with its vendor. Consolidates all admin tooling into the same repo as trytribes.com so it deploys through the same Vercel pipeline.

The panel is an internal staff tool — not exposed via marketing pages, protected by an auth + role gate at `/admin/*`.

## Data layer — the one sentence you need to know

**Supabase (Postgres) is the source of truth. Firebase is used only for FCM push notifications to the mobile app. Do NOT try to read/write data from Firebase.**

The mobile app and this admin panel both hit the same Supabase database (`pnlknurdxcduhbtxdefl`). The Firebase project (`tribes-a624c`) has no Firestore rules and no Storage rules — it exists for push tokens only. Anyone new touching this codebase invariably assumes Firebase is the data layer. It's not. Check `_ff-admin-reference/backend-discovery.md` at the parent directory for the full audit trail.

## Three-layer auth defense

Every admin request passes through three gates. Never skip any of them.

```
1. middleware.ts (src/middleware.ts)
   ├─ refreshes Supabase session cookie on every request
   └─ redirects unauthenticated /admin/* → /admin/login
      (except /admin/login and /admin/auth/* — the OAuth callback runs
       before a session cookie exists, so it must not be bounced)

2. (protected)/layout.tsx
   ├─ calls requireAdmin() at the top of the async Server Component
   ├─ requireAdmin() verifies public.users.role = 'admin'
   └─ redirects non-admins to /admin/no-access, unauthenticated → /admin/login

3. Every Server Action + every Route Handler + every mutation
   ├─ MUST call requireAdmin() as the first line
   └─ MUST NOT create the service-role client before requireAdmin() passes
```

The middleware alone is not sufficient — a known class of Next.js middleware bypass attacks exists (CVE-2025-29927). The layout check and the in-action check are the real gates; the middleware is defense-in-depth.

## Sign-in methods

Two ways in, both landing on the same `users.role = 'admin'` gate (there is **no `admin_users` table** — admin = the `role` column):

1. **Email + password** — the form on `/admin/login` (`signIn` Server Action → `signInWithPassword`). For admins who have a Supabase password.
2. **Google SSO** — "Continue with Google" (`signInWithGoogle` Server Action → `signInWithOAuth`). For admins who signed up via Google and have no password (e.g. the client). Flow: button → Google → `/admin/auth/callback` (route handler) exchanges the code, then runs the same role check; admins → `/admin`, authenticated non-admins → `/admin/no-access`.

An authenticated **non-admin** (either method) is **not** dumped on the marketing homepage — they land on `/admin/no-access`, a standalone page that lives **outside** the `(protected)` group (so it never calls `requireAdmin()` and can't loop). It shows their email + a sign-out button. Their session is intentionally kept (harmless: every protected leaf re-checks the role).

### ⚠️ Google OAuth gotcha — the redirect MUST have no query string

This Supabase project is **shared with the v1/v2 mobile apps**, and its **Site URL is `tribes://tribes.com`** (a mobile deep-link scheme). Supabase validates `redirectTo` against the **Redirect URL allow-list**; an entry without a wildcard (`https://www.trytribes.com/admin/auth/callback`) does **not** match a URL carrying a query string. If `redirectTo` fails the match, Supabase silently falls back to the Site URL → the browser is handed `tribes://…`, which a desktop browser can't open → **frozen tab** (auth actually succeeded; the session code just went somewhere unopenable). This cost an afternoon of debugging on 2026-06-15.

Rules that follow:
- `signInWithGoogle`'s `redirectTo` is `…/admin/auth/callback` with **NO query string**. Never add `?next=…` or anything else — it will re-break sign-in. The callback always redirects admins to a fixed `/admin`.
- These exact callback URLs must be in **Supabase → Authentication → URL Configuration → Redirect URLs**: `https://www.trytribes.com/admin/auth/callback` (the live site serves on **www** — this is the one that matters), `https://trytribes.com/admin/auth/callback`, and `http://localhost:3000/admin/auth/callback`.
- Google consent-screen branding (App name "Tribes", logo) + publishing status live in the **`tribes-a624c`** GCP project (project number **115370827237** = the OAuth client-ID prefix), **not** a SoTech project.

## Client selection — which Supabase client to use when

Two server-side clients live in `src/lib/supabase/`:

- **`createClient()` from `server.ts`** — regular server client. Uses the **anon key**. Represents the authenticated admin user via the cookie session. Respects RLS. `auth.uid()` inside SQL returns the admin's UUID.

- **`createAdminClient()` from `admin.ts`** — privileged admin client. Uses the **service role key**. Bypasses RLS. `auth.uid()` inside SQL returns `null`.

**The rule:**

| Use case | Client |
|---|---|
| Calling `requireAdmin()` itself (reads the user's role) | `createClient()` |
| Calling a `SECURITY DEFINER` RPC that checks `auth.uid()` internally (e.g., `get_admin_dashboard_analytics`, `get_user_full_profile`, `get_user_events_with_summary`) | **`createClient()`** — because the RPC needs the caller's JWT to verify admin role internally |
| Calling a `SECURITY DEFINER` RPC that does **NOT** check role internally and is protected by GRANT alone (the rollout-gate operator RPCs: `v2_set_area_status`, `v2_admit_area`, `v2_assign_area_zips`, `v2_grant_admission`) | **`createAdminClient()`** — they are revoked from `anon`/`authenticated` and never re-granted, so only the service role can execute them. `requireAdmin()` is the sole authorization gate; never grant them to `authenticated`. |
| Direct table reads where the admin needs to see all rows (e.g., listing users including admins) | `createAdminClient()` |
| All direct table writes (role updates, soft-deletes, audit log inserts, chat moderation) | `createAdminClient()` |

Getting this wrong produces two symptoms:
- Calling an RPC with the admin client → RPC errors with "Authentication required" or "Access denied" because `auth.uid() IS NULL`
- Writing to `admin_audit_log` with the regular client → fails because the table has no INSERT policy and only the service role can write

**Always call `requireAdmin()` before creating either client.** The pattern:

```ts
'use server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
// (or createClient from server.ts for RPC calls)

export async function someMutation(_prev: State, formData: FormData): Promise<State> {
  const adminUser = await requireAdmin()              // 1. gate
  const supabase = createAdminClient()                // 2. privileged client
  // ... do the work
  await supabase.from('admin_audit_log').insert({...}) // 3. audit
  return { status: 'success' }
}
```

## Admin audit log — every mutation writes a row

`public.admin_audit_log` was created specifically for the new admin. Schema:

```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
admin_id     uuid NOT NULL REFERENCES public.users(id)
action       text NOT NULL                 -- canonical action string, see below
target_table text NOT NULL                 -- which table was affected
target_id    text                          -- text, not uuid (some tables use bigint)
changes      jsonb                         -- { field: { from, to } } diff of changed fields
created_at   timestamptz NOT NULL DEFAULT now()
```

**RLS:** admins can read all rows. Nobody can write via RLS — only the service role client can insert.

**Canonical action strings (do not invent new ones without updating this list):**

```
update_user_role          — users.role changed
deactivate_user           — users.is_active = false
reactivate_user           — users.is_active = true
soft_delete_want_have     — want_have.is_deleted = true
restore_want_have         — want_have.is_deleted = false
close_want_have           — want_have.status = 'closed'
block_chat_room           — chat_rooms.blocked_by set
unblock_chat_room         — chat_rooms.blocked_by cleared
clear_report              — chat_rooms.reported_* cleared
delete_chat_message       — chat_messages row hard-deleted

# v2 (added when the admin gained visibility into the v2 interaction tables)
update_v2_report_status   — v2_reports.status / admin_notes changed (+ reviewed_by/at)
soft_delete_v2_project    — v2_projects.is_deleted = true
restore_v2_project        — v2_projects.is_deleted = false
feature_v2_project        — v2_projects.featured = true
unfeature_v2_project      — v2_projects.featured = false
block_v2_chat             — v2_chats.blocked_by set
unblock_v2_chat           — v2_chats.blocked_by cleared
clear_v2_chat_report      — v2_chats.reported_* cleared
delete_v2_chat_message    — v2_chat_messages row hard-deleted (cascades reactions)

# rollout gate (added 2026-08-03 with /admin/rollout)
set_area_status           — v2_areas.status changed (silent; admits nobody)
admit_area                — v2_admit_area ran; records admitted count, notify, limit,
                            and how many account-less web leads were marked notified
assign_area_zips          — v2_area_zips mapped to an area
grant_admission           — one user manually admitted
set_invite_only           — v2_access_config.invite_only flipped (the master lock)
```

Note: `admin_audit_log.action` has **no DB CHECK constraint** — the canonical
list is enforced by convention only. Actioning a report's *target* reuses the
existing `soft_delete_want_have` / `deactivate_user` strings (the report screen
writes to `want_have` / `users`, so the audit row reflects the table touched).

**Every admin mutation writes exactly one row.** Miss this and you lose the audit trail. The `changes` jsonb column records only the fields that actually changed, not the full row.

## RPC inventory — reuse and avoid

Five `SECURITY DEFINER` functions live on the Supabase project. They were built by the previous FlutterFlow vendor. Three are safe to reuse and we do; two have security issues and we don't call them.

### Safe to reuse (all check admin role internally, call via `createClient()`)

- **`get_admin_dashboard_analytics(p_from_date, p_to_date)`** → jsonb with 6 rollup counts. Used by `/admin` dashboard landing page. Huge time-saver.
- **`get_user_full_profile(p_user_id)`** → jsonb with user + wants + haves + totals. Used by `/admin/users/[id]`. Strips the `description_embedding` vector blob, which is nice.
- **`get_user_events_with_summary(p_event_type, p_limit, p_offset, p_admin_mode)`** → jsonb with totals-by-type + paginated events. Used by `/admin/activity`. **WE PASS `p_admin_mode: true` AND THIS IS AN UNFIXED VULNERABILITY — see "deferred security issues" at the bottom.**

### Do not reuse

- **`get_users_list(p_limit, p_offset, p_search)`** — works fine but filters `WHERE role = 'user'`, hiding admins from the result. The new admin panel needs to see admins (for role management), so we query `public.users` directly via the service-role client instead.
- **`delete_want_have(p_want_have_id)`** — **VULNERABLE, DO NOT CALL**. It has `SECURITY DEFINER` with `EXECUTE` granted to `anon`, zero internal auth check, and does a raw `DELETE FROM want_have WHERE id = ?`. Anyone with the project's anon key can delete any row via a direct REST call. The 2-arg overload is marginally better but still broken. Our admin panel soft-deletes via `UPDATE want_have SET is_deleted = true` through the service-role client instead.

## Data quirks — things that look wrong but are load-bearing

The mobile app reads from these tables. Renaming or fixing the following will break the mobile app.

1. **`user_rattings` table** — the mobile app references this literal table name (typo of "ratings"). Do not rename.
2. **`users.is_varify_email`** — typo of "verify". Do not rename. When displaying it in the admin, alias to `is_verify_email` (with the correct spelling) in the returned TypeScript type.
3. **`chat_rooms.reported_by` is often NULL** even when a report exists — the mobile app sets `reported_reason` and `reported_at` without populating `reported_by`. The admin panel detects reports via `reported_by OR reported_reason OR reported_at` (see `src/app/admin/(protected)/chat/page.tsx` for the `.or()` filter and `[id]/page.tsx` for the `isReported` derivation). Don't rely on `reported_by` alone.
4. **`chat_messages` has no `is_deleted` column** — message deletion is the ONE intentional hard delete in the admin (gated by a two-step confirm button and logged to the audit log). `v2_chat_messages` is the same — its delete (in `/admin/v2-chats/[id]`) is the second intentional hard-delete, and it cascades `v2_message_reactions`.
5. **`projects` table (18 rows)** — dead v1 test data, do not build a view for it. **Not to be confused with `v2_projects`** (the live "My Work" showcase), which the admin *does* surface at `/admin/showcase`.
6. **v2 chat reports live in `v2_reports`, not on the chat row.** Reporting a v2 chat writes a `v2_reports` row (`context='chat'`) — `/admin/reports` is the queue. Such reports carry no chat id, so the report detail resolves the conversation by the canonical participant pair (`reporter ↔ reported_user`) and links to `/admin/v2-chats/[id]`. The per-chat `v2_chats.reported_*` columns are **legacy** (Phase 14) and no longer written by the app (chat reporting was unified onto `v2_reports` in Phase 15 — `useReportChat` is dead). `/admin/v2-chats` still surfaces/clears them defensively for any pre-Phase-15 rows.

## v2 coverage (added after the April 2026 v1-only MVP)

The admin now sees the v2 interaction tables. Three v1 tables are **shared** with v2, so existing views already cover both: `users` (v2 users), `want_have` (v2 listings), `user_rattings` (v2 ratings, now also resolving `trade_proposal_id`). The net-new v2 surfaces:

| Route | Table(s) | Mutating? |
|---|---|---|
| `/admin/reports` | `v2_reports` (+ acts on `want_have`/`users`) | ✅ status/notes + target soft-delete/deactivate |
| `/admin/v2-chats` | `v2_chats`, `v2_chat_messages`, `v2_message_reactions` | ✅ block/clear-report/delete-message |
| `/admin/trades` | `trade_proposals` (+ `want_have` for baskets) | ❌ read-only |
| `/admin/showcase` | `v2_projects` | ✅ soft-delete/restore/feature |
| `/admin/feedback` | `v2_feedback` | ❌ read-only |
| `/admin/v2-notifications` | `v2_notifications` | ❌ read-only |
| `/admin/circles` | `circles`, `circle_members`, `circle_invites`, `circle_bans` | ❌ read-only |

**No new RPCs** — every v2 read/write uses the service-role client directly, like the v1 views. The only admin-side schema change was three additive nullable columns on `v2_reports` (`reviewed_by`, `reviewed_at`, `admin_notes`; SQL in `tribes-app/supabase/functions/sql/v2_reports_admin_review.sql`). (The `circles*` tables behind `/admin/circles` are created + owned by `tribes-app` — the admin only **reads** them via the service-role client; see contract §15.) When v1 is decommissioned, the v1-only views (`/admin/offers`, `/admin/matches`, `/admin/chat`, `/admin/notifications`) and the "v2" label prefixes can be retired.

## File structure — where things live

```
src/
├── middleware.ts                          ← root middleware (Supabase session refresh + /admin gate)
├── app/
│   └── admin/
│       ├── login/
│       │   ├── page.tsx                   ← split-panel login + "Continue with Google"
│       │   └── actions.ts                 ← signIn + signOut + signInWithGoogle Server Actions
│       ├── auth/
│       │   └── callback/route.ts          ← Google OAuth code exchange + role gate
│       ├── no-access/page.tsx             ← authenticated-but-not-admin dead-end (OUTSIDE (protected))
│       └── (protected)/                   ← route group: everything inside runs requireAdmin()
│           ├── layout.tsx                 ← calls requireAdmin(), wraps in AdminShell
│           ├── page.tsx                   ← dashboard landing (uses analytics RPC)
│           ├── users/
│           │   ├── page.tsx               ← list (search/filter/sort/pagination)
│           │   ├── actions.ts             ← updateUser Server Action
│           │   └── [id]/page.tsx          ← detail (uses full_profile RPC)
│           ├── want-have/
│           │   ├── page.tsx               ← list with moderation filters
│           │   ├── actions.ts             ← moderateWantHave (op discriminator)
│           │   └── [id]/page.tsx          ← detail with action buttons
│           ├── matches/page.tsx           ← read-only list (v1)
│           ├── offers/page.tsx            ← read-only list (v1)
│           ├── ratings/page.tsx           ← read-only list (now resolves v2 trade_proposal_id)
│           ├── notifications/page.tsx     ← read-only list (v1)
│           ├── chat/                      ← v1 chat_rooms moderation
│           │   ├── page.tsx · actions.ts · [id]/page.tsx
│           ├── reports/                   ← v2 moderation queue (ACTIONABLE)
│           │   ├── page.tsx               ← v2_reports, open-first + context/status filters
│           │   ├── actions.ts             ← moderateReport (status/notes + soft-delete listing / deactivate user)
│           │   └── [id]/page.tsx          ← target-in-context + ReportActions panel
│           ├── v2-chats/                  ← v2 chat moderation (mirrors v1 chat)
│           │   ├── page.tsx · actions.ts (moderateV2Chat + deleteV2ChatMessage) · [id]/page.tsx
│           ├── trades/                    ← trade_proposals (read-only)
│           │   ├── page.tsx · [id]/page.tsx (baskets + completion handshake)
│           ├── showcase/                  ← v2_projects moderation
│           │   ├── page.tsx · actions.ts (soft-delete/restore/feature) · [id]/page.tsx
│           ├── feedback/page.tsx          ← v2_feedback (read-only)
│           ├── v2-notifications/page.tsx  ← v2_notifications (read-only)
│           └── activity/page.tsx          ← uses events RPC with p_admin_mode
├── components/admin/
│   ├── brand/
│   │   └── TribesLogo.tsx                 ← reusable inlined SVG logomark (currentColor)
│   ├── shell/
│   │   ├── AdminShell.tsx                 ← client wrapper: persistent sidebar lg+, slide-in drawer below
│   │   ├── NavigationList.tsx             ← dumb nav (used in both sidebar and drawer)
│   │   └── MobileTopBar.tsx               ← mobile-only top bar with hamburger
│   ├── users/
│   │   └── UserEditForm.tsx               ← client useActionState form
│   ├── want-have/
│   │   └── ModerationActions.tsx          ← client useActionState action buttons
│   ├── chat/                              ← v1
│   │   ├── ChatRoomActions.tsx            ← block/unblock/clear-report
│   │   └── DeleteMessageButton.tsx        ← inline two-step confirm delete
│   ├── reports/
│   │   └── ReportActions.tsx              ← status/notes + contextual target actions
│   ├── v2-chat/
│   │   ├── V2ChatActions.tsx              ← block/unblock/clear-report (v2_chats)
│   │   └── DeleteV2MessageButton.tsx      ← inline two-step confirm delete
│   └── showcase/
│       └── ShowcaseActions.tsx            ← soft-delete/restore/feature/unfeature
└── lib/
    ├── auth/
    │   └── require-admin.ts               ← THE gate
    └── supabase/
        ├── client.ts                      ← browser client (@supabase/ssr)
        ├── server.ts                      ← server client (respects RLS, represents caller)
        ├── admin.ts                       ← service role client (bypasses RLS, server-only)
        └── middleware.ts                  ← updateSession helper used by root middleware
```

## Design system

### Brand

- **Firefly green** (`firefly` / `#103730`, `firefly-light` / `#1a4d44`) — primary dark
- **Casablanca** (`casablanca` / `#F6B74A`, `casablanca-dark` / `#e5a63a`) — accent yellow
- **Granny** (`#879B97`) — muted
- **Offwhite** (`#FEFEFE`) — light canvas
- **Ink** (`#0D0D0D`) — body text

### Typography

Plus Jakarta Sans (inherited from the marketing site's root layout). Weights used in admin:
- **200–300 (extralight)** — display numbers, hero headings, large labels
- **400 (normal)** — body text, nav labels
- **500 (medium)** — section labels, buttons, badges

Scale (responsive):
- Hero: `text-[28px]` mobile → `text-[44px]` lg → `text-[56px]` xl
- Metric numbers: `text-[44px]` mobile → `text-[60px]` lg
- Body: `text-[13px]`–`text-[15px]`
- Micro-labels: `text-[10px]` uppercase tracking-[0.22em] in granny color

### Animations (all in `src/app/globals.css`)

Six reusable classes, all with `prefers-reduced-motion` fallbacks:

- **`.admin-fade-up`** — single element fade + 6px rise on mount, 420ms out-expo. Use on page headers.
- **`.admin-stagger > *`** — applies fade-up to every direct child with `nth-child` delays (0, 35, 70, … 300ms cap). One class on the parent `<ul>` or grid and every row animates in sequence. Used on dashboard metric grid, activity breakdown, and every mobile card list.
- **`.admin-drawer-anim`** — Radix Dialog.Content keyframe animation (open: slide in 280ms, close: slide out 220ms). Uses `@keyframes` (not `transition`) because Radix waits for `animationend` before unmounting.
- **`.admin-overlay-anim`** — same pattern for the dimmed backdrop.
- **`.admin-lift`** — hover lift (1px rise + soft firefly shadow) on desktop, active press scale (0.985) on touch. Only apply to elements that navigate or trigger an action — false affordance otherwise.
- **`.admin-press`** — active press scale for primary buttons (0.97, 100–160ms). Used on the login submit button.

Durations intentionally capped at 280ms. Easing is `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo) or `cubic-bezier(0.32, 0.72, 0, 1)` for the drawer.

### TribesLogo component

`src/components/admin/brand/TribesLogo.tsx` inlines the logomark SVG with `fill="currentColor"` so it adapts to any background via Tailwind `text-*` classes.

```tsx
// White on dark (sidebar, drawer, login left panel)
<TribesLogo className="w-10 h-10 text-offwhite" />

// Firefly on light (mobile top bar, mobile login header)
<TribesLogo className="w-10 h-10 text-firefly" />
```

One granny `#879B97` accent on the "i" dot stays hardcoded — it's a fixed brand detail that reads correctly on any background.

## Responsive shell — how it adapts

The breakpoint for the sidebar/drawer switch is **`lg:` (1024px)**.

- **≥ 1024px**: `AdminShell` renders a persistent 240px firefly sidebar via `NavigationList`. No top bar.
- **< 1024px**: `MobileTopBar` appears at the top of the viewport (hamburger + section title + TribesLogo). Tapping the hamburger opens a slide-in drawer (Radix Dialog) with the same `NavigationList` content. The drawer auto-closes on route change via a `usePathname` effect.

List views use dual markup:
- **`<div className="lg:hidden">`** — mobile card list
- **`<div className="hidden lg:block">`** — desktop table

Duplicated rendering but simpler than a "responsive table" abstraction, and the two layouts are genuinely different (cards vs. rows).

**Touch target minimum: 44px** on every interactive element. 48px for form inputs. 52px for primary submit buttons. iPhone form inputs use `text-[16px] lg:text-[14px]` to prevent iOS Safari from zooming on focus.

**iOS safe area** handled via `pt-[env(safe-area-inset-top)]` on the mobile top bar and `pb-[env(safe-area-inset-bottom)]` on the main content area.

## How to add a new admin view (recipe)

1. **Check the backend contract** (`docs/admin-backend-contract.md`) for the table and allowed mutations. If it's not there, update the contract first.
2. **Create the list page** at `src/app/admin/(protected)/<entity>/page.tsx`:
   - Parse URL search params for filters/pagination (copy the shape from an existing page — `users/page.tsx` or `want-have/page.tsx` are the canonical references)
   - Use `createAdminClient()` for the SELECT (unless you specifically need RLS-constrained reads)
   - Batch-fetch related users for any foreign keys in the result
   - Render dual markup: `lg:hidden` card list + `hidden lg:block` table
   - Add `admin-fade-up` to the `<header>` and `admin-stagger` to any `<ul>` or grid
   - Add `admin-lift` to any `<Link>` that navigates to a detail page
3. **Create a detail page** at `<entity>/[id]/page.tsx` if the entity is mutating or has rich joined data.
4. **Create `actions.ts`** in the entity folder with `'use server'` at the top:
   - Zod schema for input validation
   - Call `requireAdmin()` first
   - Use `createAdminClient()` for the mutation
   - Write a row to `admin_audit_log` with a canonical action string
   - `revalidatePath(...)` both the list and detail pages
   - Return `UpdateUserState`-style `{ status, message }`
5. **Create a client component** for the form/actions using `useActionState` + `useFormStatus`. See `UserEditForm.tsx` or `ModerationActions.tsx` for the canonical patterns.
6. **Add the nav entry** to `NavigationList.tsx` — pick the appropriate section (Overview / Community / Moderation / System).
7. **Add a title mapping** in `MobileTopBar.tsx` so the mobile top bar shows the section name when you're on this route.
8. **Run `npx tsc --noEmit`** and fix any type errors before committing.

## Deferred security issues

Two `SECURITY DEFINER` Supabase functions have `EXECUTE` granted to `anon` without internal auth checks. They exist in the database; they are not introduced by our rebuild. The user has deferred fixing them.

1. **`delete_want_have(bigint)`** — unauthenticated data-deletion vulnerability. Anyone with the project's anon key can POST to `/rest/v1/rpc/delete_want_have` and delete any want_have row. Our admin panel never calls this function. Fix would be a migration patching the function to check admin role internally (same pattern as `get_admin_dashboard_analytics`). Also affects the 2-arg overload.

2. **`get_user_events_with_summary(…, p_admin_mode)`** — unauthenticated PII disclosure. The function honors `p_admin_mode=true` without checking the caller's role, so any holder of the anon key can dump the entire user activity log across all users. Our admin panel uses this via the admin's JWT, which is correct; the function itself is loose.

Both issues are tracked in `_ff-admin-reference/rpc-discovery.md` at the parent directory. A single migration could patch both by adding the standard "verify auth.uid() and role = 'admin' or RAISE" block at the top of each function. Until fixed, consider the admin panel's use of these RPCs correct but the database-level exposure untreated.

## Environment variables

All three required env vars are documented in `.env.example`:

- **`NEXT_PUBLIC_SUPABASE_URL`** — `https://pnlknurdxcduhbtxdefl.supabase.co`
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — modern publishable key (`sb_publishable_...`). Safe in client bundles. Respects RLS.
- **`SUPABASE_SERVICE_ROLE_KEY`** — **server-only, never `NEXT_PUBLIC_`**. Bypasses RLS. Only used in `src/lib/supabase/admin.ts`.

Vercel has all three set for Production and Preview. `SUPABASE_SERVICE_ROLE_KEY` is blocked from the Development environment (Vercel's rule for sensitive vars) — local dev uses `.env.local` for it.

## Supabase service role key handling

The service role key is secret. Never:
- Prefix it with `NEXT_PUBLIC_`
- Import `@/lib/supabase/admin` from a file with `'use client'`
- Log it anywhere
- Pass it as a prop to a client component
- Commit it to any file

If you suspect it has been exposed, rotate it in Supabase dashboard → Project Settings → API → Reset service_role key, then update Vercel and `.env.local`.

## Two Supabase projects, not one

- **`pnlknurdxcduhbtxdefl`** — the Tribes data/auth project. Contains `auth.users`, `public.users`, and every `public.*` table we read or write. This is the project the admin panel authenticates and queries against.
- **`ktboxzgxzbjajngatuho`** — a different Supabase project used purely as a static CDN for brand logo images. Referenced in `next.config.ts` via a `remotePatterns` entry for image optimization. Do not query this project from the admin panel.

Both appear in `.env.local` and `next.config.ts`. Keep them separate.
