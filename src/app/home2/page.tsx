import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ClientFAQ from "@/components/ui/ClientFAQ";
import WaitlistForm from "@/components/ui/WaitlistForm";
import {
  VALUE_PROP,
  NEIGHBORHOOD,
  HOW_IT_WORKS,
  FEATURES,
  OUR_PEOPLE,
  TRIBE_TYPES,
  AUDIENCES,
  IMPACT,
  FOUNDING_MEMBER,
  TESTIMONIALS,
  FAQ_ITEMS,
} from "@/lib/constants";
import HeroVideo from "./HeroVideo";

export const metadata: Metadata = {
  title: "Tribes™ — Editorial Preview | Home v2",
  description:
    "An editorial redesign of the Tribes home page. Same content, elevated typography and layout.",
  robots: { index: false, follow: false },
};

function Kicker({
  label,
  num,
  tone = "light",
  align = "responsive",
}: {
  label: string;
  num: string;
  tone?: "light" | "dark" | "center";
  /** "left" = always left · "center" = always centered · "responsive" = centered on mobile, left on md+ */
  align?: "left" | "center" | "responsive";
}) {
  const colorLabel = "text-casablanca";
  const colorNum = tone === "dark" ? "text-white/30" : "text-firefly/30";

  // Legacy "center" tone prop still wins for backwards compat
  const effectiveAlign = tone === "center" ? "center" : align;
  const container =
    effectiveAlign === "center"
      ? "flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-6"
      : effectiveAlign === "left"
        ? "flex flex-wrap items-center gap-x-3 gap-y-2 mb-6"
        : "flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 mb-6";

  return (
    <div className={container}>
      <span className="block h-px w-10 bg-casablanca shrink-0" />
      <span className={`text-[11px] font-semibold uppercase tracking-[0.35em] whitespace-nowrap ${colorLabel}`}>
        {label}
      </span>
      <span className={`text-[11px] font-semibold uppercase tracking-[0.35em] whitespace-nowrap ${colorNum}`}>
        {num}
      </span>
    </div>
  );
}

export default function Home2() {
  return (
    <>
      <Header />
      <main id="main" className="bg-offwhite">
        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section className="relative pt-[calc(70px+3rem)] pb-20 md:pt-[calc(70px+5rem)] md:pb-28 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute top-[70px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-casablanca/30 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-[560px] h-[560px] rounded-full bg-casablanca/5 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-[1440px] xl:max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-12 lg:gap-14 xl:gap-20 items-center">
              {/* Left: headline */}
              <div className="text-center lg:text-left">
                <div className="animate-hero-fade-up" style={{ animationDelay: "0.05s" }}>
                  <Kicker label="The home of neighbors" num="A hyperlocal app" />
                </div>

                <h1
                  className="font-heading font-extralight text-firefly leading-[0.98] tracking-[-0.025em] animate-hero-fade-up"
                  style={{
                    animationDelay: "0.15s",
                    fontSize: "clamp(2.75rem, 5.4vw, 5.75rem)",
                  }}
                >
                  Rediscover your <em className="font-light not-italic text-casablanca">neighborhood.</em>
                  <br />
                  Build your <em className="font-light not-italic">tribe.</em>
                </h1>

                <p
                  className="mt-8 max-w-[44rem] mx-auto lg:mx-0 text-gray-600 leading-[1.6] animate-hero-fade-up"
                  style={{
                    animationDelay: "0.3s",
                    fontSize: "clamp(1rem, 1.35vw, 1.375rem)",
                  }}
                >
                  A hyperlocal app where neighbors list what they&rsquo;re <em className="text-firefly not-italic font-semibold">Offering</em> and what they&rsquo;re <em className="text-firefly not-italic font-semibold">Seeking</em>. We match the two. No money, no feeds — just a two-way trade with people nearby.
                </p>

                <div
                  className="mt-10 flex flex-col sm:flex-row items-center lg:items-center lg:justify-start justify-center gap-6 animate-hero-fade-up"
                  style={{ animationDelay: "0.45s" }}
                >
                  <a
                    href="#final-cta"
                    className="group inline-flex items-center justify-center gap-3 bg-firefly text-white font-semibold px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] transition-all hover:bg-firefly-light hover:shadow-xl hover:shadow-firefly/20 hover:-translate-y-0.5"
                  >
                    Join the waitlist
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <div className="text-xs uppercase tracking-[0.25em] text-firefly/50">
                    <span className="text-casablanca font-semibold">500+</span> neighbors · Spring 2026
                  </div>
                </div>
              </div>

              {/* Right: video with editorial overlay card */}
              <div
                className="relative animate-hero-fade-up"
                style={{ animationDelay: "0.35s" }}
              >
                <div className="relative">
                  <HeroVideo />
                  {/* Floating editorial tag */}
                  <div className="absolute -bottom-6 -left-6 bg-firefly text-white px-6 py-4 rounded-[2px] shadow-[0_20px_40px_-15px_rgba(16,55,48,0.4)] hidden md:block">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-casablanca mb-1">Now matching in</div>
                    <div className="font-heading text-2xl font-extralight tracking-tight">Houston &amp; beyond</div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 w-6 h-6 bg-casablanca hidden md:block"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────── VALUE PROP ──────────────────────────── */}
        <section className="relative py-24 md:py-32 border-y border-firefly/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-24 items-start text-center lg:text-left">
                <div className="lg:sticky lg:top-24">
                  <Kicker label="Why Tribes" num="002" />
                  <div className="font-heading text-xs uppercase tracking-[0.35em] text-firefly/50">
                    A manifesto<br />
                    in two parts
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extralight text-firefly leading-[1.04] tracking-[-0.02em]">
                    On social media<br />
                    you <em className="font-light not-italic text-firefly/40">scroll.</em>
                    <br />
                    On Tribes,<br />
                    you <em className="font-light not-italic text-casablanca">build.</em>
                  </h2>
                  <div className="mt-12 space-y-6 text-lg md:text-xl text-gray-700 leading-[1.7] max-w-2xl mx-auto lg:mx-0">
                    {VALUE_PROP.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ──────────────────────────── NEIGHBORHOOD STATS ──────────────────────────── */}
        <section className="py-24 md:py-32 bg-firefly text-white overflow-hidden relative">
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-casablanca/10 blur-3xl pointer-events-none"
          />
          <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="mb-16 md:mb-24 max-w-3xl text-center md:text-left mx-auto md:mx-0">
                <Kicker label="By the numbers" num="003" tone="dark" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.02] tracking-[-0.02em]">
                  {NEIGHBORHOOD.title[0]}<br />
                  <em className="font-light not-italic text-casablanca">{NEIGHBORHOOD.title[1]}</em>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
              {NEIGHBORHOOD.stats.map((stat, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="bg-firefly h-full p-8 md:p-10">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-casablanca mb-6">
                      — {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-heading text-5xl md:text-6xl lg:text-7xl font-extralight leading-none tracking-[-0.03em] mb-6">
                      {stat.value}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                      {stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── HOW IT WORKS ──────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-end gap-6 md:gap-12 mb-16 md:mb-24 text-center md:text-left">
                <div>
                  <Kicker label="How it works" num="004" />
                  <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                    {HOW_IT_WORKS.title[0]}<br />
                    <em className="font-light not-italic text-casablanca">{HOW_IT_WORKS.title[1]}</em>
                  </h2>
                </div>
                <p className="text-gray-600 leading-[1.7] max-w-sm md:text-right md:self-end md:pb-2 mx-auto md:mx-0">
                  Five steps from signup to your first trade. Most neighbors make a match in their first week.
                </p>
              </div>
            </ScrollReveal>

            <div className="divide-y divide-firefly/15 border-y border-firefly/15">
              {HOW_IT_WORKS.steps.map((step, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <ScrollReveal key={i} delay={i * 0.06}>
                    <div className="group grid grid-cols-[auto_1fr_auto] gap-6 md:gap-12 py-10 md:py-12 items-baseline transition-colors">
                      <span className="font-heading text-3xl md:text-5xl font-extralight text-firefly/30 group-hover:text-casablanca tabular-nums tracking-tight transition-colors">
                        {num}
                      </span>
                      <div>
                        <h3 className="font-heading text-xl md:text-2xl font-medium text-firefly mb-3 leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-[1.7] max-w-2xl text-base md:text-[1.0625rem]">
                          {step.text}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="text-casablanca/40 group-hover:text-casablanca transition-all group-hover:translate-x-1 text-2xl font-light"
                      >
                        →
                      </span>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── TRIBE TYPES ──────────────────────────── */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-offwhite via-white to-offwhite border-t border-firefly/10">
          <div className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="max-w-3xl mb-16 md:mb-20 text-center md:text-left mx-auto md:mx-0">
                <Kicker label="Tribe types" num="005" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                  What kind of tribe<br />
                  will <em className="font-light not-italic text-casablanca">you build?</em>
                </h2>
                <p className="mt-8 text-gray-600 leading-[1.7] text-lg max-w-2xl mx-auto md:mx-0">
                  A tribe is a small, high-trust group organized around what you care about. Start one, join many.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-firefly/10 border border-firefly/10">
              {TRIBE_TYPES.items.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.05}>
                  <div className="group bg-offwhite h-full p-8 md:p-10 transition-colors hover:bg-white relative overflow-hidden">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-firefly/30 mb-6 group-hover:text-casablanca transition-colors">
                      — {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-4xl mb-6">{item.icon}</div>
                    <h3 className="font-heading text-xl md:text-2xl font-medium text-firefly mb-4 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-[1.7]">
                      {item.text}
                    </p>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-6 right-8 text-casablanca/0 group-hover:text-casablanca transition-all group-hover:translate-x-1 text-xl"
                    >
                      →
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── FEATURES ──────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="max-w-3xl mb-16 md:mb-20 text-center md:text-left mx-auto md:mx-0">
                <Kicker label="Features" num="006" />
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extralight text-firefly leading-[1.04] tracking-[-0.02em]">
                  Built for <em className="font-light not-italic text-casablanca">real communities.</em>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
              {FEATURES.items.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.05}>
                  <div className="group">
                    <div className="flex items-start gap-5 mb-4">
                      <span className="text-3xl shrink-0 leading-none">{item.icon}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-firefly/30 group-hover:text-casablanca transition-colors pt-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg md:text-xl font-medium text-firefly mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base leading-[1.7]">
                      {item.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── OUR PEOPLE (manifesto) ──────────────────────────── */}
        <section className="py-24 md:py-32 bg-firefly text-white relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-casablanca/10 blur-3xl pointer-events-none"
          />
          <div className="relative max-w-[1000px] mx-auto px-6 md:px-10 lg:px-12 text-center md:text-left">
            <ScrollReveal>
              <Kicker label="Our people" num="007" tone="dark" />
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.04] tracking-[-0.02em] mb-16">
                We all need <em className="font-light not-italic text-casablanca">our people.</em>
              </h2>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {OUR_PEOPLE.paragraphs.map((p, i) => (
                  <p key={i} className="text-lg md:text-xl text-white/75 leading-[1.8]">
                    <span className="text-casablanca font-semibold mr-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ──────────────────────────── AUDIENCES ──────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="max-w-3xl mb-16 md:mb-20 text-center md:text-left mx-auto md:mx-0">
                <Kicker label="Who it's for" num="008" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                  Built for everyone<br />
                  on your <em className="font-light not-italic text-casablanca">block.</em>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {AUDIENCES.items.map((aud, i) => (
                <ScrollReveal key={aud.id} delay={i * 0.1}>
                  <Link
                    href={`/${aud.id}`}
                    className="group relative block bg-offwhite border border-firefly/10 p-8 md:p-12 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(16,55,48,0.2)] hover:border-casablanca/40"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="text-4xl">{aud.icon}</div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-firefly/30 group-hover:text-casablanca transition-colors pt-2">
                        — {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl font-extralight text-firefly mb-4 leading-tight tracking-[-0.01em]">
                      {aud.title}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-[1.7]">{aud.subtitle}</p>
                    <ul className="space-y-2 mb-10">
                      {aud.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-firefly/80">
                          <span className="text-casablanca mt-1">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-semibold text-firefly group-hover:text-casablanca transition-colors">
                      {aud.cta}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── IMPACT METRICS ──────────────────────────── */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-offwhite via-white to-offwhite border-y border-firefly/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="max-w-3xl mb-16 md:mb-20 text-center md:text-left mx-auto md:mx-0">
                <Kicker label="The impact" num="009" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                  Stronger tribes.<br />
                  <em className="font-light not-italic text-casablanca">Stronger neighborhoods.</em>
                </h2>
                <div className="mt-8 space-y-4 text-gray-700 leading-[1.7] text-lg">
                  {IMPACT.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {IMPACT.metrics.map((m, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="border border-firefly/10 p-8 md:p-10 bg-offwhite relative">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-casablanca mb-6">
                      — {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="font-heading text-4xl md:text-5xl lg:text-6xl font-extralight text-firefly leading-none tracking-[-0.03em] mb-6">
                      {m.value}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{m.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── FOUNDING MEMBER ──────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1000px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="relative bg-firefly text-white p-10 md:p-16 rounded-[3px] shadow-[0_40px_80px_-20px_rgba(16,55,48,0.4)] text-center md:text-left">
                <span aria-hidden="true" className="absolute -top-3 left-10 w-6 h-6 bg-casablanca" />
                <span aria-hidden="true" className="absolute -bottom-3 right-10 w-6 h-6 bg-casablanca/60" />
                <Kicker label="Founding member" num="010" tone="dark" />
                <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight leading-[1.04] tracking-[-0.02em] mb-12 max-w-3xl mx-auto md:mx-0">
                  Shape your neighborhood&rsquo;s tribes <em className="font-light not-italic text-casablanca">from day one.</em>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-12 max-w-xl mx-auto md:mx-0 md:max-w-none">
                  {FOUNDING_MEMBER.benefits.map((b, i) => (
                    <div key={b} className="flex items-start gap-4 text-white/85 text-left">
                      <span className="text-casablanca font-semibold text-sm pt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="#final-cta"
                  className="group inline-flex items-center gap-3 bg-casablanca text-firefly font-semibold px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-casablanca/30"
                >
                  {FOUNDING_MEMBER.cta}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ──────────────────────────── TESTIMONIALS ──────────────────────────── */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-offwhite to-white border-t border-firefly/10">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="max-w-3xl mb-16 md:mb-20 text-center md:text-left mx-auto md:mx-0">
                <Kicker label="In their words" num="011" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                  Notes from<br />
                  <em className="font-light not-italic text-casablanca">early tribes.</em>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {TESTIMONIALS.map((t, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <figure className="h-full flex flex-col border-t border-firefly/20 pt-8">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-casablanca mb-6">
                      — {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-heading text-5xl md:text-6xl leading-none text-casablanca mb-4 font-extralight"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="font-heading text-lg md:text-xl text-firefly/90 leading-[1.55] italic font-light flex-1">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-8 pt-6 border-t border-firefly/10">
                      <div className="font-semibold text-firefly text-sm">{t.name}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-firefly/50 mt-1">{t.title}</div>
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────── FAQ ──────────────────────────── */}
        <section className="py-24 md:py-32">
          <div className="max-w-[920px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-end gap-6 md:gap-12 mb-14 md:mb-20 text-center md:text-left">
                <div>
                  <Kicker label="Questions" num="012" />
                  <h2 className="font-heading text-4xl md:text-6xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                    Asked &amp; <em className="font-light not-italic text-casablanca">answered.</em>
                  </h2>
                </div>
                <p className="text-gray-600 leading-[1.7] max-w-sm md:text-right md:self-end md:pb-2 mx-auto md:mx-0">
                  If yours isn&rsquo;t here, write to{" "}
                  <a href="/support" className="text-firefly underline decoration-casablanca/40 hover:decoration-casablanca underline-offset-4">
                    support
                  </a>
                  .
                </p>
              </div>
            </ScrollReveal>
            <div className="border-t border-firefly/15">
              <ClientFAQ items={FAQ_ITEMS} numbered />
            </div>
          </div>
        </section>

        {/* ──────────────────────────── FINAL CTA ──────────────────────────── */}
        <section
          id="final-cta"
          className="relative py-24 md:py-32 bg-firefly text-white overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-casablanca/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-casablanca/10 blur-3xl pointer-events-none"
          />
          <div className="relative max-w-[900px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="text-center mb-14 md:mb-20">
                <Kicker label="Join us" num="013" tone="center" />
                <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.02] tracking-[-0.02em]">
                  Ready to meet <em className="font-light not-italic text-casablanca">your block?</em>
                </h2>
                <p className="mt-8 text-white/70 max-w-xl mx-auto leading-[1.7] text-lg">
                  Join <span className="text-casablanca font-semibold">500+</span> neighbors already preparing for launch. Spring 2026.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative bg-offwhite text-ink rounded-[3px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] p-8 md:p-14">
                <span aria-hidden="true" className="absolute -top-3 left-8 w-6 h-6 bg-casablanca" />
                <span aria-hidden="true" className="absolute -bottom-3 right-8 w-6 h-6 bg-casablanca/60" />
                <WaitlistForm />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
