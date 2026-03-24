import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
            {FEATURES.title}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.items.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <Card>
                <div className="text-4xl mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-firefly mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.text}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
