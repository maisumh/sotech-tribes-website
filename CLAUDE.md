# Tribes Website — Next.js Recreation

## Project
This is a Next.js 15 recreation of the Tribes landing page originally built with vanilla HTML/CSS/JS and hosted on GHL (GoHighLevel) at trytribes.com. The goal is pixel-level fidelity with the original.

## Stack
- **Framework:** Next.js 15.5 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom colors (firefly, granny, casablanca, offwhite, ink)
- **Animations:** CSS @keyframes for hero entrance, framer-motion ScrollReveal for scroll-triggered reveals
- **Font:** Plus Jakarta Sans (via next/font/google) — used for both headings and body
- **Form:** GHL iframe embed (shared `GHLForm` component) on all pages
- **Deployment:** Vercel (auto-deploys from main branch)

## Original Reference
The original HTML/CSS lives at: `../Website/LandingPage/Current/` (index.html, neighbors.html, partners.html, style.css)

Always compare against the original when making visual changes.

## Key Patterns
- **Hero animations:** Pure CSS (`animate-hero-fade-up` class in globals.css), NOT framer-motion — avoids hydration-dependent skip/stutter on mobile
- **Scroll animations:** `ScrollReveal` component (framer-motion `whileInView`) for below-fold content
- **Counter animations:** `useCountUp` hook in `src/hooks/useCountUp.ts` — used by Neighborhood stats and Impact metrics
- **FAQ accordion:** `ClientFAQ` component with mutual exclusivity (one open at a time)
- **iOS safe area:** body bg is `#103730` (firefly green) so iOS safe area matches footer; `#main` has white bg
- **Section backgrounds:** Match original's class system — `section--sage` = `bg-granny`, `section--gray` = `bg-gray-50`, `section--cta` = `bg-firefly`

## Pages
- `/` — Main landing page (14 sections)
- `/neighbors` — For Neighbors sub-page
- `/partners` — For Partners sub-page

## Build & Dev
```
npm install
npm run dev    # local dev server
npm run build  # production build
```
