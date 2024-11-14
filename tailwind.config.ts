import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      colors: {
        wzrd: {
          pink: "#FFE5E5",
          purple: "#F0E5FF",
          blue: "#E5F0FF",
        },
        teleprompter: {
          bg: "#0F172A",
          text: "#F8FAFC",
          dimmed: "#94A3B8",
          control: "#1E293B",
          highlight: "#3B82F6",
          "highlight-strong": "rgba(59, 130, 246, 0.5)",
          "highlight-glow": "rgba(59, 130, 246, 0.1)",
        },
        dark: {
          card: "#1a1625",
          background: "#13111C",
          purple: {
            light: "#2D2B55",
            DEFAULT: "#1E1E3F",
            dark: "#2D2B55"
          }
        }
      },
      keyframes: {
        "theme-switch": {
          "0%": { opacity: "1" },
          "100%": { opacity: "1" }
        },
        "magnetic-float": {
          "0%": { transform: "translate(calc(var(--mouse-x, 0) * 0.08px), calc(var(--mouse-y, 0) * 0.08px))" },
          "100%": { transform: "translate(calc(var(--mouse-x, 0) * 0.08px), calc(var(--mouse-y, 0) * 0.08px))" },
        },
        "card-hover": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "theme-switch": "theme-switch 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "magnetic-float": "magnetic-float 0.2s ease-out forwards",
        "card-hover": "card-hover 0.2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;