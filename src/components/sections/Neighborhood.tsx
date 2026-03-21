"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { NEIGHBORHOOD } from "@/lib/constants";

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <motion.div
        className="text-3xl md:text-4xl font-bold text-firefly mb-2 tabular-nums"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {value}
      </motion.div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function Neighborhood() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly text-center mb-8">
            {NEIGHBORHOOD.title[0]}
            <br />
            {NEIGHBORHOOD.title[1]}
          </h2>
        </ScrollReveal>

        <div className="max-w-[800px] mx-auto mb-12">
          {NEIGHBORHOOD.paragraphs.map((text, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 text-center">
                {text}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEIGHBORHOOD.stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.15}>
              <AnimatedStat value={stat.value} label={stat.label} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
