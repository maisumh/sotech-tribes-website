import {
  Wrench,
  Heart,
  Repeat,
  Leaf,
  Home,
  Palette,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Card from "@/components/ui/Card";
import { TRIBE_TYPES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Heart,
  Repeat,
  Leaf,
  Home,
  Palette,
};

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
          {TRIBE_TYPES.items.map((type, i) => {
            const Icon = iconMap[type.icon];
            return (
              <ScrollReveal key={type.title} delay={i * 0.1}>
                <div className="bg-white border-2 border-firefly rounded-xl p-8 text-center transition-all duration-300 hover:bg-firefly hover:-translate-y-1 hover:shadow-lg hover:shadow-firefly/25 group">
                  <div className="text-casablanca mb-4 flex justify-center group-hover:text-white transition-colors">
                    <Icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-firefly mb-2 group-hover:text-white transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                    {type.text}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
