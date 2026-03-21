import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        firefly: {
          DEFAULT: "#103730",
          light: "#1a4d44",
        },
        granny: "#879B97",
        casablanca: {
          DEFAULT: "#F6B74A",
          dark: "#e5a63a",
        },
        offwhite: "#FEFEFE",
        ink: "#0D0D0D",
      },
      fontFamily: {
        heading: [
          "'General Sans'",
          "'Plus Jakarta Sans'",
          "system-ui",
          "sans-serif",
        ],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
