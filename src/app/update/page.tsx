import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Project Update | Tribes",
  description:
    "Closing v1. Standing up Friends and Family. Designing v2. The path from App Store approval to a living, learning Tribes.",
  robots: { index: false, follow: false },
};

const TRACKS = [
  {
    num: "01",
    kicker: "App",
    title: "Closing v1",
    body:
      "The app is approved and live. The remaining work is the App Store listing, last-mile testing, the invite flow, the admin tools to manage early users, and proving one trade end to end.",
  },
  {
    num: "02",
    kicker: "Website and CRM",
    title: "Marketing infrastructure",
    body:
      "Publish the new custom website, ship the invitation email, ship the feedback form, and wire every signal into The Map so feedback, tickets, and waitlist all live in one inbox.",
  },
  {
    num: "03",
    kicker: "Transition",
    title: "Vendor offboarding",
    body:
      "A clean handoff from the previous build partner. Credentials transferred, repo and design ownership in SoTech's hands, access removed, open development issues triaged and closed.",
  },
  {
    num: "04",
    kicker: "Next-gen",
    title: "v2, the next-gen Tribes",
    body:
      "The full next-gen Tribes app, delivered in two phases. Phase 1 redesigns every page and lands the new engagement mechanics. Phase 2 adds transactions and growth once we see what users actually do. Covered in full on the next page.",
  },
];

const V1_CLOSEOUT = [
  {
    title: "App Store metadata and ASO",
    body:
      "Lock the App Store listing so people can actually find Tribes. Name, subtitle, keywords, screenshots, and description, based on the audit we completed earlier this month. Apply the 17+ age-rating fix and resolve the dormant duplicate listing.",
  },
  {
    title: "Testing",
    body:
      "One last pass through the full user journey on the live app before we open the doors. Sign up, post something you have, post something you need, match, message, complete the trade. If anything breaks here, the first invites don't go out.",
  },
  {
    title: "Inviting users",
    body:
      "Invites go out in small waves. First five users, only after the loop is verified. Then fifteen. Then fifty. Then a hundred and fifty. Eventually around five hundred.",
  },
  {
    title: "User management",
    body:
      "The admin tools to issue invites, reset accounts, and help any user who hits a snag in the early window. Already built; getting its final polish.",
  },
  {
    title: "First successful match",
    body:
      "The proof point. One real Offering matched to one real Seeking between two early users, completed end to end. The signal that the loop works before we scale invites.",
  },
];

const MARKETING_INFRA = [
  {
    title: "Publish the new custom website",
    body:
      "The redesigned trytribes.com goes live. New look, App Store and Play Store routing, support and privacy and terms pages all aligned with the App Store submission.",
  },
  {
    title: "Invitation email",
    body:
      "Warm, specific, no hype. Sent as a branded link. One tap installs the app, signs the user in, and lands them on the welcome screen. Founder video right at the top.",
  },
  {
    title: "Feedback form via email",
    body:
      "Eight questions, about three minutes to fill out, on a simple web form. The app doesn't have a feedback button yet, so for now the link goes out by email. Early users get a periodic check-in email with the form. Every response flows into The Map so we know exactly who said what and can follow up.",
  },
  {
    title: "Sending the F&F email",
    body:
      "Invitations go out in waves from the admin dashboard, not in a single blast. Feedback emails follow on their own rhythm, about ten days after the invite and then every other week. Non-responders get one gentle nudge before the next wave.",
  },
];

const VENDOR_OFFBOARDING = [
  {
    title: "Credentials and access",
    body:
      "Every account the previous build partner held on Tribes' behalf moves over to SoTech-managed accounts: app stores, hosting, push notifications, source code, design files. Their access is removed once the transfer is verified.",
  },
  {
    title: "Repo and IP handoff",
    body:
      "Codebase pulled into SoTech-managed source control. Per the v1 contract, intellectual property transfers to Tribes on milestone payment, so we confirm the chain is clean before the next phase begins.",
  },
  {
    title: "Open issue closeout",
    body:
      "A final pass on open development tickets. Anything that's truly a bug gets fixed inside the F&F support window. Anything that's a feature request moves to the v2 backlog. Nothing left dangling in someone else's inbox.",
  },
  {
    title: "Why now",
    body:
      "Post-MVP work runs in-house from June 1 onward, built by SoTech with a single point of accountability. A clean offboarding is the prerequisite.",
  },
];

const F_AND_F_FOCUS = [
  {
    title: "Time",
    body:
      "From the moment an invite is sent to the first completed trade. Target for Wave 1 is under seven days. Tightens as we iterate the onboarding.",
  },
  {
    title: "Spend per F&F user",
    body:
      "The all-in cost of supporting one early user. Support hours, dev triage time, content cost. Sets the baseline for what acquisition has to beat once we open the doors.",
  },
  {
    title: "Successful matches",
    body:
      "The metric that matters most this window. We're not measuring traffic or downloads. We're measuring whether the loop actually works. One trade completed end to end is the proof.",
  },
  {
    title: "Gathering feedback",
    body:
      "Form responses, email check-ins, fifteen-minute call notes. All routed into The Map and sorted into one of four buckets: account question, v1 bug fix, v2 backlog, or post-launch polish.",
  },
];

const FIRST_ASK = [
  {
    label: "F&F Launch Operations Package",
    price: "$2,000",
    type: "One-time, 50/50",
    desc: "Everything needed to put Tribes in front of the first wave of users in a controlled, supported way.",
    bullets: [
      "Invite-only access and signup flow",
      "Invitation email and delivery",
      "Admin tools polish for invite issuance and user triage",
      "Feedback form on the website and the email that sends it",
      "One month of customer support during the launch window",
    ],
  },
  {
    label: "F&F Invitation Video",
    price: "$1,000",
    type: "One-time",
    desc: "A founder-on-camera invitation video, embedded above the fold in the invitation email. The same half-day shoot can produce content for the social retainer if you greenlight the variant bundle.",
    bullets: [
      "Script and on-set preparation",
      "Videographer for a half-day shoot",
      "Edit, motion graphics, and final delivery",
      "Optional add-on: three additional cuts and roughly a dozen short social clips, for $1,750 more",
    ],
  },
];

export default function UpdatePage() {
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
          <span className="text-white/60 text-sm font-medium tracking-wide uppercase">
            Project Update, May 2026, Page 1 of 2
          </span>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-offwhite via-gray-50 to-offwhite overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-firefly blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
          </div>
          <div className="relative max-w-[920px] mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-casablanca/15 border border-casablanca/30">
              <span className="text-firefly text-xs font-bold tracking-widest uppercase">
                Where we are. Where we&apos;re going.
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-firefly leading-[1.05] mb-6 tracking-tight animate-hero-fade-up">
              Close v1.
              <br />
              <span className="text-casablanca-dark">Stand up F&amp;F.</span>
              <br />
              Design v2.
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-[680px] mx-auto animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              App Store approval is in. The next ninety days run four
              workstreams in parallel. Three near-term: closing v1,
              marketing infrastructure, and vendor offboarding. One
              forward-looking: v2. This page walks the near-term tracks
              and the first ask. The v2 plan is on the next page.
            </p>
            <div
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 animate-hero-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href="#ask"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-firefly text-white text-sm font-bold hover:bg-firefly-light transition-colors"
              >
                Jump to the ask
              </a>
            </div>
          </div>
        </section>

        {/* Four tracks overview */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  The Four Tracks
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Four workstreams. One launch window.
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  Each track has its own owners and its own cadence. They
                  share one outcome: a living, learning Tribes by the end
                  of summer.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {TRACKS.map((t, i) => (
                <ScrollReveal key={t.num} delay={i * 0.08}>
                  <Card className="h-full text-left">
                    <div className="flex items-start gap-5">
                      <span className="font-heading text-4xl font-extrabold text-casablanca leading-none shrink-0">
                        {t.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark mb-1">
                          {t.kicker}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-firefly mb-2">
                          {t.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t.body}
                        </p>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Track 1, v1 closeout */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Track 01, App
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Closing out v1.
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  The app is approved and live. Five jobs sit between
                  being in the store and the first five friends actually
                  using it.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {V1_CLOSEOUT.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.06}>
                  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-firefly to-firefly-light" />
                    <div className="grid grid-cols-12 gap-4 md:gap-8 p-6 md:p-7 items-start">
                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-baseline gap-3 md:block">
                          <span className="font-heading text-3xl md:text-4xl font-extrabold text-firefly/30 leading-none">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-firefly md:mt-2">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-9">
                        <p className="text-gray-600 leading-relaxed text-[15px]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 max-w-[900px] mx-auto">
                <div className="rounded-xl border border-firefly/15 bg-firefly/5 px-5 py-4 text-sm text-firefly leading-relaxed">
                  <span className="font-bold tracking-wide uppercase text-xs mr-2">
                    A note on the final invoice.
                  </span>
                  Closing v1 also triggers the original MVP final invoice
                  of <strong>$10,000</strong>. That&apos;s already part
                  of the original scope, paid on delivery once F&amp;F
                  is live. It is not a new ask.
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Track 2, Marketing infrastructure */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Track 02, Website and CRM
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Marketing infrastructure.
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  The site, the invitation, the feedback loop, the inbox.
                  Every signal funnels into one place so nothing falls on
                  the floor.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {MARKETING_INFRA.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <Card className="h-full text-left">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-casablanca text-firefly flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-firefly mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {/* Funnel diagram */}
            <ScrollReveal>
              <div className="rounded-2xl bg-firefly text-white p-8 md:p-10">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-4 text-center">
                  How feedback flows
                </div>
                <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2 justify-center">
                  {[
                    { label: "F&F Email", sub: "Periodic check-in" },
                    { label: "Web Form", sub: "Eight questions, three minutes" },
                    { label: "The Map", sub: "Tagged, triaged, owned" },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex items-stretch gap-3 md:gap-2 flex-1">
                      <div className="flex-1 rounded-xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur-sm">
                        <div className="font-heading text-2xl font-extrabold text-white mb-1">
                          {step.label}
                        </div>
                        <div className="text-xs text-white/60">{step.sub}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="hidden md:flex items-center text-casablanca text-xl font-bold">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-white/70 mt-6 max-w-[640px] mx-auto leading-relaxed">
                  One inbox. Every response tied to the user who sent it.
                  Same pipeline that already runs the waitlist, so no new
                  tool for anyone to learn.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Track 3, Vendor offboarding */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Track 03, Transition
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Vendor offboarding.
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  A clean handoff from the v1 build partner. One source
                  of truth, in SoTech&apos;s hands, with nothing left in
                  someone else&apos;s inbox.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {VENDOR_OFFBOARDING.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 h-full hover:border-casablanca/40 hover:shadow-md transition-all">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark mb-2">
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-firefly mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* F&F focus window */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  The F&amp;F Window
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Full focus on F&amp;F.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  June through August, F&amp;F users live in the
                  foreground. The weekly loop turns what they surface
                  into either a fix or a backlog item. Never both, never
                  lost.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {F_AND_F_FOCUS.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-casablanca/50 transition-all hover:shadow-md">
                    <div className="text-xs font-bold tracking-wider uppercase text-casablanca-dark mb-2">
                      What we measure
                    </div>
                    <div className="font-heading text-2xl font-extrabold text-firefly mb-3 leading-tight">
                      {item.title}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Wave 1 placeholder */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-10">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Wave 1, The First Five
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Who&apos;s on the list?
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  We co-author Wave 1 in this meeting. Five names. Close
                  enough to be honest, patient with rough edges, real
                  use cases, inside matching range.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-dashed border-firefly/25 p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="flex flex-col items-center justify-center text-center rounded-xl border border-firefly/10 bg-firefly/[0.02] p-6 h-32"
                    >
                      <div className="font-heading text-3xl font-extrabold text-firefly/20 mb-2">
                        0{n}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-firefly/40">
                        TBD
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500 italic mt-6">
                  Filled live during this conversation. Two from Dan,
                  three from SoTech as a working assumption.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The first ask */}
        <section id="ask" className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  The First Ask
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Two new line items for F&amp;F.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  Everything in the three tracks above resolves into two
                  new scopes. Together they get F&amp;F live and
                  learning before the v2 build begins.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FIRST_ASK.map((line, i) => (
                <ScrollReveal key={line.label} delay={i * 0.1}>
                  <div className="rounded-2xl bg-white border border-gray-100 p-7 md:p-8 h-full hover:shadow-xl hover:border-casablanca/40 transition-all flex flex-col">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca-dark mb-2">
                      {line.type}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-firefly mb-2">
                      {line.label}
                    </h3>
                    <div className="font-heading text-5xl font-extrabold text-firefly mb-5">
                      {line.price}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                      {line.desc}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {line.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2.5 text-sm text-gray-700 leading-relaxed"
                        >
                          <span className="text-casablanca-dark shrink-0 mt-0.5 font-bold">
                            →
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="mt-10 rounded-xl border border-firefly/15 bg-firefly/5 px-6 py-5 text-sm text-firefly leading-relaxed max-w-[820px] mx-auto text-center">
                <span className="font-bold uppercase tracking-wider text-[11px] mr-2 block mb-1">
                  Subtotal for the first ask
                </span>
                <div className="font-heading text-3xl font-extrabold text-firefly">
                  $3,000 one-time
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Plus the original $10,000 MVP final invoice that
                  clears on F&amp;F delivery. That one is already on the
                  books and not part of this ask.
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA, next page */}
        <section className="py-20 md:py-28 bg-firefly text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-granny blur-3xl" />
          </div>
          <div className="relative max-w-[800px] mx-auto px-4 text-center">
            <ScrollReveal>
              <span className="inline-block mb-4 text-xs font-bold tracking-widest uppercase text-casablanca">
                Page 2, Coming up
              </span>
              <h2 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.05]">
                v2, the next-gen
                <br />
                <span className="text-casablanca">Tribes.</span>
              </h2>
              <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-[600px] mx-auto">
                Three milestones, nine features, a real off-ramp at
                each gate. Phase 2 narrative for what comes after. Then
                the recurring retainers that begin alongside.
              </p>
              <Link
                href="/update/v2"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-casablanca text-firefly text-base font-bold hover:bg-casablanca-dark hover:text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Continue to v2 plan
                <span className="text-xl">→</span>
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
          Project Update, May 2026, Page 1 of 2, Prepared for Dan Hudson
        </p>
      </footer>
    </div>
  );
}
