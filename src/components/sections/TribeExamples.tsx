import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { TRIBE_EXAMPLES } from "@/lib/constants";

export default function TribeExamples() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRIBE_EXAMPLES.map((tribe, i) => (
            <ScrollReveal key={tribe.title} delay={i * 0.15}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={tribe.image}
                    alt={tribe.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-firefly text-lg">
                    {tribe.title}
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
