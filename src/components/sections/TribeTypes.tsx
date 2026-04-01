import ScrollReveal from "@/components/ui/ScrollReveal";
import { TRIBE_TYPES } from "@/lib/constants";

export default function TribeTypes() {
  return (
    <section className="py-16 md:py-24 bg-granny">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white text-center mb-12">
            {TRIBE_TYPES.title}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRIBE_TYPES.items.map((type, i) => (
            <ScrollReveal key={type.title} delay={i * 0.1} className="h-full">
              <div className="bg-white border-2 border-firefly rounded-xl p-8 text-center transition-all duration-300 hover:bg-firefly hover:-translate-y-1 hover:shadow-lg hover:shadow-firefly/25 group h-full">
                <div className="text-4xl mb-4 flex justify-center group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-firefly mb-2 group-hover:text-white transition-colors">
                  {type.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {type.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
