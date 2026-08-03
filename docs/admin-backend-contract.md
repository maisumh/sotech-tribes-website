# Admin Backend Contract

This document is the single source of truth for what the trytribes.com `/admin` section reads, writes, and exposes. It's derived from a live Supabase MCP audit performed in Phase 1 — see `../../_ff-admin-reference/backend-discovery.md` for the raw findings.

Every admin feature must match this contract exactly. If the schema changes, update this file AND any affected Zod validators in the same commit.

---

## Architecture (locked in)

- **Database:** Supabase/Postgres project `pnlknurdxcduhbtxdefl`.
- **Auth:** Supabase Auth. Admin role = `public.users.role = 'admin'` (enum `user_role`).
- **Privileged ops:** server-side only, via `SUPABASE_SERVICE_ROLE_KEY`. Never in client bundles. Always preceded by `requireAdmin()`.
- **Audit trail:** every admin mutation writes one row to `public.admin_audit_log` (schema at the end of this doc).
- **Firebase:** touched only for FCM push notifications. Not in scope for the admin MVP.

### Role check SQL (what `requireAdmin()` runs)

```sql
SELECT role FROM public.users WHERE id = auth.uid();
```

Passes if result = `'admin'`. Redirects to `/` otherwise.

### Service role client pattern

```ts
// Always in this order, always server-side:
await requireAdmin()            // 1. verify identity + role
const supabase = createAdminClient()  // 2. create elevated client
const { data } = await supabase.from('users').select('*')  // 3. query
```

---

## MVP Entity Scope

Eight admin views in MVP. Priority order matters — ship Users first, then Wants/Haves, then the read-only views.

| # | Entity | Table(s) | Rows (audit) | Mutating? |
|---|---|---|---|---|
| 1 | Users | `users` + joins | 96 | ✅ (role, is_active) |
| 2 | Wants & Haves | `want_have` + joins | 223 | ✅ (soft-delete, status) |
| 3 | Matches | `want_have_matches` + joins | 153 | ❌ read-only |
| 4 | Offers | `offers`, `offer_history` + joins | 85 / 112 | ❌ read-only |
| 5 | Chat Rooms | `chat_rooms`, `chat_messages` + joins | 85 / 283 | ✅ (block, delete message) |
| 6 | Ratings | `user_rattings` + joins | 25 | ❌ read-only |
| 7 | Notifications | `notifications` | 97 | ✅ (create broadcast — post-MVP optional) |
| 8 | Activity Log | `user_events` | 166 | ❌ read-only |

**Not in scope:** `projects` (dead test table), `predefine_wants_have` (4 rows, edit via Supabase Studio), `forgot_password_otps`, `app_secrets`, `spatial_ref_sys`.

---

## 1. Users (`public.users`)

### Columns (from Phase 1 audit)
```
id                uuid             PK, references auth.users.id
name              text
email             text
dob               timestamptz
address / state / city / zipcode  text
hobbies           text[]
profile           text             (profile image URL)
is_active         boolean          NOT NULL — used for soft-deactivation
is_profile_setup  boolean          NOT NULL
is_varify_email   boolean          (typo — kept for mobile compat, do not rename)
favorite_match    uuid[]
role              user_role        (enum: admin | user)
fcm_token         text             FCM push token
location          geography        PostGIS
otp / otp_created_at              (password reset)
created_at / updated_at           timestamptz NOT NULL
```

### List view
Columns: `name`, `email`, `role` (badge), `is_active` (toggle display), `city/state`, `created_at`, "last activity" (max `user_events.created_at` for this user, joined).

### Filters
- Text search on `name` and `email` (ILIKE)
- `role` dropdown (admin / user / all)
- `is_active` toggle
- `is_profile_setup` toggle
- Date range on `created_at`
- Location: "within X miles of point" via PostGIS (optional, later)

### Detail view
Full profile card + tabs for:
- Recent `user_events` (activity log, most recent 50)
- `user_rattings` received (with comments)
- `want_have` entries (their wants and haves)
- `chat_rooms` they're in

### Allowed mutations
| Action | Field(s) | Validation | Audit action |
|---|---|---|---|
| Promote to admin | `role = 'admin'` | Cannot self-promote; user must exist | `update_user_role` |
| Demote from admin | `role = 'user'` | Cannot self-demote (prevent locking out all admins); require at least 1 remaining admin | `update_user_role` |
| Deactivate | `is_active = false` | User must exist | `deactivate_user` |
| Reactivate | `is_active = true` | User must exist | `reactivate_user` |

**No hard delete in MVP.** Deactivation (is_active = false) is sufficient. A DELETE policy doesn't even exist in the current RLS.

### Zod schema (example)
```ts
const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['admin', 'user']).optional(),
  is_active: z.boolean().optional(),
}).refine(
  (d) => d.role !== undefined || d.is_active !== undefined,
  { message: 'At least one field must change' }
)
```

---

## 2. Wants & Haves (`public.want_have`)

### Columns
```
id                     bigint           PK
user_id                uuid             FK → users.id
title / description    text
description_prompt     text             (AI prompt used to generate description?)
prompt                 text
category / subcategory text
images                 text[]
is_want                boolean NOT NULL (true = want, false = have)
is_product             boolean NOT NULL (physical product vs service/etc)
min_price / max_price  double precision
status                 post_status enum (open | closed | matched)
is_deleted             boolean DEFAULT false  ← soft-delete supported natively
project_id             bigint           (legacy, ignore)
description_embedding  vector           (pgvector, AI semantic matching)
embedding_generated    boolean DEFAULT false
embedding_retry_count  integer DEFAULT 0
embedding_last_attempt timestamptz
embedding_error_message text
created_at / updated_at timestamptz NOT NULL
```

### List view
Columns: `title`, `user_id` (joined to user name/email), type (`is_want` → "Want"/"Have"), `category`, `status`, `created_at`, `is_deleted` badge.

### Filters
- Text search on `title` and `description`
- `is_want` dropdown (want / have / all)
- `status` dropdown (open / closed / matched)
- `is_deleted` (show/hide deleted)
- `category` dropdown (from distinct values)
- Date range
- User filter (search by user)

### Detail view
Full entry card with images, description, category, price range, embedding status, and who created it (joined to users).

### Allowed mutations
| Action | Field(s) | Validation | Audit action |
|---|---|---|---|
| Soft delete | `is_deleted = true` | Row must exist, not already deleted | `soft_delete_want_have` |
| Restore | `is_deleted = false` | Row must exist, must be deleted | `restore_want_have` |
| Force close | `status = 'closed'` | Row must exist | `close_want_have` |

**No hard delete in MVP.** Soft-delete only. Mobile app should respect `is_deleted = true` (verify).

---

## 3. Matches (`public.want_have_matches`) — read-only

### Columns
```
id             bigint PK (sequence)
user1_want_id / user2_have_id  bigint  (one side)
user1_have_id / user2_want_id  bigint  (other side)
combined_score double precision NOT NULL  (matching algo score)
is_perfect     boolean NOT NULL  (perfect match flag)
status         match_status enum (pending | offered | accepted | rejected)
created_at / updated_at timestamptz
```

### List view
Columns: both users (joined via want_have → users), both entries' titles, `combined_score`, `is_perfect` badge, `status`, `created_at`.

### Filters
- `status`
- `is_perfect` toggle
- Score range
- Date range

### Detail view
Both want_have entries side by side, both users' profiles, score breakdown, status history.

### Mutations
None in MVP.

---

## 4. Offers & Offer History (`public.offers`, `public.offer_history`) — read-only

### `offers` columns
```
id                  uuid PK
match_id            bigint NOT NULL
sender_id           uuid NOT NULL
receiver_id         uuid NOT NULL
current_history_id  uuid  (points to latest negotiation turn)
status              offer_status (pending | accepted | rejected)
rating_by           text[] (who has rated this completed offer)
created_at / updated_at
```

### `offer_history` columns
```
id           uuid PK
offer_id     uuid NOT NULL → offers.id
offer_by     uuid NOT NULL → users.id
status       offer_status
offeror_want_id / offeror_have_id  int[]
offeree_want_id / offeree_have_id  int[]
created_at / updated_at
```

### List view (offers)
Columns: sender, receiver, `match_id`, `status`, created_at, count of history turns.

### Filters
- `status`
- Sender / receiver user search
- Date range

### Detail view
Full negotiation timeline — render `offer_history` ordered by `created_at` as a message-thread-style view showing each counter-offer.

### Mutations
None in MVP.

---

## 5. Chat Rooms & Messages (`public.chat_rooms`, `public.chat_messages`)

### `chat_rooms` columns
```
id               uuid PK
user1_id / user2_id  uuid NOT NULL
offer_id         uuid NOT NULL → offers.id
last_message     text
last_message_at  timestamptz
blocked_by       uuid (admin or user who blocked)
blocked_at       timestamptz
reported_by      uuid
reported_reason  text
reported_at      timestamptz
created_at / updated_at
```

### `chat_messages` columns
```
id                uuid PK
room_id           uuid NOT NULL → chat_rooms.id
sender_id         uuid NOT NULL
message           text
attachment_urls   text[]
is_read           boolean DEFAULT false
is_offer          boolean DEFAULT false
offer_history_id  uuid → offer_history.id
created_at / updated_at
```

### List view (rooms)
Columns: both users, `last_message_at`, message count, reported flag (if `reported_by IS NOT NULL`), blocked flag.

**Priority filter:** show rooms with `reported_by IS NOT NULL AND blocked_by IS NULL` at the top — these are the moderation queue.

### Filters
- Reported-only toggle
- Blocked-only toggle
- Date range
- User search (either participant)

### Detail view (single room)
Message thread in chronological order, with `is_offer` messages styled distinctly. Sender name/avatar. Timestamp. Attachment previews.

### Allowed mutations
| Action | Field(s) / target | Validation | Audit action |
|---|---|---|---|
| Block chat room | `chat_rooms.blocked_by = admin_id`, `blocked_at = now()` | Room must exist, not already blocked | `block_chat_room` |
| Unblock | `blocked_by = null, blocked_at = null` | Must be currently blocked | `unblock_chat_room` |
| Delete message | `DELETE chat_messages` | Message must exist | `delete_chat_message` |
| Clear report | `reported_by = null, reported_reason = null, reported_at = null` | Must be reported | `clear_report` |

---

## 6. Ratings (`public.user_rattings`) — read-only

### Columns
```
id          bigint PK
ratting_to  uuid (ratee)
ratting_by  uuid (rater)
rate        real (float rating, probably 0–5)
comment     text
offer_id    uuid → offers.id
created_at / updated_at
```

### List view
Columns: rater, ratee, `rate`, `comment` (truncated), `offer_id`, created_at.

### Filters
- Rate range (e.g., "show ratings <= 2" to find abuse patterns)
- Rater / ratee user search
- Has-comment toggle
- Date range

### Mutations
None in MVP.

---

## 7. Notifications (`public.notifications`) — read-only for MVP

### Columns
```
id         uuid PK
user_id    uuid NOT NULL (recipient)
title      text NOT NULL
body       text NOT NULL
created_by uuid DEFAULT auth.uid()  ← admin broadcasts get stamped automatically
created_at timestamptz NOT NULL
```

### List view
Columns: `title`, `body` (truncated), recipient (user_id joined), `created_by` (joined), `created_at`.

### Filters
- Recipient user search
- Created-by-admin toggle (distinguish system notifications from admin broadcasts)
- Date range

### Mutations (post-MVP option)
- **Create broadcast** — admin-triggered notification to a single user or a segment. Requires a server-side FCM push call too. Scoped post-MVP.

---

## 8. Activity Log (`public.user_events`) — read-only

### Columns
```
id            uuid PK
user_id       uuid NOT NULL
event_type    user_event_type enum
              (want_added | have_added | match_created | offer_sent |
               chat_started | first_message_sent | offer_accepted |
               offer_rejected | counter_offer_sent)
want_id       bigint
have_id       bigint
match_id      bigint
offer_id      uuid
chat_room_id  uuid
metadata      jsonb DEFAULT '{}'
created_at    timestamptz NOT NULL
```

### List view
Columns: user (joined), `event_type` (badge), related object link (derived from populated FK), `created_at`, metadata preview.

### Filters
- User search
- `event_type` dropdown
- Date range
- Related object IDs (exact match)

### Mutations
None. This is an audit log — the mobile app writes to it. Admin never writes to it.

---

## Admin Audit Log (`public.admin_audit_log`) — NEW TABLE

Created via Supabase migration before Phase 3 mutation work begins. Every admin mutation writes exactly one row here.

### Schema
```sql
CREATE TABLE public.admin_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES public.users(id),
  action      text NOT NULL,
  target_table text NOT NULL,
  target_id   text,         -- text, not uuid, because some tables use bigint
  changes     jsonb,        -- before/after snapshot of mutated fields
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log (created_at DESC);
CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log (admin_id);
CREATE INDEX idx_admin_audit_log_target ON public.admin_audit_log (target_table, target_id);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read the audit log
CREATE POLICY "admins can read audit log"
  ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Nobody writes directly — only the service role key can insert
-- (no INSERT policy = no INSERTs allowed via RLS; service role bypasses RLS)
```

### Action strings (canonical list)
```
update_user_role
deactivate_user
reactivate_user
soft_delete_want_have
restore_want_have
close_want_have
block_chat_room
unblock_chat_room
delete_chat_message
clear_report
create_broadcast       (post-MVP)
```

### Usage from Server Actions
```ts
await supabase.from('admin_audit_log').insert({
  admin_id: adminUser.id,
  action: 'update_user_role',
  target_table: 'users',
  target_id: targetUserId,
  changes: { from: 'user', to: 'admin' },
})
```

Every mutation Server Action ends with this pattern. Non-negotiable.

---

## Enums (reference)

```
user_role        = {admin, user}
match_status     = {pending, offered, accepted, rejected}
offer_status     = {pending, accepted, rejected}
post_status      = {open, closed, matched}
user_event_type  = {want_added, have_added, match_created, offer_sent,
                    chat_started, first_message_sent, offer_accepted,
                    offer_rejected, counter_offer_sent}
```

Do not add values to these enums without coordinating with the mobile app team. Enum values are a shared contract across codebases.

---

## Cross-cutting invariants

1. **No hard deletes in MVP** except for individual chat messages. Everything else is soft-delete or status change.
2. **Every mutation writes to `admin_audit_log`.**
3. **`requireAdmin()` runs before any service role client is created.** No exceptions.
4. **Enums are enforced at the database level.** Zod schemas must match enum values exactly.
5. **The `user_rattings` table name stays misspelled.** Don't fix it.
6. **`public.users.is_varify_email` stays misspelled** for the same reason.
7. **Admin mutations must not fire FCM push notifications for MVP.** That's post-MVP scope.

---

# v2 Entities (added after the v1-only MVP)

The admin now covers the v2 (`tribes-app/` RN+Expo) interaction tables. These are **net-new, additive** tables the legacy FlutterFlow app is unaware of. Three v1 tables are **shared** and already covered by existing views, with small additions noted below.

All v2 reads/writes use the **service-role client directly** (no new RPCs). Every mutation still writes one `admin_audit_log` row.

## 9. Reports (`public.v2_reports`) — ACTIONABLE moderation queue

The in-app Report flow (App Store Guideline 1.2 compliance) inserts `status='open'` rows here. This is the staff moderation queue.

```
id                  uuid PK
reporter_id         uuid NOT NULL → users.id
reported_user_id    uuid → users.id        (profile/chat reports)
reported_listing_id bigint → want_have.id  (listing reports; ON DELETE SET NULL)
context             text CHECK (listing | profile | chat | other)
reason              text NOT NULL
status              text CHECK (open | reviewed | actioned | dismissed)
created_at          timestamptz NOT NULL
-- admin-only, additive (added for the admin; app never reads them):
reviewed_by         uuid → users.id
reviewed_at         timestamptz
admin_notes         text
```

- **List** (`/admin/reports`): default filter `open`, newest first; status + context filters; all-time open count as backlog gauge.
- **Detail**: target rendered in context (profile → user link; listing → want_have link + images; chat → resolved v2 chat link via the participant pair).
- **Mutations**: set status (`mark_reviewed`/`mark_actioned`/`dismiss`/`reopen`) + `admin_notes` → audit `update_v2_report_status`. Target actions reuse `want_have` soft-delete (`soft_delete_want_have`) and `users` deactivate (`deactivate_user`).
- **Chat reports**: a `context='chat'` report is the master signal here. It carries no chat id — the detail page resolves the conversation from the `(reporter, reported_user)` pair → links to `/admin/v2-chats/[id]`. The legacy per-chat `v2_chats.reported_*` columns (Phase 14) are **no longer written** by the app (chat reporting was unified onto `v2_reports` in Phase 15); `/admin/v2-chats` still surfaces/clears them defensively for any pre-Phase-15 rows.

## 10. v2 Chats (`public.v2_chats`, `public.v2_chat_messages`, `public.v2_message_reactions`)

Pair-based chat (one row per ordered pair, `CHECK user_a_id < user_b_id`). Mirrors the v1 chat moderation view.

```
v2_chats: id, user_a_id, user_b_id, last_message_at, last_message_preview,
          last_message_sender_id, status text CHECK (in_conversation|exchanged|rejected),
          blocked_by, blocked_at, reported_by, reported_reason, reported_at,
          archived_by_a, archived_by_b (per-user hide; NOT moderation-relevant), created_at, updated_at
v2_chat_messages: id, chat_id → v2_chats, sender_id, kind text CHECK (text|trade|system),
          body, trade_proposal_id → trade_proposals, read_at,
          edited_at, deleted_at (tribes-app Phase 27 — edit / "unsend"; body RETAINED on unsend), created_at
v2_message_reactions: id, message_id → v2_chat_messages (ON DELETE CASCADE), chat_id, user_id, emoji, created_at
```

- **List/Detail** (`/admin/v2-chats`): priority-sort reported; thread renders by `kind` (text bubble / system pill / trade card linking `/admin/trades/[id]`); per-message reaction counts. A message with `edited_at` shows an **Edited** tag; one with `deleted_at` shows an **Unsent** tag and renders its retained `body` **struck-through** with a "retained for moderation" caption (the whole point of soft-unsend — the moderator still sees what was retracted). `archived_by_*` is a per-user client hide and is **not** surfaced in the admin.
- **Mutations**: `block_v2_chat`, `unblock_v2_chat`, `clear_v2_chat_report`; `delete_v2_chat_message` (hard-delete, the 2nd intentional hard delete — cascades reactions).

## 11. Trades (`public.trade_proposals`) — read-only

v2 trade pipeline (replaces offers/matches for new-app users).

```
id, proposer_id, recipient_id, target_want_have_id (legacy singular),
target_want_have_ids bigint[] / offered_want_have_ids bigint[] (symmetric baskets),
message, status text CHECK (pending|accepted|rejected|cancelled|countered|completed),
is_help_offer, chat_id → v2_chats, proposer_completed_at, recipient_completed_at, created_at, updated_at
```

- **Detail** (`/admin/trades`): both baskets resolved to `want_have` titles (prefer arrays, fall back to singular), dual-confirm completion handshake, linked chat.

## 12. Showcase (`public.v2_projects`) — "My Work" UGC moderation

```
id, user_id, title, description, images text[], category,
source text CHECK (portfolio | trade), trade_proposal_id → trade_proposals,
partner_user_id, featured bool, is_deleted bool, created_at, updated_at
```

- **Mutations** (`/admin/showcase`): `soft_delete_v2_project` / `restore_v2_project` / `feature_v2_project` / `unfeature_v2_project`. Soft-delete only — never hard-delete UGC. ⚠️ **Not** the dead v1 `projects` table.

## 13. Feedback (`public.v2_feedback`) — read-only

```
id, user_id (nullable → anonymous), category text CHECK (general|bug|idea|praise|other),
message NOT NULL, app_version, created_at
```

## 14. v2 Notifications (`public.v2_notifications`) — read-only

```
id, user_id, type text CHECK (trade_proposal|trade_accepted|trade_declined|trade_countered|
                              trade_cancelled|new_message|new_match|system|
                              circle_invite|circle_request|circle_approved|
                              circle_role_changed|circle_removed),
title, body, data jsonb, read_at, created_at
```

Separate from the v1 `public.notifications` view; merge after v1 sunset. (The `circle_*` types + the `v2_notification_prefs.circles_enabled` push flag were added with Circles — see §15.)

## 15. Circles (`public.circles` + members / invites / bans) — read-only moderation

Invite-only sub-communities (church / school / neighborhood) in `tribes-app`. **Created + owned by the mobile app** (additive-only); the admin only **reads** them via the service-role client at `/admin/circles` (list + detail). All writes go through the app's SECURITY DEFINER RPCs — the admin performs **no** Circle mutations.

```
circles          id, name, description, type, is_discoverable, join_mode,
                 created_by → users, member_count, is_deleted, created_at, updated_at
circle_members   (circle_id, user_id) PK, role circle_role(owner|admin|member),
                 status(active|pending|removed|left), invited_by, joined_at
circle_invites   id, circle_id, code UNIQUE, created_by, role, expires_at,
                 max_uses, use_count, revoked, created_at
circle_bans      (circle_id, user_id) PK, banned_by, reason, created_at
```

Full schema + RPC + RLS spec lives in `tribes-app/INVARIANTS.md §18` + `tribes-app/supabase/functions/sql/v2_circle*.sql`. The `circle_role` enum is **v2-only** (not one of the shared locked enums).

## 16. Rollout gate — areas, admissions, waitlist, invites (2026-07-26)

Backing tables for the staged geographic rollout. **Applied to prod; admin UI built 2026-08-03 at `/admin/rollout`** (control room + `[areaId]` detail + `waitlist` leads). Source of truth for the DDL: `../../tribes-app/supabase/functions/sql/v2_rollout_gate.sql`; rules: `tribes-app/INVARIANTS.md` §23.

⚠️ **These four RPCs need `createAdminClient()`, NOT `createClient()` — the opposite of the usual rule.** They are `SECURITY DEFINER` but do **no internal role check**; they are protected purely by GRANT (`revoke all … from public, anon, authenticated`, never re-granted), so only the service role can execute them. Calling them with the cookie-session client fails on permission. **`requireAdmin()` is therefore the only authorization gate on them** — and they must never be granted to `authenticated`, which would let any logged-in user open an area and admit themselves.

⚠️ **`v2_admit_area` silently consumes account-less web leads.** It flips every `user_id IS NULL` lead in the area to `status='notified'` and returns their addresses in `web_lead_emails` **without sending anything**. Drop that return value and those people are unreachable forever — they never appear as `waiting` again. `/admin/rollout/[areaId]` surfaces the list in a copyable box for exactly this reason; any other caller must do the same.

| Table | Purpose |
|---|---|
| `v2_areas` | A named rollout area. `status = open \| waitlist \| closed`. `slug` is the **stable identifier** — the GHL tag keys on it, so treat a rename of `name` as safe and a rename of `slug` as breaking. |
| `v2_area_zips` | `zip` (PK, `^[0-9]{5}$`) → `area_id`. One area per ZIP. |
| `v2_access_config` | Singleton. `invite_only` is the **global master lock**; per-area status only takes effect once it's off. |
| `v2_admissions` | One row per user: `status = admitted \| waitlisted`, plus `reason` and the area/invite that admitted them. The audit ledger. |
| `v2_waitlist` | Leads. `user_id` is **nullable** — a null means an account-less web signup from `/api/waitlist`. |
| `v2_invite_redemptions` | Who redeemed which invite. |
| `invites` *(extended)* | Gained `max_uses` / `use_count` / `expires_at` / `revoked` / `circle_id` / `area_id` / `label` / `batch_id`. **`max_uses IS NULL` means UNLIMITED** (the evergreen community code), not single-use. |

**Read these two views rather than assembling the joins yourself:**
- `v2_waitlist_demand` — demand per ZIP/area, including an **`unmapped`** bucket (ZIPs people want that no area covers). This is the "which area do we open next" screen.
- `v2_area_readiness` — per area: zip_count, residents, open_listings, waitlisted.

**Mutations go through the SECURITY DEFINER RPCs, never direct writes:** `v2_set_area_status`, `v2_admit_area(area, limit, notify)`, `v2_assign_area_zips`, `v2_grant_admission`. Opening an area is deliberately **two steps** — flipping status is silent; `v2_admit_area` is what promotes waiting users and notifies. `p_limit` is load-bearing: every notification insert fires the push webhook.

⚠️ **`users.admission_status` / `admission_area_id` are read-only to clients.** The migration revokes table-level UPDATE on `public.users` from `anon`/`authenticated` and re-grants it column-by-column excluding those two. **Never restore a blanket `grant update on public.users`** — a column-level revoke is a no-op under a table-level grant, which is how the gate was bypassable in the first draft.

## Shared tables — v2 additions to existing views

- **`users`** — also covers v2 users. Detail page (`/admin/users/[id]`) shows a "Tribes v2" panel: `bio` (read-only display), reports-against count, `v2_user_blocks` (blocking / blocked-by), trades & showcase counts. `bio` is **not** admin-editable (users self-edit in app).
- **`want_have`** — v2 listings live here too; existing view + soft-delete already apply.
- **`user_rattings`** — gained `trade_proposal_id uuid → trade_proposals` (v2-linked ratings, where `offer_id` is null). Ratings view surfaces a "v2 trade" chip.

## v2 status values (text + CHECK, NOT Postgres enums)

```
v2_reports.status        = {open, reviewed, actioned, dismissed}
v2_chats.status          = {in_conversation, exchanged, rejected}
trade_proposals.status   = {pending, accepted, rejected, cancelled, countered, completed}
v2_projects.source       = {portfolio, trade}
v2_feedback.category     = {general, bug, idea, praise, other}
v2_notifications.type    = {trade_proposal, trade_accepted, trade_declined, trade_countered,
                            trade_cancelled, new_message, new_match, system}
```

These are CHECK constraints (not `CREATE TYPE` enums) and are owned by the v2 app — coordinate with the tribes-app team before changing.

## v2 audit action strings (appended to the canonical list)

```
update_v2_report_status, soft_delete_v2_project, restore_v2_project,
feature_v2_project, unfeature_v2_project, block_v2_chat, unblock_v2_chat,
clear_v2_chat_report, delete_v2_chat_message
```
(`admin_audit_log.action` has no DB CHECK — the list is convention.)
