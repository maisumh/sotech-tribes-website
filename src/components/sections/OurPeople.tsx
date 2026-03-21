import ScrollReveal from "@/components/ui/ScrollReveal";
import { OUR_PEOPLE } from "@/lib/constants";

export default function OurPeople() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[800px] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly mb-8">
            {OUR_PEOPLE.title}
          </h2>
        </ScrollReveal>
        {OUR_PEOPLE.paragraphs.map((text, i) => (
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
