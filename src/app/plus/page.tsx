import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tribes Plus | Tribes",
  description:
    "Names, identity verification, and what belongs in a paid tier. Follow up from the 14 August touch point.",
  robots: { index: false, follow: false },
};

const CONTENTS = [
  { n: "01", label: "Names", href: "#names", note: "Four ways identity could work" },
  { n: "02", label: "Verification", href: "#verification", note: "What a check actually costs" },
  { n: "03", label: "Tribes Plus", href: "#plus", note: "What goes in, and what it makes" },
];

const IDENTITY_OPTIONS = [
  {
    key: "A",
    name: "Current",
    tag: "Today",
    sees: "A real name",
    holds: "The same name",
    trusted: "No",
    note: "Nothing validates it. A false name and a false ZIP both pass.",
  },
  {
    key: "B",
    name: "Public display name, real name kept private",
    tag: null,
    sees: "A chosen name",
    holds: "A real name, never shown",
    trusted: "No",
    note: "Feels safer than A, but proves nothing. The private name can be false too.",
  },
  {
    key: "C",
    name: "Display name, with free verification",
    tag: "My take",
    sees: "A chosen name, and a badge if verified",
    holds: "A verified identity, for those who opt in",
    trusted: "Yes, for anyone who opts in",
    note: "The badge becomes the only claim on a profile that is actually true.",
  },
  {
    key: "D",
    name: "Display name, verification inside Tribes Plus",
    tag: "For discussion",
    sees: "A chosen name, and a badge if subscribed",
    holds: "A verified identity, for paying members",
    trusted: "Yes, for paying members",
    note: "The same as C, with the badge as a paid benefit rather than a free one.",
  },
];

const LADDER = [
  { rung: "Email confirmation", price: "$0", stops: "Signing up with an address you do not own.", flag: null },
  { rung: "Phone verification", price: "~$0.06", stops: "Most throwaway and automated accounts.", flag: null },
  { rung: "Device and network", price: "$0.03", stops: "One person running many accounts.", flag: null },
  { rung: "Full ID and selfie", price: "$0.33", stops: "Someone using a real but stolen identity.", flag: null },
];

const VERIFY_STATS = [
  { value: "$0.33", label: "Per check, best fitting vendor" },
  { value: "500", label: "Free every month, permanently" },
  { value: "$0", label: "To verify the first 1,000 at launch pace" },
  { value: "$9", label: "Store cut on one $5 member per year" },
];

const PLUS_LEVERS = [
  {
    name: "Creating a Circle",
    use: "Already built and gated. Charge for making a space of your own, keep joining one free.",
  },
  {
    name: "Reach past your neighborhood",
    use: "Your own distance, plus a second location. Sells reach without taking any away from anyone else.",
  },
  {
    name: "Instant match alerts",
    use: "The free tier keeps the weekly summary, paid hears immediately. Sells speed rather than access.",
  },
  {
    name: "Seeing who is interested",
    use: "The count stays free, the names are paid. Turns curiosity into a conversation.",
  },
  {
    name: "The verified badge",
    use: "Free under option C, paid under option D. Topic 01 decides which, not this list.",
  },
  {
    name: "A cap on free listings",
    use: "Available, but it pulls against the system built to increase listings. Hard to justify while supply is the constraint.",
  },
  {
    name: "Paid promotion",
    use: "Buys little in a thin marketplace. Becomes a real lever once there is competition for attention.",
  },
  {
    name: "Advertising",
    use: "No audience to sell yet. Further out, it is the reason someone would pay for a tier without ads.",
  },
];

const REVENUE = [
  { line: "Tribes Plus, 10,000 members, three in a hundred subscribing", accounts: "~300", net: "~$1,275" },
  { line: "Business tier at $29 a month", accounts: "~50", net: "~$1,450" },
];

const QUESTIONS = [
  { ask: "Which identity model, A through D?", lean: "C. A chosen display name, with verification free and badged." },
  { ask: "Do display names have to be unique?", lean: "No. Unique handles bring a squatting problem for no gain." },
  { ask: "Does verification hand back a private first name?", lean: "Yes. Never displayed, shared only by choice before meeting." },
  { ask: "Inside a Circle, chosen names or real ones?", lean: "Open. Everyone there already knows each other. Your call." },
  { ask: "Five dollars a month, or ten?", lean: "Five, with an annual option and a locked founding price." },
  { ask: "Business tier: separate, or a layer of Plus?", lean: "Separate. Different buyer, different price." },
  { ask: "Who starts the Apple conversion, and when?", lean: "This week. It stands in front of every dollar here." },
];

const LANES = [
  {
    when: "Before Montrose opens",
    items: [
      "Chosen names at signup. One day, delivered over the air.",
      "Turn on email confirmation. Free.",
      "Begin the Apple conversion.",
    ],
  },
  {
    when: "Once the marketplace is full",
    items: [
      "Identity verification and the badge. Needs a new app build.",
      "Tribes Plus, the first four features.",
      "Three way trades.",
    ],
  },
];

export default function PlusPage() {
  return (
    <div className="min-h-screen bg-offwhite">
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
          <span className="text-white/60 text-sm font-medium tracking-wide uppercase">
            Tribes Plus, August 2026
          </span>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-firefly via-firefly-light to-firefly text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-granny blur-3xl" />
          </div>
          <div className="relative max-w-[920px] mx-auto px-4 text-center">
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-casablanca/20 border border-casablanca/40">
              <span className="text-casablanca text-xs font-bold tracking-widest uppercase">
                Follow up from 14 August
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-4 tracking-tight animate-hero-fade-up">
              Tribes Plus
            </h1>
            <p
              className="text-lg text-white/75 leading-relaxed max-w-[560px] mx-auto animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              The three things left open on the last call, and where each one
              stands.
            </p>
          </div>
        </section>

        {/* Contents */}
        <section className="bg-firefly-light/[0.06] border-b border-gray-100 py-8">
          <div className="max-w-[1000px] mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-3">
              {CONTENTS.map((c, i) => (
                <ScrollReveal key={c.n} delay={i * 0.05}>
                  <a
                    href={c.href}
                    className="block rounded-2xl bg-white border border-gray-100 p-5 h-full hover:border-casablanca transition-colors"
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-heading font-extrabold text-casablanca-dark text-sm tabular-nums">
                        {c.n}
                      </span>
                      <span className="font-heading font-bold text-firefly">
                        {c.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-snug">{c.note}</p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 01 Names */}
        <section id="names" className="py-14 md:py-20 bg-offwhite scroll-mt-4">
          <div className="max-w-[900px] mx-auto px-4">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                Topic 01
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                Does anyone have to use a real name?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-3 max-w-[700px]">
                Signing up asks for a full name and nothing checks it. The
                question is what neighbors see, what Tribes holds, and whether
                any of it can be trusted.
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-10 max-w-[700px]">
                It matters commercially: members who will not put a legal name
                beside their address and their possessions simply do not list.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h3 className="font-heading font-extrabold text-firefly text-xl mb-1">
                Four ways it could work
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Each step down adds assurance. Only the last two change what is
                actually known.
              </p>
            </ScrollReveal>

            <div className="space-y-3 mb-8">
              {IDENTITY_OPTIONS.map((o, i) => (
                <ScrollReveal key={o.key} delay={i * 0.05}>
                  <div
                    className={
                      o.tag === "My take"
                        ? "rounded-2xl bg-white border-2 border-casablanca shadow-sm overflow-hidden"
                        : "rounded-2xl bg-white border border-gray-200 overflow-hidden"
                    }
                  >
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-offwhite">
                      <span className="font-heading font-extrabold text-white bg-firefly rounded-lg h-7 w-7 flex items-center justify-center text-sm shrink-0">
                        {o.key}
                      </span>
                      <span className="font-heading font-bold text-firefly text-[15px] leading-snug">
                        {o.name}
                      </span>
                      {o.tag ? (
                        <span
                          className={
                            o.tag === "My take"
                              ? "ml-auto shrink-0 text-[10px] font-bold tracking-widest uppercase rounded px-2 py-1 bg-casablanca text-firefly"
                              : "ml-auto shrink-0 text-[10px] font-bold tracking-widest uppercase rounded px-2 py-1 bg-gray-100 text-gray-500"
                          }
                        >
                          {o.tag}
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                      <div className="px-5 py-3.5">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                          Neighbors see
                        </div>
                        <div className="text-sm text-gray-700 leading-snug">
                          {o.sees}
                        </div>
                      </div>
                      <div className="px-5 py-3.5">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                          Tribes holds
                        </div>
                        <div className="text-sm text-gray-700 leading-snug">
                          {o.holds}
                        </div>
                      </div>
                      <div className="px-5 py-3.5">
                        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                          Can it be trusted
                        </div>
                        <div
                          className={
                            o.trusted === "No"
                              ? "text-sm font-bold text-gray-400 leading-snug"
                              : "text-sm font-bold text-firefly leading-snug"
                          }
                        >
                          {o.trusted}
                        </div>
                      </div>
                    </div>
                    <p className="px-5 py-3 text-sm text-gray-500 leading-relaxed bg-offwhite border-t border-gray-100">
                      {o.note}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="rounded-2xl bg-firefly text-white px-6 py-5 md:px-8 md:py-6">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-2">
                  My take
                </div>
                <p className="font-heading font-bold text-lg leading-snug mb-2">
                  Option C, and the display name half is worth doing before
                  Montrose.
                </p>
                <p className="text-white/70 text-[15px] leading-relaxed">
                  Display names are about a day of work and reach every phone
                  without a store review. Verification can follow later. Names
                  do not need to be unique either. Unique handles bring a
                  reservation system and a squatting problem for no gain.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 02 Verification */}
        <section id="verification" className="py-14 md:py-20 bg-white border-t border-gray-100 scroll-mt-4">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                Topic 02
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                What identity verification costs.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-[680px]">
                Priced against published vendor rates. It is far cheaper than
                either of us guessed on the call.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {VERIFY_STATS.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 0.05}>
                  <div className="rounded-2xl bg-offwhite border border-gray-100 p-5 h-full">
                    <div className="font-heading text-3xl font-extrabold text-firefly mb-1.5 tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-[13px] text-gray-500 leading-snug">
                      {s.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-3.5 border-b border-gray-100">
                  <h3 className="font-heading font-bold text-firefly text-sm">
                    Full ID is the top rung. The cheaper ones stop more.
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {LADDER.map((r) => (
                    <li key={r.rung} className="px-6 py-3.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-heading font-bold text-firefly text-sm">
                          {r.rung}
                          {r.flag ? (
                            <span className="ml-2 text-[10px] font-bold tracking-wide uppercase text-casablanca-dark bg-casablanca/15 rounded px-1.5 py-0.5 align-middle">
                              {r.flag}
                            </span>
                          ) : null}
                        </span>
                        <span className="font-heading font-extrabold text-firefly text-sm tabular-nums whitespace-nowrap">
                          {r.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-0.5">
                        {r.stops}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[680px]">
                Six cents stops most fake accounts. So the case for full ID is
                the badge, not fraud.{" "}
                <Link
                  href="/costs"
                  className="text-firefly font-semibold underline decoration-casablanca decoration-2 underline-offset-4 hover:text-casablanca-dark transition-colors"
                >
                  Vendor comparison on the costs page.
                </Link>
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl bg-firefly text-white px-6 py-5 md:px-8 md:py-6 max-w-[860px]">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-2">
                  My take
                </div>
                <p className="font-heading font-bold text-lg leading-snug mb-2">
                  Whatever is chosen, what verification earns is visibility.
                </p>
                <p className="text-white/70 text-[15px] leading-relaxed mb-3">
                  Best delivered as a verified neighbors filter in the feed.
                  Nobody is pushed down, and there is no hidden ordering. Worth
                  building after Montrose fills, because standing out only
                  matters when there is a crowd.
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  Two to carry: Tribes never sees the document, it goes from
                  the phone straight to the vendor. And face matching is
                  biometric data under Texas law, so it needs a consent screen
                  on the legal review.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 03 Plus */}
        <section id="plus" className="py-14 md:py-20 bg-offwhite border-t border-gray-100 scroll-mt-4">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                Topic 03
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                What Tribes Plus could contain.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-[680px]">
                Creating a Circle already sits behind a coming soon screen.
                Everything below is a lever we could pull, and how we would
                use it. Nothing here is settled.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl bg-casablanca/10 border-2 border-casablanca px-6 py-5 mb-10 max-w-[860px]">
                <h3 className="font-heading font-bold text-firefly mb-1.5 text-[15px]">
                  One constraint first
                </h3>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Charging inside the app needs the Apple conversion from an
                  individual to an organisation, open since May. Until that is
                  done, nothing can be sold. It stands in front of every number
                  below.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="bg-firefly text-white">
                        <th className="px-6 py-3.5 text-[11px] font-bold tracking-widest uppercase w-[32%]">
                          Lever
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold tracking-widest uppercase">
                          How we would use it
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {PLUS_LEVERS.map((f) => (
                        <tr key={f.name}>
                          <td className="px-6 py-3.5 font-heading font-bold text-firefly text-sm align-top">
                            {f.name}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-gray-600 leading-relaxed">
                            {f.use}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl bg-firefly text-white px-6 py-6 md:px-8 md:py-7 mb-10">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-2">
                  Further out
                </div>
                <h3 className="font-heading text-2xl font-extrabold mb-3">
                  Three way trades.
                </h3>
                <p className="text-white/75 text-[15px] leading-relaxed max-w-[680px] mb-3">
                  You have a drill and want a ladder. She has a ladder and
                  wants a bicycle. He has a bicycle and wants a drill. No two
                  of you can trade, but all three can, and today nobody can see
                  it.
                </p>
                <p className="text-white/55 text-sm leading-relaxed max-w-[680px]">
                  Tribes already holds the map of this in the one way matches
                  behind the Seeking tab, so it is a question of when there are
                  enough listings for the loops to exist rather than whether it
                  can be done. Worth keeping in view rather than planning
                  around.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h3 className="font-heading text-xl font-extrabold text-firefly mb-3">
                What it makes
              </h3>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="bg-firefly text-white">
                        <th className="px-6 py-3.5 text-[11px] font-bold tracking-widest uppercase">
                          At five dollars a month, Tribes keeps $4.25
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold tracking-widest uppercase text-right whitespace-nowrap">
                          Accounts
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold tracking-widest uppercase text-right whitespace-nowrap">
                          Kept
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {REVENUE.map((r) => (
                        <tr key={r.line}>
                          <td className="px-6 py-3.5 text-sm text-gray-600">
                            {r.line}
                          </td>
                          <td className="px-6 py-3.5 text-right font-heading font-bold text-firefly text-sm tabular-nums">
                            {r.accounts}
                          </td>
                          <td className="px-6 py-3.5 text-right font-heading font-extrabold text-firefly tabular-nums whitespace-nowrap">
                            {r.net}
                            <span className="text-xs text-gray-400 ml-1">
                              / mo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-[15px] text-gray-600 leading-relaxed max-w-[720px]">
                The business tier is likely the larger line, from six times
                fewer accounts. It is also the answer to businesses using
                personal accounts. Give them a better lane rather than policing
                them.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Decide */}
        <section className="py-14 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-[860px] mx-auto px-4">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                For the next call
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-8">
                Seven to decide.
              </h2>
            </ScrollReveal>

            <div className="rounded-2xl bg-offwhite border border-gray-100 divide-y divide-gray-200 overflow-hidden">
              {QUESTIONS.map((q, i) => (
                <ScrollReveal key={q.ask} delay={i * 0.03}>
                  <div className="px-5 py-4 md:px-6 flex gap-4">
                    <span className="font-heading font-extrabold text-casablanca-dark tabular-nums shrink-0 text-sm pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-heading font-bold text-firefly text-[15px] leading-snug">
                        {q.ask}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-0.5">
                        {q.lean}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timing */}
        <section className="py-14 md:py-20 bg-offwhite border-t border-gray-100">
          <div className="max-w-[900px] mx-auto px-4">
            <ScrollReveal>
              <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                Timing
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-8">
                What can move now.
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-4">
              {LANES.map((lane, i) => (
                <ScrollReveal key={lane.when} delay={i * 0.06}>
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 h-full">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark mb-4">
                      {lane.when}
                    </div>
                    <ul className="space-y-3">
                      {lane.items.map((it) => (
                        <li key={it} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-casablanca shrink-0" aria-hidden="true" />
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {it}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="py-12 md:py-16 bg-firefly text-white">
          <div className="max-w-[680px] mx-auto px-4 text-center">
            <ScrollReveal>
              <p className="text-white/75 leading-relaxed mb-6">
                None of this is built. It is here to be argued with, and it
                gets rewritten once the eight above are settled.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <Link
                  href="/costs"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-casablanca hover:text-white transition-colors"
                >
                  Running costs
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-casablanca transition-colors"
                >
                  Back to trytribes.com
                </Link>
              </div>
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
          Prepared for Dan Hudson, 23 August 2026
        </p>
      </footer>
    </div>
  );
}
