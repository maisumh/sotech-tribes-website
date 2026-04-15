# Tribes Website & Admin — Next.js Repository

## Project
This repository contains three distinct surfaces that share a single codebase:

1. **Marketing site** (`/`, `/neighbors`, `/partners`, `/feedback`, `/mvp`) — a Next.js 15 recreation of the Tribes landing page originally built with vanilla HTML/CSS/JS on GHL. Pixel-level fidelity with the original is the goal. Uses `GHLForm` iframe for waitlist capture.
2. **Editorial surface** (`/privacy`, `/terms`, `/support`, `/home2`) — App Store submission pages (April 2026) + a redesigned home preview. Editorial aesthetic: extralight display type, asymmetric layouts, fluid `clamp()` typography, casablanca italic accents, numbered sections. No emoji icons — typographic numbered prefixes instead.
3. **Admin panel** (`/admin/*`) — an internal staff tool that replaced a legacy FlutterFlow admin in April 2026. Connects directly to the Tribes Supabase database. See [docs/admin-architecture.md](./docs/admin-architecture.md) before touching anything under `src/app/admin/` or `src/components/admin/`.

## Stack
- **Framework:** Next.js 15.5 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom colors (firefly, granny, casablanca, offwhite, ink)
- **Animations:** CSS @keyframes for hero entrance, framer-motion ScrollReveal for scroll-triggered reveals
- **Font:** Plus Jakarta Sans (via next/font/google) — used for both headings and body. The editorial surface leans heavily into `font-extralight` (200) for display type.
- **Forms:**
  - Marketing pages → `GHLForm` iframe (`src/components/ui/GHLForm.tsx`)
  - Editorial surface → custom react-hook-form + zod forms (`SupportForm`, `WaitlistForm`) posting to `/api/support` and `/api/waitlist` (both currently stubbed — see TODOs in the route handlers for SendGrid / GHL Contacts wiring)
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
- `/home2` — Editorial redesign preview (noindex). Unlinked from nav. Uses custom `WaitlistForm` instead of the GHL iframe.

API routes:
- `/api/support` — contact form handler. TODO: wire to SendGrid to forward to info@trytribes.com.
- `/api/waitlist` — waitlist signup handler. TODO: wire to GHL Contacts API (endpoint and payload shape documented in the route file).

## OG Images
Static 1200x630 PNGs in `public/` — one per page (`og-home.png`, `og-neighbors.png`, `og-partners.png`). Generated via `scripts/generate-og.mjs` using sharp. To regenerate: `node scripts/generate-og.mjs` (all) or `node scripts/generate-og.mjs og-home` (single).

## Brand Assets
- **Logo files:** `public/tribes-logo-white.png` (white logo for dark backgrounds), `public/tribes-logo-white.svg`
- **Favicon:** `public/favicon.png` (sourced from `../Marketing/Tribes_Brand_Assets/:Logo/PNG/Fav Icon-2.png`)
- **Source brand assets:** `../Marketing/Tribes_Brand_Assets/` (logos, icons in PNG and SVG)

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
- **GHL Contacts API wiring** for `/api/waitlist` — endpoint, auth header, and payload shape documented in the route handler
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

**Auth gate**: three layers. `src/middleware.ts` → `(protected)/layout.tsx` calls `requireAdmin()` → every Server Action and Route Handler calls `requireAdmin()` before touching anything. Never skip any of them. The middleware alone is not sufficient (CVE-2025-29927).

**Two server-side Supabase clients**, and the rule matters:
- `createClient()` from `src/lib/supabase/server.ts` — regular client, respects RLS, carries the admin's JWT. Use for RPCs that check `auth.uid()` internally.
- `createAdminClient()` from `src/lib/supabase/admin.ts` — service role, bypasses RLS. Use for direct writes and RLS-bypass reads. Never import from a client component.

**Every admin mutation writes a row to `public.admin_audit_log`** with a canonical action string. There are ~10 allowed action strings — see the architecture doc for the list.

**Do NOT call `public.delete_want_have`** — it's a vulnerable SECURITY DEFINER RPC with EXECUTE granted to anon. We soft-delete via `UPDATE want_have SET is_deleted = true` through the service role client instead.

**Data quirks that look like bugs but aren't**:
- `user_rattings` table — typo of "ratings", load-bearing (mobile app reads that name).
- `users.is_varify_email` — typo of "verify", load-bearing.
- `chat_rooms.reported_by` is often NULL even when a report exists. Check `reported_by OR reported_reason OR reported_at` when detecting reports.
- `chat_messages` has no `is_deleted` column — message deletion is the ONE intentional hard-delete in the entire admin.
- `projects` table is dead test data — do not build UI for it.

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
