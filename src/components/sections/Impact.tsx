import ScrollReveal from "@/components/ui/ScrollReveal";
import { IMPACT } from "@/lib/constants";

export default function Impact() {
  return (
    <section className="py-16 md:py-24 bg-firefly text-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-casablanca text-center mb-8">
            {IMPACT.title}
          </h2>
        </ScrollReveal>

        <div className="max-w-[800px] mx-auto mb-12">
          {IMPACT.paragraphs.map((text, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4 text-center">
                {text}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IMPACT.metrics.map((metric, i) => (
            <ScrollReveal key={metric.label} delay={i * 0.15}>
              <div className="bg-white/10 rounded-xl p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-casablanca mb-2 tabular-nums">
                  {metric.value}
                </div>
                <p className="text-white/80 text-sm">{metric.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
