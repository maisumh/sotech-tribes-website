import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "v2 Plan | Tribes",
  description:
    "The next-gen Tribes app. Phase 1 milestones, scope, pricing, and recurring retainers.",
  robots: { index: false, follow: false },
};

const MILESTONES = [
  {
    id: "M1",
    price: "$4,000",
    title: "Redesign",
    weeks: "Weeks 1 to 3, around June 1 to June 22",
    summary:
      "A page-by-page redesign of the existing app. Same functionality, refreshed surface. Visual consistency verified across the app before we move on.",
    features: [
      {
        name: "Home and Feed redesign",
        body: "The two pages users land on most. New palette, new type system, modern loading states, redesigned cards. Same logic, sharper surface.",
      },
      {
        name: "Profile, Settings, and Notifications redesign",
        body: "The 'your account' surface. Profile, preferences, notifications. Visual overhaul. No functional changes.",
      },
      {
        name: "Match view and Chat redesign",
        body: "The two screens that handle one-to-one match interaction. Visual refresh now. The functional redesign of the interaction itself comes in Milestone 3.",
      },
    ],
    gate: "All redesigned pages running in TestFlight. Visual consistency verified across the app.",
  },
  {
    id: "M2",
    price: "$3,000",
    title: "New engagement mechanics",
    weeks: "Weeks 4 to 6, around June 23 to July 13",
    summary:
      "The new functional layer. Explore and Offer-from-Explore for browsing, plus the Tribes structural layer with creation, public and private settings, roles, and management.",
    features: [
      {
        name: "Explore page",
        body: "A browse layout in the style of Poshmark. Card grid, keyword search, filters for category and tribe and distance. Detail view with an offer button wired in.",
      },
      {
        name: "Offer from Explore",
        body: "A second path to engagement. Users can offer on any listing without waiting on a match. Composer for the terms (what I'm giving, what I want). The recipient gets an inbox where they accept, counter, or decline.",
      },
      {
        name: "Tribes: creation, roles, and management",
        body: "A tribe creation wizard, a three-role system (Creator, Admin, Member), and a member-list management interface. No group chat. Tribes are transactional, not chatty.",
      },
    ],
    gate: "A user can browse Explore, offer on a listing without a prior match, and create and manage their own tribe.",
  },
  {
    id: "M3",
    price: "$3,000",
    title: "Onboarding, Match redesign, and Launch",
    weeks: "Weeks 7 to 9, around July 14 to August 3",
    summary:
      "The flows. App onboarding, invite-to-tribe onboarding, and the match-interaction redesign. Then we deploy Phase 1 as an update to the live app.",
    features: [
      {
        name: "Refreshed app onboarding",
        body: "The new-user flow. Signup, bio, a prompt to post the first listing, a quick introduction to match and Explore.",
      },
      {
        name: "Invite-to-Tribe onboarding",
        body: "Email, push, deep link, a tribe preview screen, an accept step, and a prompt to post the first listing in the tribe. The goal is sixty seconds from tapping the invite to taking action.",
      },
      {
        name: "Match interaction redesign",
        body: "The post-match screen with clearer action surfacing. A visible 'make an offer' option. Offer history with status (proposed, countered, accepted, completed). Chat sits alongside structured actions instead of carrying all the load.",
      },
    ],
    gate: "v2 Phase 1 live in both the App Store and the Play Store.",
  },
];

const PHASE_2_THEMES = [
  {
    title: "Transactions and payments",
    body:
      "Make the 'cash, trade, or a mix' promise real. Users specify the structure of a trade (pure barter, pure cash, or both). The cash portion flows through the app via Stripe.",
  },
  {
    title: "Referral mechanic",
    body:
      "The Dropbox-style growth loop. Every active user gets a small number of invites to share. Both the inviter and the invitee earn a reward when the invitee completes their first listing.",
  },
  {
    title: "Gamification, or advanced moderation",
    body:
      "We pick one based on what Phase 1 launch behavior tells us. Gamification means points, badges, and a super-trader tier. Moderation means tribe-level analytics, listing pin, and a basic dispute trail.",
  },
];

const RETAINERS = [
  {
    label: "Account Management, Tier 1",
    price: "$750",
    cadence: "per month",
    starts: "Begins July 1",
    desc: "Included in the F&F Operations package for the first month (June). Recurring from month two. Password resets, account issues, user questions, invite re-sends. Bounded to five to twenty F&F users. Scales to Tier 2 when we cross around fifty.",
  },
  {
    label: "Social Media, F&F phase",
    price: "$1,500",
    cadence: "per month",
    starts: "Begins June 1",
    desc: "One half-day of content capture every thirty days yields more than thirty short clips. Schedules across LinkedIn, Instagram, TikTok, Shorts, Threads, and the waitlist newsletter. Steps up to a launch-ramp tier ($2,750 per month) when the seeded-tribe phase begins.",
  },
];

export default function UpdateV2Page() {
  return (
    <div className="min-h-screen bg-offwhite">
      {/* Header */}
      <header className="bg-firefly py-6 px-4 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" aria-label="Tribes home">
            <Image
              src={BRAND.logos.primaryWhite}
              alt="Tribes"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/update"
              className="text-white/60 hover:text-casablanca text-xs font-semibold tracking-wide uppercase transition-colors"
            >
              ← Page 1
            </Link>
            <span className="text-white/60 text-sm font-medium tracking-wide uppercase">
              v2 Plan, Page 2 of 2
            </span>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-firefly via-firefly-light to-firefly text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-granny blur-3xl" />
          </div>
          <div className="relative max-w-[920px] mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-casablanca/20 border border-casablanca/40">
              <span className="text-casablanca text-xs font-bold tracking-widest uppercase">
                Page 2, The v2 Plan
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight animate-hero-fade-up">
              v2, the
              <br />
              <span className="text-casablanca">next-gen Tribes.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-[680px] mx-auto animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              The whole next-gen app, delivered in two phases. Phase 1
              is locked, priced, and broken into three milestones so
              the investment is spread rather than a single lump bet.
              Phase 2 picks up after launch, once we&apos;ve seen what
              users actually do.
            </p>
          </div>
        </section>

        {/* Phase framing */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  The Shape of v2
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Two phases. Real off-ramps.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  Phase 1 is the build that ships in around nine weeks.
                  Phase 2 is the build that ships after we have real
                  user behavior to point at. Pricing the second one
                  before that data exists doesn&apos;t serve either of
                  us.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ScrollReveal>
                <div className="rounded-2xl bg-firefly text-white border border-firefly p-7 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-casablanca">
                      Phase 1
                    </span>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-white/40">
                      ~9 weeks, June to early August
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-extrabold text-white mb-3">
                    Redesign and Engagement
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-5">
                    A page-by-page redesign. Then Explore,
                    Offer-from-Explore, and the Tribes structural
                    layer. Then onboarding flows and the
                    match-interaction redesign. Three milestones, around
                    three weeks each.
                  </p>
                  <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
                    Broken out below
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="rounded-2xl bg-white text-ink border border-gray-100 p-7 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-firefly/60">
                      Phase 2
                    </span>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-firefly/40">
                      Scoped after launch
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-extrabold text-firefly mb-3">
                    Transactions and Growth
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    Cash, trade, or mix transactions via Stripe. A
                    referral loop with both-sides rewards. Either
                    gamification basics or advanced tribe-moderation
                    tools, picked based on what Phase 1 behavior teaches
                    us.
                  </p>
                  <div className="text-xs text-firefly/60 font-semibold uppercase tracking-wider">
                    Quote lands around August 2026
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Milestone breakdown */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Phase 1, Milestone Breakdown
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Three milestones. Nine features.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  Each milestone has its own deliverable, its own gate,
                  and its own price. The spend lines up to shipped work,
                  not to a calendar.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <ScrollReveal key={m.id} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="bg-gradient-to-r from-firefly to-firefly-light text-white px-7 py-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className="font-heading text-3xl font-extrabold text-casablanca">
                          {m.id}
                        </span>
                        <div>
                          <h3 className="font-heading text-xl font-bold leading-tight">
                            {m.title}
                          </h3>
                          <div className="text-xs text-white/70 mt-0.5">
                            {m.weeks}
                          </div>
                        </div>
                      </div>
                      <div className="font-heading text-3xl font-extrabold text-casablanca">
                        {m.price}
                      </div>
                    </div>
                    <div className="p-7 md:p-8">
                      <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
                        {m.summary}
                      </p>
                      <div className="space-y-4 mb-6">
                        {m.features.map((f) => (
                          <div
                            key={f.name}
                            className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-casablanca-dark" />
                            <div>
                              <div className="font-heading font-bold text-firefly text-sm mb-1">
                                {f.name}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {f.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg bg-firefly/[0.04] border border-firefly/10 px-4 py-3 text-sm text-firefly leading-relaxed">
                        <span className="font-bold uppercase tracking-wider text-[11px] text-casablanca-dark mr-2">
                          Milestone gate.
                        </span>
                        {m.gate}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Phase 1 total */}
            <ScrollReveal>
              <div className="mt-10 rounded-2xl bg-firefly text-white p-8 md:p-10 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
                </div>
                <div className="relative">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-3">
                    Phase 1 total
                  </div>
                  <div className="font-heading text-6xl md:text-7xl font-extrabold text-white mb-4 leading-none">
                    $10,000
                  </div>
                  <div className="text-sm text-white/70 max-w-[520px] mx-auto leading-relaxed">
                    Broken into three milestones at $4,000, $3,000, and
                    $3,000. Paid as each one ships and clears its gate.
                    No single lump-sum bet.
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-8 rounded-xl border border-casablanca/40 bg-casablanca/10 px-6 py-5 text-sm text-firefly leading-relaxed max-w-[820px] mx-auto">
                <span className="font-bold uppercase tracking-wider text-[11px] text-casablanca-dark mr-2 block mb-1">
                  One constraint to lock now.
                </span>
                Tribes are transactional, not chatty. No group chat
                inside a tribe. Tribes are a structural, browsable layer
                where listings live. Engagement still flows through
                one-to-one match messaging or Offer-from-Explore. This
                is architectural, not deferred work.
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Phase 2 narrative */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Phase 2, After Launch
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Transactions, growth, and one big pick.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  Three themes are on the table. We lock the exact
                  feature list and the price when we scope it in August,
                  informed by what Phase 1 launch behavior actually
                  surfaces.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PHASE_2_THEMES.map((theme, i) => (
                <ScrollReveal key={theme.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 h-full hover:border-casablanca/40 hover:shadow-md transition-all">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark mb-3">
                      Theme {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-firefly mb-3 leading-tight">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {theme.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Recurring retainers */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Recurring, Beginning June 1
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Two retainers that compound.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  Separate from milestone work. These run alongside the
                  Phase 1 build so by the time Phase 2 kicks off,
                  there&apos;s real audience and real customer-support
                  infrastructure already in place.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RETAINERS.map((r, i) => (
                <ScrollReveal key={r.label} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-7 md:p-8 h-full hover:border-casablanca/40 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark">
                        {r.starts}
                      </div>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-firefly mb-2">
                      {r.label}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="font-heading text-5xl font-extrabold text-firefly">
                        {r.price}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {r.cadence}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Three decisions close */}
        <section className="py-20 md:py-28 bg-firefly text-white">
          <div className="max-w-[820px] mx-auto px-4 text-center">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca">
                What we&apos;d leave today with
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                Three decisions.
              </h2>
              <ol className="text-left space-y-4 max-w-[640px] mx-auto mb-10">
                {[
                  {
                    n: "01",
                    title: "Confirm F&F Wave 1 names",
                    body:
                      "Two from Dan, three from SoTech. Invites go out the day after vendor offboarding clears.",
                  },
                  {
                    n: "02",
                    title: "Greenlight the F&F Operations and Invitation Video ask",
                    body:
                      "$2,000 plus $1,000, or $2,750 with the variant bundle. Triggers the June 1 kickoff.",
                  },
                  {
                    n: "03",
                    title: "Greenlight v2 Phase 1",
                    body:
                      "$10,000 across three milestones, around nine weeks. Begins June 1 alongside F&F. A real off-ramp at each milestone gate.",
                  },
                ].map((d) => (
                  <li
                    key={d.n}
                    className="flex gap-5 items-start p-5 rounded-2xl bg-white/[0.04] border border-white/10"
                  >
                    <span className="font-heading text-3xl font-extrabold text-casablanca leading-none">
                      {d.n}
                    </span>
                    <div>
                      <div className="font-heading font-bold text-white mb-1">
                        {d.title}
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {d.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 md:p-7 text-left max-w-[640px] mx-auto mb-10">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-2">
                  Next step
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Once these decisions land, we lock the timeline. The
                  sequencing of waves, milestone start dates, video
                  shoot day, and the social and account-management
                  cadence all follow from the greenlights above.
                </p>
              </div>

              <Link
                href="/update"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-casablanca transition-colors"
              >
                ← Back to Page 1
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="bg-firefly py-10 px-4 border-t border-white/10 text-center">
        <p className="text-white/60 text-sm mb-1">
          <a
            href="https://trytribes.com"
            className="text-casablanca font-semibold hover:underline"
          >
            trytribes.com
          </a>
        </p>
        <p className="text-white/40 text-xs">
          Project Update, May 2026, Page 2 of 2, Prepared for Dan Hudson
        </p>
      </footer>
    </div>
  );
}
