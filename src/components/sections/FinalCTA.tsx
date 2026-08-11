import ScrollReveal from "@/components/ui/ScrollReveal";
import GHLForm from "@/components/ui/GHLForm";
import { FINAL_CTA } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-16 md:py-24 bg-firefly text-white">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <ScrollReveal>
          <GHLForm />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg mt-8">
            <span className="font-bold text-casablanca">
              {FINAL_CTA.emphasis}
            </span>{" "}
            {FINAL_CTA.suffix}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
