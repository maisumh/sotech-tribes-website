import ScrollReveal from "@/components/ui/ScrollReveal";
import { VALUE_PROP } from "@/lib/constants";

export default function ValueProp() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly mb-8">
            {VALUE_PROP.title[0]}
            <br />
            <span className="text-casablanca">On Tribes</span>
            {VALUE_PROP.title[1].replace("On Tribes", "")}
          </h2>
        </ScrollReveal>
        {VALUE_PROP.paragraphs.map((text, i) => (
          <ScrollReveal key={i} delay={0.1 * (i + 1)}>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
              {text}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
