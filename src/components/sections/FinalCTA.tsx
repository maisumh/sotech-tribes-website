import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { FINAL_CTA } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-firefly text-white">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <ScrollReveal>
          <p className="text-lg mb-8">
            {FINAL_CTA.prefix}{" "}
            <span className="font-bold text-casablanca">
              {FINAL_CTA.number}
            </span>{" "}
            {FINAL_CTA.suffix}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Button href="#waitlist" size="large">
            Join the Waitlist
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
