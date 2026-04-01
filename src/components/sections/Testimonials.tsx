import ScrollReveal from "@/components/ui/ScrollReveal";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
            Trusted by Local Leaders Building Tribes
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <ScrollReveal key={testimonial.name} delay={i * 0.15} className="h-full">
              <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-casablanca h-full flex flex-col">
                <p className="text-gray-700 text-lg italic leading-relaxed mb-6 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-firefly">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
