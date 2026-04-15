import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ClientFAQ from "@/components/ui/ClientFAQ";
import SupportForm from "@/components/ui/SupportForm";

const CONTACT_EMAIL = "info@trytribes.com";

export const metadata: Metadata = {
  title: "Support | Tribes™",
  description:
    "Need help with Tribes? Get answers to common questions or reach a real human. We respond within 2 business days.",
  robots: { index: true, follow: true },
};

const faqItems = [
  {
    question: "How does Tribes work?",
    answer:
      "You list what you\u2019re Offering (stuff to lend, skills to share) and what you\u2019re Seeking (things you need, help you could use). Tribes matches you with neighbors nearby who are Offering what you\u2019re Seeking and Seeking what you\u2019re Offering. No money changes hands \u2014 it\u2019s a two-way trade.",
  },
  {
    question: "How do I list an item or service?",
    answer:
      "Tap the plus button at the bottom of the home screen, choose whether you\u2019re posting to \u201cWhat You\u2019re Offering\u201d or \u201cWhat You\u2019re Seeking,\u201d pick a category, add a photo and a short description, and post. You can edit or remove a listing any time.",
  },
  {
    question: "How do matches work?",
    answer:
      "Our matching engine looks at what you\u2019re Offering, what you\u2019re Seeking, and which neighbors nearby are Offering and Seeking complementary things. When a two-way match is possible, we surface it in your matches tab and send you a notification. You decide whether to reach out.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. Tribes itself is completely free to use. There are no subscription fees, no listing fees, and no cuts of any trade. Neighbors trade directly with each other; no money changes hands through the app.",
  },
  {
    question: "How do I stay safe meeting a neighbor?",
    answer:
      "Meet in a public, well-lit place (many police stations have designated community exchange spots), bring a friend if you can, tell someone where you\u2019re going, and walk away from anything that feels off. Never share financial information or government IDs. You can report anyone from inside the app.",
  },
  // TODO: Confirm the exact in-app path for "Report" before launch. Current
  // copy says "report option on any listing, profile, or chat message" which
  // is path-agnostic and true regardless of whether the trigger is a flag
  // icon or a 3-dot overflow menu. If the UI settles, tighten the wording.
  {
    question: "What if someone\u2019s listing or behavior is inappropriate?",
    answer:
      "Open the listing, profile, or chat message and use the report option to tell us what happened. Our team reviews every report and can remove content, warn users, suspend accounts, or ban people who break the rules.",
  },
  // TODO: Confirm the exact delete-account path in the FlutterFlow build —
  // most likely More \u2192 Settings \u2192 Account \u2192 Delete account.
  // Update this answer once the final navigation is locked.
  {
    question: "How do I delete my account?",
    answer:
      "Inside the app, open your account settings and choose \u201cDelete account.\u201d This removes your profile, listings, and ratings. We keep a limited copy of your data for up to 90 days for fraud prevention and legal compliance, then it\u2019s permanently deleted.",
  },
  {
    question: "Why does Tribes need my ZIP code?",
    answer:
      "Tribes is hyperlocal \u2014 matches only work if we can figure out who\u2019s actually nearby. Your ZIP code lets us match you with neighbors in your area. We do not collect GPS or precise device location.",
  },
  {
    question: "Can I use Tribes without sharing my phone number?",
    answer:
      "Yes. Phone number is optional. You can chat with matched neighbors entirely inside the app without giving out your phone number or any other personal contact information.",
  },
  {
    question: "I found a bug. Where do I report it?",
    answer: `Use the contact form below, or email ${CONTACT_EMAIL} with "Bug" in the subject line and the details (what you were doing, what happened, device and app version if you know them). We appreciate it.`,
  },
];

function EnvelopeMark() {
  return (
    <svg
      viewBox="0 0 72 72"
      className="w-16 h-16 md:w-20 md:h-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <rect x="6" y="16" width="60" height="40" rx="2" />
      <path d="M6 20 L36 42 L66 20" />
      <circle cx="58" cy="52" r="6" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

export default function SupportPage() {
  return (
    <>
      <Header />
      <main id="main" className="bg-offwhite">
        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section className="relative pt-[calc(70px+3rem)] pb-16 md:pt-[calc(70px+5rem)] md:pb-24 overflow-hidden">
          {/* Decorative casablanca rule under header */}
          <div
            aria-hidden="true"
            className="absolute top-[70px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-casablanca/30 to-transparent"
          />
          {/* Ambient color wash bottom-right */}
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-casablanca/5 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end">
              {/* Left: editorial headline */}
              <div className="text-center lg:text-left">
                <div
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 mb-8 animate-hero-fade-up"
                  style={{ animationDelay: "0.05s" }}
                >
                  <span className="block h-px w-10 bg-casablanca shrink-0" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-casablanca whitespace-nowrap">
                    Support
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-firefly/30 whitespace-nowrap">
                    001
                  </span>
                </div>

                <h1
                  className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-extralight text-firefly leading-[0.98] tracking-[-0.02em] animate-hero-fade-up"
                  style={{ animationDelay: "0.15s" }}
                >
                  How can <br className="hidden sm:inline" />
                  we <em className="font-light not-italic text-casablanca">help</em>?
                </h1>

                <p
                  className="mt-8 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-600 leading-[1.6] animate-hero-fade-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  A simple question, a safety concern, or a bug — whatever it is, a real person on our team will read it and get back to you.
                </p>
              </div>

              {/* Right: response-time card */}
              <div
                className="relative self-end animate-hero-fade-up mx-auto lg:mx-0"
                style={{ animationDelay: "0.45s" }}
              >
                <div className="relative bg-firefly text-white px-8 md:px-10 py-10 md:py-12 shadow-[0_30px_60px_-20px_rgba(16,55,48,0.4)] w-[260px] md:w-[280px] rounded-[2px]">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-casablanca mb-5">
                    Response window
                  </div>
                  <div className="flex items-end gap-2 leading-none">
                    <span className="font-heading text-[5.5rem] md:text-[6.5rem] font-extralight tracking-[-0.04em]">
                      2
                    </span>
                    <span className="pb-3 md:pb-4 text-sm tracking-wide text-white/70">
                      days
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-white/60 tracking-wide">
                    business days, max
                  </div>
                  {/* Decorative casablanca mark */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 w-6 h-6 bg-casablanca"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────── CONTACT ──────────────────────────── */}
        <section className="relative border-y border-firefly/10 bg-gradient-to-b from-offwhite via-white to-offwhite">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 py-14 md:py-20">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-8 md:gap-12">
                <div className="text-firefly/80">
                  <EnvelopeMark />
                </div>
                <div>
                  <div className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-firefly/50 mb-3">
                    — Write to us directly
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group inline-flex items-baseline flex-wrap gap-x-3 font-heading text-2xl sm:text-3xl md:text-5xl font-extralight text-firefly transition-colors hover:text-casablanca"
                  >
                    <span className="relative">
                      {CONTACT_EMAIL}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-2 left-0 right-0 h-px bg-casablanca/40 group-hover:bg-casablanca transition-colors"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-casablanca text-2xl md:text-3xl transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-firefly/40 mb-2">
                    Signed by
                  </div>
                  <div className="font-heading text-sm text-firefly/70 italic">
                    The Tribes team
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ────────────────────────────── FAQ ────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[920px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-end gap-6 md:gap-12 mb-14 md:mb-20 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 mb-6">
                    <span className="block h-px w-10 bg-casablanca shrink-0" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-casablanca whitespace-nowrap">
                      Quick answers
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-firefly/30 whitespace-nowrap">
                      002
                    </span>
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extralight text-firefly leading-[1.02] tracking-[-0.02em]">
                    Most asked,<br />
                    <em className="font-light not-italic text-firefly/70">plainly answered.</em>
                  </h2>
                </div>
                <p className="text-gray-600 leading-[1.7] max-w-sm md:text-right md:self-end md:pb-2 mx-auto md:mx-0">
                  Ten questions we get most often. If yours isn&rsquo;t here, scroll on — we&rsquo;ll read whatever you write.
                </p>
              </div>
            </ScrollReveal>

            <div className="border-t border-firefly/15">
              <ClientFAQ items={faqItems} numbered />
            </div>
          </div>
        </section>

        {/* ───────────────────────────── FORM ───────────────────────────── */}
        <section className="relative py-20 md:py-28 bg-firefly text-white overflow-hidden">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-casablanca/40 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-casablanca/5 blur-3xl pointer-events-none"
          />

          <div className="relative max-w-[920px] mx-auto px-6 md:px-10 lg:px-12">
            <ScrollReveal>
              <div className="text-center mb-14 md:mb-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="block h-px w-10 bg-casablanca" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-casablanca">
                    Write to us
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/30">
                    003
                  </span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.02] tracking-[-0.02em]">
                  Still stuck? <em className="font-light not-italic text-casablanca">Send a note.</em>
                </h2>
                <p className="mt-6 text-white/70 max-w-xl mx-auto leading-[1.7]">
                  Tell us what&rsquo;s going on. We&rsquo;ll reply to the email you provide within two business days.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              {/* Form on white card */}
              <div className="relative bg-offwhite text-ink rounded-[3px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] p-8 md:p-14">
                {/* Corner marks */}
                <span aria-hidden="true" className="absolute -top-3 left-8 w-6 h-6 bg-casablanca" />
                <span aria-hidden="true" className="absolute -bottom-3 right-8 w-6 h-6 bg-casablanca/60" />
                <SupportForm />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ──────────────────────────── FOOTER LINKS ──────────────────────────── */}
        <section className="py-14 md:py-16">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-firefly/40 mb-2">
                  — Also
                </div>
                <p className="text-firefly/70">
                  Looking for legal or policy details? We keep it short and plain.
                </p>
              </div>
              <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm" aria-label="Legal">
                <Link
                  href="/privacy"
                  className="group inline-flex items-center gap-2 text-firefly hover:text-casablanca transition-colors uppercase tracking-[0.2em] font-semibold"
                >
                  Privacy
                  <span className="text-firefly/30 group-hover:text-casablanca group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </Link>
                <Link
                  href="/terms"
                  className="group inline-flex items-center gap-2 text-firefly hover:text-casablanca transition-colors uppercase tracking-[0.2em] font-semibold"
                >
                  Terms
                  <span className="text-firefly/30 group-hover:text-casablanca group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </Link>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-firefly hover:text-casablanca transition-colors uppercase tracking-[0.2em] font-semibold"
                >
                  Home
                  <span className="text-firefly/30 group-hover:text-casablanca group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </Link>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
