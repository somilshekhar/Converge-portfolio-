import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        foreground: "var(--fg-color)",
        muted: "var(--muted-color)",
        accent: {
          DEFAULT: "var(--accent-color)",
          hover: "var(--accent-hover)",
        },
        card: {
          DEFAULT: "#121216",
          hover: "#18181f",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["var(--font-clash)", "Clash Display", "sans-serif"],
        heading: ["var(--font-clash)", "Clash Display", "sans-serif"],
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
        subheading: ["var(--font-manrope)", "Manrope", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        orbit: {
          "0%": {
            transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
      },
      clipPath: {
        reveal: "inset(100% 0 0 0)",
        full: "inset(0 0 0 0)",
      },
    },
  },
  plugins: [],
};

export default config;
