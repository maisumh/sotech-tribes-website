import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Running Costs | Tribes",
  description:
    "What Tribes costs to run today, how those costs behave at 10,000 members, and what identity verification would add.",
  robots: { index: false, follow: false },
};

// Read from live billing and the production database on 23 August 2026.
const AI_MONTHS = [
  { label: "Nov", value: 0.5394 },
  { label: "Dec", value: 0.4575 },
  { label: "Jan", value: 0.115 },
  { label: "Feb", value: 0.1686 },
  { label: "Mar", value: 0.0345 },
  { label: "Apr", value: 0.2473 },
  { label: "May", value: 0.203 },
  { label: "Jun", value: 0.4095 },
  { label: "Jul", value: 0.0582 },
  { label: "Aug", value: 0.0419 },
];
const AI_PEAK = Math.max(...AI_MONTHS.map((m) => m.value));

const HEADLINE_STATS = [
  { value: "$44", label: "Per month, every service combined" },
  { value: "$2.27", label: "Total AI spend since November 2025" },
  { value: "$0", label: "Notification delivery and crash reporting" },
  { value: "198 MB", label: "Storage used, of the 100 GB included" },
];

const CURRENT_COSTS = [
  {
    service: "Supabase",
    charge: "Flat subscription, charged in advance. The database, sign-in, file storage and live chat.",
    amount: "$25.00",
    period: "/ mo",
  },
  {
    service: "Expo",
    charge: "Flat subscription. Builds both apps, submits them to the stores, and ships updates to phones.",
    amount: "$19.00",
    period: "/ mo",
  },
  {
    service: "OpenAI",
    charge: "By use, billed at the end of the month. About a quarter of a cent per listing posted.",
    amount: "~$0.05",
    period: "/ mo",
  },
  {
    service: "Resend",
    charge: "Password resets and account email. Free to 3,000 emails a month.",
    amount: "$0.00",
    period: "/ mo",
  },
  {
    service: "Firebase",
    charge: "Push notification delivery and crash reporting. Free at any volume.",
    amount: "$0.00",
    period: "/ mo",
  },
  {
    service: "Apple Developer",
    charge: "Annual membership, required to keep the app on the App Store.",
    amount: "$99.00",
    period: "/ yr",
  },
];

const NOT_BILLED = [
  {
    service: "Website hosting",
    charge: "trytribes.com, the admin console and the supporting web pages. Hosted and maintained by SoTech with unlimited revisions.",
    amount: "$100.00",
    period: "/ mo",
  },
  {
    service: "Marketing Automation Platform",
    charge: "SoTech's marketing automation and CRM platform, carrying marketing email and the waitlist leads.",
    amount: "$150.00",
    period: "/ mo",
  },
];

const PROJECTION = [
  {
    name: "AI",
    at10k: "$27 to $102",
    unit: "total",
    note: "Ten thousand listings read at about a quarter of a cent each. This is a total to reach 10,000 members, not a monthly figure. Moving to the smaller model, a settings change with no app release, brings it to $5.",
  },
  {
    name: "Photo storage",
    at10k: "$0",
    unit: "",
    note: "Roughly 32 GB against the 100 GB already included in the database plan. Even at ten photos per member it stays inside the allowance.",
  },
  {
    name: "Database",
    at10k: "$0",
    unit: "",
    note: "Well under 1 GB against the 8 GB included. Five years of notification history accounts for a few megabytes of that.",
  },
  {
    name: "Notifications",
    at10k: "$0",
    unit: "",
    note: "Apple and Firebase deliver push notifications free at any volume.",
  },
  {
    name: "Subscriptions",
    at10k: "$44 to $84",
    unit: "/ mo",
    note: "The services above. The only line that moves is email, if a heavy signup month pushes past the free allowance.",
  },
];

const VERIFY_MODULES = [
  { name: "ID document verification", price: "$0.15" },
  { name: "Liveness check, a real person rather than a photo", price: "$0.10" },
  { name: "Face match, selfie against the document", price: "$0.05" },
  { name: "Sanctions and watchlist screening", price: "$0.20" },
  { name: "Device and IP analysis", price: "$0.03" },
];

const VERIFY_SCALE = [
  {
    volume: "1,000 verifications",
    context: "Every member through the door in a Montrose launch",
    spread: "$0",
    burst: "$165",
  },
  {
    volume: "2,000 verifications",
    context: "One in five of 10,000 members chooses to verify",
    spread: "$0",
    burst: "$495",
  },
  {
    volume: "10,000 verifications",
    context: "Every member of a 10,000 member marketplace verifies",
    spread: "~$1,320",
    burst: "$3,135",
  },
];

const VERIFY_VENDORS = [
  { name: "Didit", price: "$0.33", terms: "500 free every month, permanently. No minimum, no contract." },
  { name: "Veriff", price: "$0.80", terms: "$49 a month minimum. Month to month." },
  { name: "Stripe Identity", price: "$1.50", terms: "No minimum. Pay as you go." },
  { name: "Persona", price: "$1.50", terms: "$250 a month minimum on an annual contract, 500 included." },
];

export default function CostsPage() {
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
            Running Costs, August 2026
          </span>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-firefly via-firefly-light to-firefly text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-casablanca blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-granny blur-3xl" />
          </div>
          <div className="relative max-w-[920px] mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-casablanca/20 border border-casablanca/40">
              <span className="text-casablanca text-xs font-bold tracking-widest uppercase">
                Running costs and projections
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight animate-hero-fade-up">
              What it costs
              <br />
              <span className="text-casablanca">to run Tribes.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-[700px] mx-auto animate-hero-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              Three questions answered with measured numbers: what Tribes
              costs to operate today, how those costs behave as the
              marketplace grows to ten thousand members, and what identity
              verification would add if it is introduced.
            </p>
            <p
              className="text-sm text-white/50 mt-6 animate-hero-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              Read from live billing and the production database on 23 August
              2026.
            </p>
          </div>
        </section>

        {/* Current costs */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Current position
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  What Tribes pays today.
                </h2>
                <p className="text-lg text-gray-600 max-w-[680px] mx-auto">
                  Six accounts carry the entire operation: sixty-five members,
                  223 listings, and every photo, message and match created
                  since launch.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {HEADLINE_STATS.map((s, i) => (
                <ScrollReveal key={s.label} delay={i * 0.06}>
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 h-full">
                    <div className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-2 tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-sm text-gray-600 leading-snug">
                      {s.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left">
                    <thead>
                      <tr className="bg-firefly text-white">
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase w-[26%]">
                          Service
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase">
                          How it charges
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-right whitespace-nowrap">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {CURRENT_COSTS.map((c) => (
                        <tr key={c.service} className="align-top">
                          <td className="px-6 py-4 font-heading font-bold text-firefly text-sm whitespace-nowrap">
                            {c.service}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                            {c.charge}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="font-heading font-extrabold text-firefly tabular-nums">
                              {c.amount}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              {c.period}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-firefly/[0.05] border-t-2 border-firefly/10">
                        <td className="px-6 py-5 font-heading font-bold text-firefly text-sm whitespace-nowrap">
                          Running cost
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          Monthly services only. The Apple membership is billed
                          once a year.
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <span className="font-heading text-2xl font-extrabold text-firefly tabular-nums">
                            $44
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            / mo
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-heading font-bold text-firefly text-sm">
                    Provided today, not billed to Tribes
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Shown at standard rate so the full operating picture is
                    visible in one place.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left">
                    <tbody className="divide-y divide-gray-100">
                      {NOT_BILLED.map((n) => (
                        <tr key={n.service} className="align-top">
                          <td className="px-6 py-4 font-heading font-bold text-firefly text-sm w-[26%]">
                            {n.service}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                            {n.charge}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="font-heading font-extrabold text-gray-400 tabular-nums">
                              {n.amount}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              {n.period}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* AI history */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[900px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Usage-based spend
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  AI spend, month by month.
                </h2>
                <p className="text-lg text-gray-600 max-w-[660px] mx-auto">
                  AI is the only cost that moves with how much the app is used,
                  and it is charged once per listing posted. The first two
                  months reflect development and testing, before the
                  marketplace carried real members.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-end gap-2 h-48 md:h-56">
                  {AI_MONTHS.map((m) => (
                    <div
                      key={m.label}
                      className="flex-1 min-w-0 flex flex-col justify-end items-center h-full group"
                    >
                      <span className="hidden sm:block text-[11px] font-semibold text-gray-500 tabular-nums mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${m.value.toFixed(2)}
                      </span>
                      <div
                        className="w-full max-w-[44px] rounded-t-md bg-casablanca group-hover:bg-casablanca-dark transition-colors"
                        style={{
                          height: `${Math.max((m.value / AI_PEAK) * 100, 1.5)}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-gray-200 pt-2.5">
                  {AI_MONTHS.map((m) => (
                    <span
                      key={m.label}
                      className="flex-1 min-w-0 text-center text-[11px] text-gray-500"
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-gray-100 pt-5">
                  <span className="text-sm text-gray-600">
                    November 2025 through 23 August 2026
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-firefly tabular-nums">
                    $2.27 total
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-6 rounded-2xl bg-firefly text-white p-6 md:p-7">
                <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-2">
                  Why it stays low
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Matching never calls an AI service. The charge happens once,
                  when a listing is posted and the app writes its title and
                  description. Matching that listing against every other
                  listing, for as long as it exists, is arithmetic the database
                  performs at no additional cost.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Projection */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  Projection
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  At ten thousand members.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  The usage-based portion, AI and storage together, comes to
                  roughly $100 in total to carry the marketplace from its
                  current size to ten thousand members. Not per month. In
                  total.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-4 mb-8">
              {PROJECTION.map((p, i) => (
                <ScrollReveal key={p.name} delay={i * 0.06}>
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-6 py-5 md:px-7 md:py-6 grid grid-cols-1 md:grid-cols-[150px_1fr_140px] gap-3 md:gap-6 md:items-center">
                    <div className="font-heading font-bold text-firefly text-base">
                      {p.name}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed order-3 md:order-none">
                      {p.note}
                    </p>
                    <div className="md:text-right whitespace-nowrap">
                      <span className="font-heading text-xl font-extrabold text-casablanca-dark tabular-nums">
                        {p.at10k}
                      </span>
                      {p.unit ? (
                        <span className="text-xs text-gray-500 ml-1">
                          {p.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="rounded-2xl bg-firefly text-white p-8 md:p-10 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-casablanca blur-3xl" />
                </div>
                <div className="relative">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-3">
                    The shape of it
                  </div>
                  <p className="font-heading text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
                    A hundred times the members, less than double the cost.
                  </p>
                  <p className="text-sm text-white/70 max-w-[640px] mx-auto leading-relaxed">
                    Infrastructure is not the constraint on growth here. What
                    scales with a marketplace of that size is people: support,
                    moderation and marketing.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Identity verification */}
        <section className="py-16 md:py-24 bg-granny/20">
          <div className="max-w-[1000px] mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block mb-3 text-xs font-bold tracking-widest uppercase text-casablanca-dark">
                  If identity verification is added
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-firefly mb-4">
                  33 cents per verified member.
                </h2>
                <p className="text-lg text-gray-600 max-w-[700px] mx-auto">
                  A document scan, a liveness check and a face match together
                  cost 33 cents with the strongest low-cost vendor. The first
                  500 every month are free permanently, and failed checks are
                  not billed.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                {
                  t: "Charged once per person",
                  b: "Verification is not a subscription. Once a member is verified they never cost anything again, which is the opposite of how the AI cost behaves.",
                },
                {
                  t: "500 free every month",
                  b: "A permanent monthly allowance rather than a trial. Volume that arrives gradually is absorbed by it entirely.",
                },
                {
                  t: "Failed checks are free",
                  b: "Only completed verifications are billed, so fraudulent attempts and abandoned sessions cost nothing.",
                },
              ].map((c, i) => (
                <ScrollReveal key={c.t} delay={i * 0.08}>
                  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-7 h-full">
                    <h3 className="font-heading font-bold text-firefly text-base mb-3">
                      {c.t}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {c.b}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-left">
                    <thead>
                      <tr className="bg-firefly text-white">
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase">
                          How it scales
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-right whitespace-nowrap">
                          Over a year
                        </th>
                        <th className="px-6 py-4 text-[11px] font-bold tracking-widest uppercase text-right whitespace-nowrap">
                          All in one month
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {VERIFY_SCALE.map((v) => (
                        <tr key={v.volume} className="align-top">
                          <td className="px-6 py-4">
                            <div className="font-heading font-bold text-firefly text-sm">
                              {v.volume}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {v.context}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap font-heading font-extrabold text-firefly tabular-nums">
                            {v.spread}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap font-heading font-extrabold text-gray-400 tabular-nums">
                            {v.burst}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-firefly/[0.04] border-t border-firefly/10 text-sm text-gray-600 leading-relaxed">
                  The only variable that matters is pace. Six thousand
                  verifications a year fall inside the free allowance, so cost
                  only appears when more than 500 people verify inside a single
                  month.
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal>
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden h-full">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-heading font-bold text-firefly text-sm">
                      What makes up the 33 cents
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {VERIFY_MODULES.map((m) => (
                      <li
                        key={m.name}
                        className="px-6 py-3.5 flex items-baseline justify-between gap-4"
                      >
                        <span className="text-sm text-gray-600 leading-snug">
                          {m.name}
                        </span>
                        <span className="font-heading font-bold text-firefly text-sm tabular-nums whitespace-nowrap">
                          {m.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="px-6 py-3.5 bg-firefly/[0.04] border-t border-firefly/10 flex items-baseline justify-between gap-4">
                    <span className="text-sm font-bold text-firefly">
                      The core three, bundled
                    </span>
                    <span className="font-heading font-extrabold text-firefly tabular-nums">
                      $0.33
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden h-full">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-heading font-bold text-firefly text-sm">
                      What the market charges
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Per completed verification, read from published pricing.
                    </p>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {VERIFY_VENDORS.map((v) => (
                      <li key={v.name} className="px-6 py-3.5">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-heading font-bold text-firefly text-sm">
                            {v.name}
                          </span>
                          <span className="font-heading font-extrabold text-firefly text-sm tabular-nums whitespace-nowrap">
                            {v.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {v.terms}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="py-16 md:py-20 bg-firefly text-white">
          <div className="max-w-[760px] mx-auto px-4 text-center">
            <ScrollReveal>
              <div className="text-[11px] font-bold tracking-widest uppercase text-casablanca mb-3">
                About this page
              </div>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                These figures change as Tribes grows, so this page is kept
                current rather than printed. The companion document, covering
                how the app is built and which service performs which job,
                describes the system as it stood on 23 August 2026 and is meant
                to stay fixed.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-casablanca transition-colors"
              >
                Back to trytribes.com
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
          Running costs, read from live billing on 23 August 2026, prepared for
          Dan Hudson
        </p>
      </footer>
    </div>
  );
}
