import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { AUDIENCES } from "@/lib/constants";

export default function Audiences() {
  return (
    <section id="audiences" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-12">
            {AUDIENCES.title}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AUDIENCES.items.map((audience, i) => (
            <ScrollReveal key={audience.id} delay={i * 0.15}>
              <div
                id={audience.id}
                className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-4xl mb-4">{audience.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-firefly mb-2">
                  {audience.title}
                </h3>
                <p className="text-gray-600 mb-6">{audience.subtitle}</p>
                <ul className="space-y-2 mb-8 text-left">
                  {audience.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-casablanca font-bold mt-0.5">
                        ✓
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button href="#waitlist" variant="secondary" className="w-full">
                  {audience.cta}
                </Button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
