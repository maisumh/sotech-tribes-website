"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { NEIGHBORHOOD } from "@/lib/constants";
import { useCountUp } from "@/hooks/useCountUp";

function AnimatedStat({
  value,
  target,
  prefix,
  suffix,
  formatWithCommas,
  label,
}: {
  value: string;
  target: number | null;
  prefix: string;
  suffix: string;
  formatWithCommas: boolean;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const animatedValue = useCountUp(
    target ?? 0,
    isInView && target !== null,
    2000,
    formatWithCommas
  );

  const displayValue = target === null ? value : `${prefix}${animatedValue}${suffix}`;

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full"
    >
      <div className="text-3xl md:text-4xl font-bold text-firefly mb-2 tabular-nums">
        {displayValue}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function Neighborhood() {
  return (
    <section className="py-16 md:py-24 bg-granny">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-white text-center mb-8">
            {NEIGHBORHOOD.title[0]}
            <br />
            {NEIGHBORHOOD.title[1]}
          </h2>
        </ScrollReveal>

        <div className="max-w-[800px] mx-auto mb-12">
          {NEIGHBORHOOD.paragraphs.map((text, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4 text-center">
                {text}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEIGHBORHOOD.stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.15} className="h-full">
              <AnimatedStat
                value={stat.value}
                target={stat.target}
                prefix={stat.prefix}
                suffix={stat.suffix}
                formatWithCommas={stat.formatWithCommas}
                label={stat.label}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
