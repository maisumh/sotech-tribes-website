import ScrollReveal from "@/components/ui/ScrollReveal";
import { HOW_IT_WORKS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[900px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
            {HOW_IT_WORKS.title[0]}
            <br />
            {HOW_IT_WORKS.title[1]}
          </h2>
        </ScrollReveal>

        <div className="space-y-0">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.1}>
              <div
                className={`flex gap-6 py-8 ${
                  i < HOW_IT_WORKS.steps.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-casablanca text-firefly flex items-center justify-center text-xl font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-firefly mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
