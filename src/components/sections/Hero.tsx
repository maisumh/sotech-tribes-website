"use client";

import { motion } from "framer-motion";
import { HERO } from "@/lib/constants";
import Button from "@/components/ui/Button";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="pt-[calc(70px+2rem)] pb-12 md:pt-[calc(70px+4rem)] md:pb-20 bg-gradient-to-br from-gray-50 to-offwhite">
      <motion.div
        className="max-w-[800px] mx-auto px-4 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-heading text-3xl md:text-5xl font-bold text-firefly leading-tight mb-6"
          variants={fadeUp}
        >
          {HERO.headline.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
          variants={fadeUp}
        >
          {HERO.subheadline}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          variants={fadeUp}
        >
          <Button href="#waitlist" size="large">
            {HERO.cta}
          </Button>
          <Button href="#how-it-works" variant="secondary" size="large">
            Learn More
          </Button>
        </motion.div>

        <motion.p className="text-sm text-gray-500" variants={fadeUp}>
          {HERO.trust.prefix}{" "}
          <span className="font-bold text-firefly">{HERO.trust.number}</span>{" "}
          {HERO.trust.suffix}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
          variants={fadeUp}
        >
          {[
            { icon: "🏘️", label: "For Neighbors" },
            { icon: "🤝", label: "For Organizations" },
            { icon: "👥", label: "For Community Leaders" },
          ].map((item) => (
            <a
              key={item.label}
              href="#audiences"
              className="flex items-center justify-center gap-2 p-4 bg-white border-2 border-gray-200 rounded-lg transition-all hover:border-casablanca hover:-translate-y-0.5"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-firefly">{item.label}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
