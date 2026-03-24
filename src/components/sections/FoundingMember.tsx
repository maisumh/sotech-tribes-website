"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { FOUNDING_MEMBER } from "@/lib/constants";

export default function FoundingMember() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("https://services.leadconnectorhq.com/hooks/TEAVsvTerVipIS3cla4Y/webhook-trigger/tribes-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "tribes-website-waitlist" }),
        mode: "no-cors",
      });
      setSubmitted(true);
      setEmail("");
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:info@trytribes.com?subject=Tribes Waitlist&body=I'd like to join the Tribes waitlist. My email: ${email}`;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="py-16 md:py-24 bg-gradient-to-br from-firefly to-firefly-light text-white"
    >
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white mb-8">
            {FOUNDING_MEMBER.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ul className="space-y-3 mb-10 text-left max-w-sm mx-auto">
            {FOUNDING_MEMBER.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-white/90">
                <span className="text-casablanca font-bold">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            {submitted ? (
              <div className="text-center py-4">
                <p className="text-xl font-heading font-semibold text-casablanca mb-2">
                  You&apos;re on the list!
                </p>
                <p className="text-white/80 text-sm">
                  We&apos;ll be in touch with early access details soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-casablanca"
                />
                <Button type="submit" className="w-full">
                  {submitting ? "Submitting..." : FOUNDING_MEMBER.cta}
                </Button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
