# Tribes Website & Admin — Next.js Repository

## Project
This repository contains three distinct surfaces that share a single codebase:

1. **Marketing site** (`/`, `/neighbors`, `/partners`, `/feedback`, `/mvp`) — a Next.js 15 recreation of the Tribes landing page originally built with vanilla HTML/CSS/JS on GHL. **Pixel-fidelity with the original is no longer the goal**: the original was a pre-launch waitlist page, and the August 2026 launch pass (below) deliberately diverged from it.

2. **Editorial surface** (`/privacy`, `/terms`, `/support`, `/home2`) — App Store submission pages (April 2026) + a redesigned home preview. Editorial aesthetic: extralight display type, asymmetric layouts, fluid `clamp()` typography, casablanca italic accents, numbered sections. No emoji icons — typographic numbered prefixes instead.
3. **Admin panel** (`/admin/*`) — an internal staff tool that replaced a legacy FlutterFlow admin in April 2026. Connects directly to the Tribes Supabase database. See [docs/admin-architecture.md](./docs/admin-architecture.md) before touching anything under `src/app/admin/` or `src/components/admin/`.

### ⚠️ August 2026 launch pass — read before editing marketing copy

The site advertised a "Launching Spring 2026" waitlist until 2026-08-23, six weeks after the app went public on both stores. The pass that fixed it established rules that are easy to undo by accident:

- **The site is download-first.** Primary CTA everywhere is the App Store / Play badge pair (`src/components/ui/StoreBadges.tsx`, URLs in `src/lib/store.ts`). There is no waitlist gate — the app is public and **admission is decided in-app** by the rollout gate. Never reintroduce "Join the Waitlist" as the primary action.
- **`GHLForm` is deleted.** It was a GoHighLevel iframe served from `link.thesocialtech.net` — **SoTech's** CRM, not the client's (verified: the form is not in Tribes' GHL location `U5e1EQQhkA9AaPpvfXQt`). Its leads never reached `v2_waitlist`, so they were invisible to `/admin/rollout`'s demand-by-ZIP map. Every form on the site now posts to `/api/waitlist`.
- **Only shipped features may be described.** `Marketing/AppStore/aso-metadata-v2.md` is the positioning source of truth. The old copy advertised Tribe Feeds, Multi-Tribe Participation, address verification and a Founding Member programme — none of which exist. `FoundingMember.tsx` is deleted.
- **A group is a "Circle", never a "tribe".** The company is Tribes; the sub-community feature is a Circle. Calling a group a "tribe" in copy sets an expectation the app breaks. Circle *creation* is behind the coming-soon Premium gate; *joining* is free — say both.
- **Rollout language.** The site may say where we are *starting* ("Starting in Houston, growing block by block"). It must never say "invite only", never name a ZIP, and never imply a reader elsewhere is blocked. Dan reversed the invite-only model on 2026-08-14 precisely because that framing kills marketing.
- **No em dashes in rendered copy.** Same house rule as the store listings. Use real punctuation instead: a sentence break, a colon before a list, parentheses for an aside, commas for a parenthetical. Decorative editorial kickers use a middot, not a leading em dash. ⚠️ Search for the **unicode escape** (`\u2014`) as well as the literal character — six hid in the `/partners` case studies and survived a literal-only sweep. Answers inside a `ClientFAQ` accordion are not in the initial HTML, so a served-HTML check misses them too; grep the source.
- **`WaitlistForm` needs ~900px.** It was designed for the 1440px `/home2` grid, and its two-column rows collapse below that: the ZIP field leaves a hole and the role pills wrap. Both CTA containers are `max-w-[920px]` for that reason. Don't narrow them.
- **Don't stack two badge pairs.** `StoreBadges` renders in the footer on every page; a page-level pair sitting a few hundred pixels above it reads as a rendering bug. The footer pair uses `compact` so it reads as utility rather than repeating the primary CTA.

Full audit and the tiers of work behind this: `../docs/v2/website-audit-2026-08.md`.

## Stack
- **Framework:** Next.js 15.5 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom colors (firefly, granny, casablanca, offwhite, ink)
- **Animations:** CSS @keyframes for hero entrance, framer-motion ScrollReveal for scroll-triggered reveals
- **Font:** Plus Jakarta Sans (via next/font/google) — used for both headings and body. The editorial surface leans heavily into `font-extralight` (200) for display type.
- **Forms:** custom react-hook-form + zod throughout — `SupportForm` → `/api/support` (still stubbed) and `WaitlistForm` → `/api/waitlist` (wired to Supabase + Tribes' GHL — see the API routes section below). `WaitlistForm` takes `variant`, `defaultRole` and `formName` props so one component serves the home "not open yet" capture and the `/partners` enquiry. The `GHLForm` iframe was deleted in the August 2026 launch pass.
- **Deployment:** Vercel (auto-deploys from main branch)

## Original Reference
The original HTML/CSS lives at: `../Website/LandingPage/Current/` (index.html, neighbors.html, partners.html, style.css)

Always compare against the original when making visual changes.

## Key Patterns
- **Hero animations:** Pure CSS (`animate-hero-fade-up` class in globals.css), NOT framer-motion — avoids hydration-dependent skip/stutter on mobile
- **Scroll animations:** `ScrollReveal` component (framer-motion `whileInView`) for below-fold content
- **Counter animations:** `useCountUp` hook in `src/hooks/useCountUp.ts` — used by Neighborhood stats and Impact metrics
- **FAQ accordion:** `ClientFAQ` component with mutual exclusivity (one open at a time). Pass `numbered` prop for the magazine-TOC variant used on editorial pages.
- **Long-form prose:** `.legal-content` class in globals.css styles h2/h3/p/ul/li/a/strong/em inside it — used by `/privacy` and `/terms`. Spares us a typography plugin.
- **Editorial typography:** Fluid headings use `style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}` rather than fixed Tailwind breakpoints. Scales smoothly and prevents "neighborhood." from clipping in narrow columns.
- **iOS safe area:** body bg is `#103730` (firefly green) so iOS safe area matches footer; `#main` has white bg
- **Section backgrounds:** Match original's class system — `section--sage` = `bg-granny`, `section--gray` = `bg-gray-50`, `section--cta` = `bg-firefly`

## Pages
Marketing:
- `/` — Main landing page (14 sections)
- `/neighbors` — For Neighbors sub-page
- `/partners` — For Partners sub-page

Editorial (App Store submission + preview):
- `/privacy` — Privacy Policy (CCPA/CPRA 2026, TDPSA, DMCA, etc.)
- `/terms` — Terms of Service (AAA arbitration + 30-day opt-out, Apple EULA block, DMCA procedure)
- `/support` — Support URL for App Store (contact card + 10-item numbered FAQ + contact form)
- `/delete-account` — account/data deletion steps (added 2026-07-07; the URL is DECLARED in Google Play's Data-safety form and will be reused in Apple's App Privacy label — don't remove or rename without updating both stores)
- `/reset-password` — **the password-reset handler for the mobile app** (added 2026-08-09, noindex). Consumes a Supabase recovery link and sets the new password. `ResetPasswordForm` parses the recovery session out of the URL **fragment** (the mobile client is implicit-flow — no `flowType: 'pkce'` — so there is no code_verifier and the browser can finish the reset alone; a PKCE client would make this page impossible). It deliberately uses a **bare `@supabase/supabase-js` client with `persistSession: false`**, NOT `@/lib/supabase/client` — that one is cookie-backed via `@supabase/ssr`, and a recovery session for an ordinary user must never be written into cookies on the same origin as `/admin`. ⚠️ **Do not remove or rename**: this exact URL is the Supabase project's `site_url` and is on its redirect allow-list, so deleting it breaks password reset for every installed app. Background: `../tribes-app/docs/progress.md` → "Password reset repaired".
- `/costs` — **Running costs and projections for Dan** (added 2026-08-23, noindex, unlinked). Same house style as `/update`: what Tribes pays today, the month-by-month AI spend, the projection at 10,000 members, and what identity verification would cost. Figures are read from live billing and the production database, so **this page is the one that gets updated as numbers move** — its companion is the fixed-date architecture PDF in `../docs/v2/pdf/`, which deliberately does not. ⚠️ Two cost facts that are easy to get wrong: Expo is billed to Tribes, and website hosting ($100/mo) plus the Marketing Automation Platform ($150/mo) run on SoTech accounts and are **not currently billed to Tribes** — the page shows them at standard rate, labelled as such.
- `/home2` — Editorial redesign preview (noindex). Unlinked from nav. Its hero copy was the model for the August 2026 home rewrite, so the two now agree on positioning; its layout is still the unpromoted editorial treatment.

API routes:
- `/api/support` — contact form handler (`SupportForm`). **Still a stub** (validates + `console.log`). TODO: wire to a sender to forward to info@trytribes.com. **Use the Tribes Resend account** set up 2026-08-09 (sending domain `auth.trytribes.com`, already DKIM/SPF-verified) rather than the older SendGrid plan — the account exists, is Tribes-owned, and the free tier covers this comfortably. Needs a send-only Resend key in Vercel env.
- `/api/waitlist` — waitlist signup handler (`WaitlistForm` — used by `/`, `/partners` and `/home2`). **WIRED (2026-07-27).** Writes `v2_join_waitlist` in Supabase (source of truth, insert-only, ANON key — the RPC is granted to `anon` so no service role is needed; don't "upgrade" it to `createAdminClient()`), then mirrors the lead into GoHighLevel via `src/lib/ghl.ts`. The GHL step is **fail-open**: a CRM outage logs a warning and still returns `ok`, because the row is already safe in Supabase. Needs `TRIBES_GHL_PIT` + `TRIBES_GHL_LOCATION_ID` in the environment — see the ⚠️ in `.env.example` about why those names are namespaced.
- `/api/feedback` — the **web** F&F feedback handler (`FeedbackForm`, used by the noindexed `/feedback` page). Forwards to a GHL inbound webhook, but `GHL_FEEDBACK_WEBHOOK_URL` is unset in Vercel production, so it fail-opens and submissions from that page are discarded. Low impact — the page is `disallow`ed in `robots.ts` and was an F&F-wave artifact.
  ⚠️ **This is NOT the in-app feedback path and must not be confused with it.** Feedback from the mobile app goes `tribes-app/app/feedback.tsx` → `useSubmitFeedback` → `supabase.from('v2_feedback')` → surfaced at `/admin/feedback`. That path works and never touches GHL. If the web form is worth keeping at all, the consistent fix is to have it write to `v2_feedback` too, so all feedback lands in one place — not to wire up a second destination.

### GoHighLevel contact sync (`src/lib/ghl.ts`)

**Leads live in GHL; users live in Supabase.** This module only ever writes *leads* — waitlist signups and invite recipients — never the authenticated user base. Someone crosses that boundary when the rollout gate admits them.

Division of labour: **code owns the data and the targeting; GHL owns the message and the send.** We upsert a contact with tags; a GHL workflow triggers on a tag and mails from `news.trytribes.com`. That keeps segmentation versioned in this repo while the copy stays editable without a deploy.

Tags are the trigger contract — renaming one silently stops an automation with no error anywhere:
- `waitlist` — every waitlist lead (the "you're on the list" trigger)
- `zip:77531` — exact ZIP
- `area:brazoria-gmz` — rollout area, or `area:unmapped`. **Always the `area_slug` returned by the RPC, never a slugified `area_name`** (the display name is editable; the slug is not).
- `role:neighbor` — what they said they're here for

ZIP goes to the standard `postalCode` field, **not** the location's `contact.zip_code` custom field — that one is NUMERICAL and would mangle leading-zero ZIPs (02134 → 2134).

## OG Images
Static 1200x630 PNGs in `public/` — one per page (`og-home.png`, `og-neighbors.png`, `og-partners.png`). Generated via `scripts/generate-og.mjs` using sharp. To regenerate: `node scripts/generate-og.mjs` (all) or `node scripts/generate-og.mjs og-home` (single).

## Brand Assets
- **Logo files:** `public/tribes-logo-white.png` (white logo for dark backgrounds), `public/tribes-logo-white.svg`
- **Favicon:** `public/favicon.png` (sourced from `../Marketing/Tribes_Brand_Assets/:Logo/PNG/Fav Icon-2.png`)
- **Source brand assets:** `../Marketing/Tribes_Brand_Assets/` (logos, icons in PNG and SVG)

## Analytics & event tracking (June 2026+)
- **GA4** via `@next/third-parties` — property `trytribes.com` (518241169), measurement ID `G-JDM03V14GB`. Loader is `src/components/analytics/Analytics.tsx`, mounted once in the root layout.
- **Loads in production only** (`NODE_ENV === "production"`, which includes Vercel preview deploys) and **never on `/admin`** — so staff activity stays out of the marketing property. Dev (`next dev`) sends nothing.
- Pageviews (initial + client-side route changes) are handled by GA4 **Enhanced Measurement** — we do not fire `page_view` manually (would double-count).
- **Events** (`src/lib/analytics.ts` `track()` helper): **`download_click`** (fired by `StoreBadges` with `platform` = ios/android and a `location`) — this is the primary conversion now; **`get_app_click`** (delegated listener on every `a[href="#get-the-app"]`, with `location`); `outbound_click` (store hosts excluded, so downloads aren't double-counted); `generate_lead` (native waitlist forms, with `form_name`); `form_submit` (support + feedback).
- ⚠️ **Renamed in the August 2026 launch pass**: `join_waitlist_click` → `get_app_click`, and `waitlist_form_view` is gone with the GHL iframe. **Re-mark Key events in GA4** (Admin → Events) as `download_click` + `generate_lead`; the old names receive no traffic.
- `NEXT_PUBLIC_GA_ID` overrides the measurement ID per-deploy (e.g. a staging stream); defaults to the live ID so it can't silently break.
- Canonical host is the **apex** `trytribes.com` (matches `metadataBase`, `robots.ts`, `sitemap.ts`, and the explicit `alternates.canonical` added in the launch pass). ⚠️ **Live behaviour disagrees**: Vercel currently 307s apex → **www**, the opposite direction. The fix is one domain setting in Vercel (make the apex primary), not a code change — until it lands, search engines are told apex while being served www.
- `src/app/robots.ts` + `src/app/sitemap.ts` are App Router metadata routes. Robots blocks `/admin`, `/api`, and the demo/preview/client pages (`/home2`, `/mvp`, `/update`, `/feedback`, `/costs`); sitemap lists public pages only. GSC: `sc-domain:trytribes.com` (domain property, already verified — covers www + apex).

## Build & Dev
```
npm install
npm run dev    # local dev server
npm run build  # production build
```

---

## Editorial surface (April 2026+)

The four pages at `/privacy`, `/terms`, `/support`, `/home2` share a single editorial design language. Before touching any of them, know:

### Content rules
- **Operator is Tribes**, a company based in Houston, Texas. SoTech Social Technologies is the dev shop, not the app operator — don't reintroduce SoTech attribution.
- **Public contact email is `info@trytribes.com`** across every legal/support page and route handler.
- **Terminology: "Offering" / "Seeking"** — these match the production app UI (home screen shows "What You're Offering" / "What You're Seeking"). Don't revert to "have / want" in any user-facing copy.
- **Governing law:** Texas (defaulted in `/terms` via `GOVERNING_STATE`). There's a TODO at the top of `src/app/terms/page.tsx` flagging that Tribes' exact legal entity name and state of formation must be confirmed before App Store submission.

### Design language
- Extralight weights (`font-extralight` / 200) for display headlines
- Casablanca italic emphasis on key words: `<em className="font-light not-italic text-casablanca">word</em>`
- Numbered section kickers ("— SUPPORT · 001") via the shared `Kicker` helper in `src/app/home2/page.tsx`. Responsive-centered by default (center on mobile, left on md+).
- Fluid `clamp()` heading sizes, not fixed Tailwind breakpoints
- **No emoji icons** — anywhere. Replaced with big extralight numbered prefixes and short uppercase labels like "TRIBE", "FEATURE", "NEIGHBOR"
- Casablanca gold 6×6 squares as corner marks on dark cards
- Hairline borders (`border-firefly/10` to `/15`) instead of heavy dividers
- Mobile layouts always `text-center`, desktop layouts `md:text-left` or `lg:text-left` — always widen paragraph `max-w` with `mx-auto md:mx-0` so the centering actually reads

### App Store submission (unfinished)
- **Legal entity confirmation** for Tribes (name + state) before submission — see TODO in `src/app/terms/page.tsx`
- **DMCA agent registration** with US Copyright Office ($6, 3-year renewal) to claim safe harbor for user-uploaded photos
- **SendGrid wiring** for `/api/support` — see TODO in the route handler
- ~~**GHL Contacts API wiring** for `/api/waitlist`~~ — done 2026-07-27; needs `TRIBES_GHL_*` env vars set in Vercel to actually mirror to the CRM
- **ATT prompt confirmation** — a TODO in `/privacy` asks the FlutterFlow build team to confirm ATT is actually implemented on iOS before the Meta SDK disclosure sentence ships

When promoting `/home2` to production, move `src/app/home2/page.tsx` to `src/app/page.tsx` (and delete the old composition-based Home that imports `<Hero />`, `<ValueProp />`, etc.). The `/home2` version pulls content from `lib/constants.ts`, so no content migration is needed.

---

## Admin Panel (April 2026+)

A mobile-responsive staff admin at `/admin/*` — separate surface from the marketing pages but lives in the same repo and deploys through the same Vercel pipeline.

### Critical things to know before touching it

**Data source**: Supabase (Postgres) is the source of truth. Firebase is used only for FCM push notifications to the mobile app — there is **no Firestore data**, no Storage data, no Firebase Auth. Any instinct to read/write from Firebase is wrong.

**Two Supabase projects in play**:
- `pnlknurdxcduhbtxdefl` — the Tribes data/auth project. All admin queries hit this one.
- `ktboxzgxzbjajngatuho` — a separate CDN project for brand logo images, referenced in `next.config.ts`. Do not query it.

**Auth gate**: three layers. `src/middleware.ts` → `(protected)/layout.tsx` calls `requireAdmin()` → every Server Action and Route Handler calls `requireAdmin()` before touching anything. Never skip any of them. The middleware alone is not sufficient (CVE-2025-29927). **Sign-in is email/password OR Google SSO** (`signInWithGoogle` → `/admin/auth/callback`); admin access is the `users.role = 'admin'` column (no `admin_users` table), and authenticated **non-admins land on `/admin/no-access`** (not the marketing homepage). ⚠️ **The Google OAuth `redirectTo` must carry NO query string** — a query string makes Supabase's redirect-allow-list match fail, and a failed match is **silently replaced by the project's Site URL** rather than erroring. (Updated 2026-08-09: Site URL used to be the mobile `tribes://` scheme, so the fallback landed on an unopenable link and froze the tab while auth had actually succeeded. It is now `https://trytribes.com/reset-password`, so the same mistake now dumps an admin on the password-reset page instead of freezing — still wrong, just less baffling. The rule is unchanged: **no query string**.) This silent-substitution behaviour is the same one that broke mobile password reset for two months — see `../tribes-app/docs/ai-agent-guide.md` → "Password reset: `redirectTo` is a *request*, not a guarantee". Full detail + the GCP `tribes-a624c` consent-screen note in `docs/admin-architecture.md`.

**Two server-side Supabase clients**, and the rule matters:
- `createClient()` from `src/lib/supabase/server.ts` — regular client, respects RLS, carries the admin's JWT. Use for RPCs that check `auth.uid()` internally.
- `createAdminClient()` from `src/lib/supabase/admin.ts` — service role, bypasses RLS. Use for direct writes and RLS-bypass reads. Never import from a client component.

**Every admin mutation writes a row to `public.admin_audit_log`** with a canonical action string. There are ~10 allowed action strings — see the architecture doc for the list.

**Do NOT call `public.delete_want_have`** — a SECURITY DEFINER RPC with no auth check that used to have EXECUTE granted to `anon` (an unauthenticated "delete any listing" hole). **Closed 2026-08-23** — EXECUTE revoked from `PUBLIC`/`anon`/`authenticated`, so it now returns 401. We soft-delete via `UPDATE want_have SET is_deleted = true` through the service role client instead.

**Data quirks that look like bugs but aren't**:
- `user_rattings` table — typo of "ratings", load-bearing (mobile app reads that name).
- `users.is_varify_email` — typo of "verify", load-bearing.
- `chat_rooms.reported_by` is often NULL even when a report exists. Check `reported_by OR reported_reason OR reported_at` when detecting reports.
- `chat_messages` has no `is_deleted` column — message deletion is the ONE intentional hard-delete in the entire admin. (`v2_chat_messages` delete is the second; it cascades reactions.)
- `projects` table is dead v1 test data — do not build UI for it. **Not** `v2_projects` (the live "My Work" showcase, surfaced at `/admin/showcase`).

**v2 coverage**: the admin sees the v2 (`tribes-app/`) interaction tables — `/admin/reports` (`v2_reports` moderation queue, actionable), `/admin/v2-chats`, `/admin/trades`, `/admin/showcase`, `/admin/feedback`, `/admin/v2-notifications`, `/admin/circles` (read-only Circles moderation — list + members/invites/bans; the `circles*` tables are created/owned by `tribes-app`), `/admin/rollout` (**the staged geographic launch — actionable**: master lock, area readiness, demand-by-ZIP map, per-area ZIP mapping / status / admit, waitlist leads, and `/admin/rollout/invites` for minting + revoking codes. **The gate is LIVE on both stores as of 2026-08-03**, so this console is the only way to let anyone in — minting is not a nicety. `invites.max_uses IS NULL` means **unlimited**, which is why the mint form makes "unlimited" an explicit tick rather than a blank-field default. See the two ⚠️ in `docs/admin-backend-contract.md` §16 — its RPCs need the **service-role** client, the reverse of the usual rule, and `v2_admit_area` silently consumes account-less web leads). `users`/`want_have`/`user_rattings` are shared, so existing views already cover v2 users/listings/ratings. All v2 work is additive + uses the service-role client (no new RPCs). v2 *chat* reports land in `v2_reports` (`context='chat'`) — the detail page resolves the conversation from the `(reporter, reported_user)` pair and links to `/admin/v2-chats`. (The legacy `v2_chats.reported_*` columns are no longer written by the app — surfaced defensively only.) Full spec: `docs/admin-backend-contract.md` §9–15.

### For everything else

Read [docs/admin-architecture.md](./docs/admin-architecture.md) — has the file structure, client selection rules, RPC inventory (including two deferred security issues), design system (brand colors, typography, animation classes, `<TribesLogo />` component), and a step-by-step recipe for adding a new admin view.

For the data spec (which tables, which mutations are allowed per table), read [docs/admin-backend-contract.md](./docs/admin-backend-contract.md).

### Design language for admin-only code

- Same palette as the marketing site: firefly, casablanca, granny, offwhite, ink
- Same font: Plus Jakarta Sans
- **But lean into extralight (200–300) weights much more heavily** for display numbers and headings — editorial-magazine feel, not marketing polish
- Use the six animation utility classes in `globals.css` (`.admin-fade-up`, `.admin-stagger > *`, `.admin-drawer-anim`, `.admin-overlay-anim`, `.admin-lift`, `.admin-press`) — they all respect `prefers-reduced-motion`
- Use the `<TribesLogo />` component (`src/components/admin/brand/TribesLogo.tsx`) for brand marks — it uses `currentColor` so one component works on any background via `text-*` utilities
- Mobile-first responsive at the `lg:` (1024px) breakpoint — sidebar above, slide-in drawer below
- Touch targets ≥44px everywhere, 48px on inputs, 52px on primary submit buttons
