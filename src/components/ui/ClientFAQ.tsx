"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

interface ClientFAQProps {
  items: FAQItem[];
  numbered?: boolean;
}

export default function ClientFAQ({ items, numbered = false }: ClientFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={numbered ? "divide-y divide-firefly/15" : "divide-y divide-gray-200"}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const num = String(i + 1).padStart(2, "0");
        return (
          <ScrollReveal key={item.question} delay={i * 0.05}>
            <div className={numbered ? "group" : ""}>
              <button
                className={
                  numbered
                    ? "w-full grid grid-cols-[auto_1fr_auto] items-baseline gap-6 md:gap-10 py-7 md:py-8 text-left min-h-[56px] cursor-pointer transition-colors"
                    : "w-full flex items-center justify-between py-5 text-left min-h-[48px] cursor-pointer"
                }
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                {numbered && (
                  <span
                    className={`font-heading font-extralight text-2xl md:text-3xl tabular-nums tracking-tight transition-colors ${
                      isOpen ? "text-casablanca" : "text-firefly/30 group-hover:text-casablanca/70"
                    }`}
                    aria-hidden="true"
                  >
                    {num}
                  </span>
                )}
                <span
                  className={
                    numbered
                      ? `font-heading text-lg md:text-xl font-medium pr-2 leading-snug transition-colors ${
                          isOpen ? "text-firefly" : "text-firefly/90 group-hover:text-firefly"
                        }`
                      : "font-heading text-lg font-semibold text-firefly pr-6"
                  }
                >
                  {item.question}
                </span>
                <motion.span
                  className={
                    numbered
                      ? `text-2xl shrink-0 font-light transition-colors ${
                          isOpen ? "text-casablanca" : "text-firefly/40 group-hover:text-casablanca"
                        }`
                      : "text-casablanca text-2xl shrink-0"
                  }
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    {numbered ? (
                      <div className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 pb-8">
                        <span className="w-[2ch]" aria-hidden="true" />
                        <p className="text-gray-600 leading-[1.75] text-base md:text-[1.0625rem] max-w-[62ch]">
                          {item.answer}
                        </p>
                        <span className="w-6 shrink-0" aria-hidden="true" />
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed pb-5">
                        {item.answer}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
