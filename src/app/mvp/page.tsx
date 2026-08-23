import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "MVP Launch Plan | Tribes",
  description:
    "The friends-and-family launch plan for Tribes: invite, onboard, use, feedback, iterate.",
  robots: { index: false, follow: false },
};

const LOOP_STAGES = [
  {
    num: "01",
    title: "Invite",
    body:
      "We don't blast invites all at once. We start with the first 5 people, verifying sign-ups work, haves and wants can be created, chat flows end-to-end. Once a wave is healthy, we expand: 5 → 15 → 50 → 150 → scaling toward ~500. Each wave only goes out after the last one is proven stable. Supabase gates access: only invitees can get in.",
  },
  {
    num: "02",
    title: "Onboard",
    body:
      "First-run screen sets expectations: this is early, things will break, your voice matters. A 60-second quickstart walks new users through Have, Want, Match: the core loop.",
  },
  {
    num: "03",
    title: "Use",
    body:
      "Users explore the app on their own terms. A persistent Share Feedback entry point lives in the menu, always one tap away, never in the way.",
  },
  {
    num: "04",
    title: "Feedback",
    body:
      "8 structured questions (about 3 minutes to complete). Hidden fields tie every submission to the user. The first 20 users get a 15-minute call offer, where the deepest insight lives.",
  },
  {
    num: "05",
    title: "Iterate",
    body:
      "Weekly synthesis: read every piece of feedback, tag themes, shape the backlog. Ship improvements every 1-2 weeks, whenever they're ready, not forced into a fixed slot. Every 2 weeks we close the loop with a 'You said, we did' update to keep invited users engaged.",
  },
];

const FEEDBACK_QUESTIONS = [
  { q: "In your own words, what is Tribes?", type: "Open text" },
  { q: "How easy was it to get started?", type: "1-5 rating" },
  { q: "Did you find something you'd actually trade?", type: "Yes / Maybe / No" },
  { q: "What's one thing that confused you?", type: "Open text" },
  { q: "What's one thing you'd want next?", type: "Open text" },
  { q: "Would you invite a neighbor to try it?", type: "Yes / Maybe / No" },
  { q: "Can we follow up with a 15-minute call?", type: "Yes + email / No" },
  { q: "Anything else we should hear?", type: "Open text" },
];

const METRICS = [
  {
    label: "Invite acceptance",
    target: "≥ 60%",
    desc: "% of invited users who tap the magic link and finish sign-up.",
  },
  {
    label: "Feedback response",
    target: "≥ 30%",
    desc: "% of signed-up users who submit at least one feedback form.",
  },
  {
    label: "Referral intent",
    target: "≥ 40% 'Yes'",
    desc: "% of respondents who'd invite a neighbor. The real NPS at this stage.",
  },
  {
    label: "Weekly ship count",
    target: "2-3 / week",
    desc: "Items from feedback that land in the next ship cycle.",
  },
];

const TIMELINE = [
  {
    week: "Week 1",
    title: "Prep & Wave 1 (5 users)",
    items: [
      "Finalize contact list, customize Supabase email template",
      "Wire in-app feedback entry point, build GHL feedback form",
      "Send invites to the first 5 users: closest friends and most patient testers",
      "Verify the full loop end-to-end: sign-up, create a have, create a want, chat with a match, submit feedback",
    ],
  },
  {
    week: "Weeks 2-3",
    title: "Wave 2 (+15) → Wave 3 (+50)",
    items: [
      "Only expand after Wave 1 is healthy (no blocker bugs, no broken flows)",
      "Send Wave 2 (15 more users), monitor for new issues surfaced at higher volume",
      "Send Wave 3 (50 more users) once Wave 2 is stable",
      "Offer 15-minute calls to first 20 respondents, where the real insight lives",
      "First synthesis session: tag themes, queue backlog items",
    ],
  },
  {
    week: "Weeks 4-5",
    title: "Wave 4 (+150) & iterate",
    items: [
      "Ship improvements from Waves 1-3 feedback (1-2 week cycle each)",
      "Larger batch of 150 users goes out",
      "First 'You said, we did' update to all invited users",
      "Follow-up nudges to non-responders from earlier waves",
    ],
  },
  {
    week: "Weeks 6-8",
    title: "Scale toward ~500 & decide",
    items: [
      "Remaining invite waves sent in scaled batches until we reach our target",
      "Metrics review: hitting response + referral-intent targets?",
      "Decide: graduate to public launch, extend MVP, or pivot direction based on what the data says",
    ],
  },
];

export default function MVPPage() {
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
            MVP Launch Plan
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
          <div className="relative max-w-[900px] mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-casablanca/15 border border-casablanca/30">
              <span className="text-firefly text-xs font-bold tracking-widest uppercase">
                Friends & Family Release
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-firefly leading-[1.05] mb-6 tracking-tight animate-hero-fade-up">
              Launch small.
              <br />
              <span className="text-casablanca-dark">Learn fast.</span>
              <br />
              Ship what matters.
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-[640px] mx-auto animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              The Tribes MVP starts with five. Then fifteen. Then fifty.
              We expand in waves, verifying every flow at every step, until
              we reach our target of ~500 early users. This page is the plan:
              how we invite them, how we capture what they think, and how we
              turn that into shipped improvements.
            </p>
          </div>
        </section>

        {/* Who's on the list */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Before Wave 1
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Who&apos;s on the list
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  Not everyone in your contacts belongs in Wave 1. Four signals
                  for picking the first 5, then 15, then 50.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
              {[
                {
                  title: "Close enough to be honest",
                  body:
                    "People who'll tell you the onboarding is broken instead of nodding politely. If they wouldn't say 'this is confusing' to your face, they won't type it in a form.",
                },
                {
                  title: "Patient with rough edges",
                  body:
                    "Early builds glitch, copy is half-baked, a screen or two will break. Good Wave 1 users expect that. They're here to help, not to review.",
                },
                {
                  title: "Has a real use case",
                  body:
                    "Actually owns things worth offering and actually needs things they'd seek. The loop only tells us something if people run it for real reasons, not out of politeness.",
                },
                {
                  title: "Within matching range",
                  body:
                    "Close enough geographically that a Have in one person's list could plausibly match a Want in another's. One Wave 1 user in another city tests sign-up, not the product.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <Card className="text-left h-full">
                    <h3 className="font-heading text-xl font-bold text-firefly mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.body}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.2}>
              <div className="mt-10 max-w-[900px] mx-auto">
                <div className="rounded-xl border border-casablanca/40 bg-casablanca/10 px-5 py-4 text-sm text-firefly leading-relaxed">
                  <span className="font-bold tracking-wide uppercase text-casablanca-dark text-xs mr-2">
                    Skip for now:
                  </span>
                  people who only reply when they have time, anyone outside
                  matching range, and anyone you&apos;d feel awkward nudging
                  twice. They&apos;re great for later waves, not Wave 1.
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The 5-stage loop */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  The Feedback Loop
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Five stages. One repeating cycle.
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  Every invited user flows through the same loop. Every week
                  it gets shorter, sharper, and smarter.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-5">
              {LOOP_STAGES.map((stage, i) => (
                <ScrollReveal key={stage.num} delay={i * 0.08}>
                  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-casablanca to-casablanca-dark" />
                    <div className="grid grid-cols-12 gap-4 md:gap-8 p-6 md:p-8 items-start">
                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-baseline gap-3 md:block">
                          <span className="font-heading text-4xl md:text-5xl font-extrabold text-casablanca leading-none">
                            {stage.num}
                          </span>
                          <h3 className="font-heading text-xl font-bold text-firefly md:mt-2">
                            {stage.title}
                          </h3>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-9">
                        <p className="text-gray-600 leading-relaxed">
                          {stage.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Invite email preview */}
        <section className="py-16 md:py-24 bg-firefly text-white">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca">
                  The Invite Email
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Warm. Specific. Zero hype.
                </h2>
                <p className="text-lg text-white/75 max-w-[640px] mx-auto">
                  Sent through Supabase as a branded magic link. One-time per
                  email. Taps open the app, install the app, and sign the
                  user in all in one flow.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="max-w-[640px] mx-auto bg-offwhite rounded-2xl shadow-2xl p-8 md:p-12 text-ink">
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-firefly flex items-center justify-center text-white font-bold text-sm">
                    T
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-firefly text-sm">
                      The Tribes Team
                    </div>
                    <div className="text-xs text-gray-500">
                      hello@trytribes.com
                    </div>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-firefly mb-4">
                  You&apos;re invited: be one of the first to try Tribes
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                  <p>Hi Jane,</p>
                  <p>
                    Tribes is something we&apos;ve been quietly building, and
                    you&apos;re on a short list of people we trust enough to
                    see it first.
                  </p>

                  {/* Founder video placeholder */}
                  <div className="not-prose">
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-firefly to-firefly-light aspect-video flex items-center justify-center cursor-pointer group shadow-md">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 20%, rgba(246,183,74,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(135,155,151,0.3) 0%, transparent 50%)",
                        }}
                        aria-hidden="true"
                      />
                      <div className="relative flex flex-col items-center text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-casablanca flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 mb-3">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="#103730"
                            aria-hidden="true"
                            style={{ marginLeft: 3 }}
                          >
                            <polygon points="6 4 20 12 6 20 6 4" />
                          </svg>
                        </div>
                        <div className="text-white text-xs font-bold tracking-widest uppercase mb-1 opacity-80">
                          Message from the founder
                        </div>
                        <div className="text-white/70 text-xs">
                          ~1 minute · tap to watch
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                          Placeholder
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 italic mt-2 text-center">
                      (A short video of the founder explaining what Tribes is
                      and why feedback matters, to be recorded and embedded
                      here as a next step.)
                    </p>
                  </div>

                  <p>
                    <strong className="text-firefly">What is it?</strong> A
                    way for neighbors to share what they have and find what
                    they need, without money changing hands. The tools in
                    your garage, the ladder you use twice a year, the
                    stroller your kids outgrew, all matched with a neighbor
                    nearby who'd put them to use.
                  </p>
                  <p>
                    You're getting this invite because your voice matters to
                    us. The Tribes you see today is <em>early</em>. Rough
                    edges included. That's the point. We want to build it
                    with you, not ship it at you.
                  </p>
                  <p className="text-firefly font-bold pt-2">
                    Three things we'd love from you:
                  </p>
                  <ol className="space-y-2 list-none pl-0">
                    <li className="flex gap-3">
                      <span className="font-bold text-casablanca-dark">1.</span>
                      <span>Take about 5 minutes to try it out.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-casablanca-dark">2.</span>
                      <span>
                        Tap <strong>Share Feedback</strong> and tell us what
                        you think. Even "I don't get it" is gold.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-casablanca-dark">3.</span>
                      <span>
                        If you're open to a 15-minute call afterward, just
                        reply to this email.
                      </span>
                    </li>
                  </ol>
                  <div className="pt-4 text-center">
                    <span className="inline-block bg-casablanca text-firefly font-bold px-10 py-3.5 rounded-lg shadow-md">
                      Accept your invite
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center pt-1">
                    Tapping this link sets up your account and opens the app.
                  </p>
                  <p className="pt-4">
                    Thank you for being part of the first tribe.
                    <br />
                    <span className="text-firefly font-bold">
                      The Tribes Team
                    </span>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Feedback mechanism */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Feedback Mechanism
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  8 questions. 3 minutes. One tap away.
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  A Share Feedback button lives in the app menu. Tapping it
                  opens a form pre-filled with the user's ID, so every
                  response ties back to a real person we can follow up with.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <ScrollReveal>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-firefly text-white px-6 py-4 flex items-center justify-between">
                    <span className="font-bold text-sm">Share Feedback</span>
                    <span className="text-xs text-white/60">~3 min</span>
                  </div>
                  <div className="p-6 space-y-3">
                    {FEEDBACK_QUESTIONS.map((item, i) => (
                      <div
                        key={item.q}
                        className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
                      >
                        <span className="shrink-0 w-7 h-7 rounded-full bg-casablanca/20 text-casablanca-dark flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink text-sm font-medium leading-snug">
                            {item.q}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-5">
                  {[
                    {
                      title: "Structured, but short",
                      body:
                        "Mix of quant (1-5 ratings) and qual (one-sentence answers). Starts easy, ends open. Designed so users don't bail at question 3.",
                    },
                    {
                      title: "Tied to the user",
                      body:
                        "Hidden fields pre-fill the Supabase user ID and app version on every submission. We know exactly who said what, and can reach back out.",
                    },
                    {
                      title: "Lands in our existing CRM",
                      body:
                        "Every response flows into GHL tagged source=mvp-feedback. No new tool to learn, no data migration, just a filtered view in the same dashboard we already use.",
                    },
                    {
                      title: "Iterate without shipping",
                      body:
                        "Because the form is a web URL (not native), we can add, remove, or reword questions anytime, without a new TestFlight build.",
                    },
                  ].map((item, i) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-casablanca text-firefly flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-firefly mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Iteration cadence */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Iteration Cadence
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  Listen every week.
                  <br />
                  Ship when it&apos;s ready.
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  The feedback loop only works if it closes, but closing it
                  well matters more than closing it fast. Here&apos;s the
                  rhythm.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  cadence: "Every week",
                  title: "Synthesize",
                  body:
                    "45-minute session. Read every new response. Tag themes. Shape the backlog. Queue follow-up calls with users who opted in.",
                  color: "bg-firefly text-white",
                  accent: "text-casablanca",
                },
                {
                  cadence: "Every 1-2 weeks",
                  title: "Ship",
                  body:
                    "Push improvements when they're actually ready, not forced into a weekend. Each cycle is a real dev sprint, tested and stable before it goes out.",
                  color: "bg-casablanca text-firefly",
                  accent: "text-firefly",
                },
                {
                  cadence: "Every 2 weeks",
                  title: "Close the loop",
                  body:
                    "Send a 'You said, we did' update to all invited users. Tells them their feedback was worth giving, and keeps them engaged for the next round.",
                  color: "bg-white text-ink border border-gray-200",
                  accent: "text-casablanca-dark",
                },
              ].map((col, i) => (
                <ScrollReveal key={col.cadence} delay={i * 0.1}>
                  <div
                    className={`rounded-2xl p-8 h-full shadow-sm hover:shadow-lg transition-all duration-300 ${col.color}`}
                  >
                    <div
                      className={`text-xs font-bold tracking-widest uppercase mb-3 ${col.accent}`}
                    >
                      {col.cadence}
                    </div>
                    <h3 className="font-heading text-2xl font-extrabold mb-3">
                      {col.title}
                    </h3>
                    <p className="leading-relaxed opacity-90">{col.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Success metrics */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1100px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Success Metrics
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  What we're actually measuring.
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  Vanity metrics don't belong in an MVP. These four tell us
                  whether we're learning, not growing.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {METRICS.map((metric, i) => (
                <ScrollReveal key={metric.label} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-casablanca/50 transition-all hover:shadow-md">
                    <div className="text-xs font-bold tracking-wider uppercase text-gray-400 mb-2">
                      {metric.label}
                    </div>
                    <div className="font-heading text-3xl font-extrabold text-firefly mb-3">
                      {metric.target}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {metric.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-14">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Timeline
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  First 8 weeks.
                </h2>
                <p className="text-lg text-gray-600 max-w-[640px] mx-auto">
                  Prep, send, iterate, decide. Short enough to stay sharp.
                </p>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Vertical timeline line */}
              <div
                className="absolute left-[11px] md:left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-casablanca via-casablanca/60 to-casablanca/10"
                aria-hidden="true"
              />

              <div className="space-y-5">
                {TIMELINE.map((stage, i) => (
                  <ScrollReveal key={stage.week} delay={i * 0.08}>
                    <div className="relative pl-10 md:pl-14">
                      {/* Dot sitting on the line */}
                      <div
                        className="absolute left-[3px] md:left-[5px] top-[22px] w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full bg-casablanca flex items-center justify-center"
                        style={{
                          boxShadow:
                            "0 0 0 5px #E7EBEA, 0 4px 14px rgba(246,183,74,0.35)",
                        }}
                        aria-hidden="true"
                      >
                        <span className="font-heading text-[10px] md:text-xs font-extrabold text-firefly leading-none">
                          {i + 1}
                        </span>
                      </div>

                      {/* Card */}
                      <div className="bg-white rounded-xl p-6 md:p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-casablanca/30 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-casablanca/10 border border-casablanca/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-casablanca-dark" />
                            <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-casablanca-dark">
                              {stage.week}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-heading text-xl md:text-2xl font-extrabold text-firefly mb-4 leading-tight">
                          {stage.title}
                        </h3>
                        <ul className="space-y-2.5">
                          {stage.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-gray-600 text-sm leading-relaxed"
                            >
                              <span className="text-casablanca-dark shrink-0 mt-0.5 font-bold">
                                →
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
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
          MVP Launch Plan · internal client walkthrough
        </p>
      </footer>
    </div>
  );
}
