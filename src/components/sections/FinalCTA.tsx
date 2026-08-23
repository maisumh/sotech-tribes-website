import ScrollReveal from "@/components/ui/ScrollReveal";
import StoreBadges from "@/components/ui/StoreBadges";
import WaitlistForm from "@/components/ui/WaitlistForm";
import { FINAL_CTA } from "@/lib/constants";

/**
 * The site's conversion section.
 *
 * Download-first: the app is public on both stores and anyone can install it
 * and create an account. Admission to the marketplace is decided *in the app*
 * (the rollout gate), not here — so sending people to a web waitlist instead of
 * the store would add a step and gate something that isn't gated.
 *
 * The waitlist below the badges is the secondary path, for someone who won't
 * install until their area is open. It posts to /api/waitlist → Supabase
 * `v2_join_waitlist` (the source of truth behind /admin/rollout's demand-by-ZIP
 * map) → Tribes' own GoHighLevel. It replaces a GoHighLevel iframe that was
 * served from link.thesocialtech.net — SoTech's CRM, not the client's — whose
 * leads never reached v2_waitlist and so were invisible to the rollout console.
 *
 * ⚠️ Open loop: the lobby copy promises we'll email when an area opens, and the
 * lifecycle sender is still unwritten (Monday 12643400041). The row lands in the
 * right system now, so it can be sent as soon as that exists — but until then
 * nothing goes out.
 */
export default function FinalCTA() {
  return (
    <section id="get-the-app" className="py-16 md:py-24 bg-firefly text-white">
      <div className="max-w-[920px] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-casablanca mb-4">
            {FINAL_CTA.heading}
          </h2>
          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-[34rem] mx-auto">
            {FINAL_CTA.subheading}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <StoreBadges location="final_cta" align="center" />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-base md:text-lg mt-8">
            {FINAL_CTA.prefix}{" "}
            <span className="font-bold text-casablanca">{FINAL_CTA.number}</span>{" "}
            {FINAL_CTA.suffix}
          </p>
        </ScrollReveal>

        {/* Secondary path — area not open yet */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 pt-10 border-t border-white/15 text-left">
            <h3 className="font-heading text-lg font-semibold text-casablanca mb-2 text-center">
              {FINAL_CTA.waitlist.heading}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-8 text-center max-w-[30rem] mx-auto">
              {FINAL_CTA.waitlist.body}
            </p>
            <WaitlistForm variant="light" formName="home_area_alert" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
