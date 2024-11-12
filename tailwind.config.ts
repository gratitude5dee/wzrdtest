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
      },
      keyframes: {
        "magnetic-float": {
          "0%, 100%": { transform: "translate(calc(var(--mouse-x, 0) * 0.08px), calc(var(--mouse-y, 0) * 0.08px)) scale(1)" },
          "50%": { transform: "translate(calc(var(--mouse-x, 0) * 0.12px), calc(var(--mouse-y, 0) * 0.12px)) scale(1.01)" },
        },
        "card-hover": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.01)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            opacity: "1",
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.2)"
          },
          "50%": { 
            opacity: "0.9",
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.4)"
          },
        },
      },
      animation: {
        "magnetic-float": "magnetic-float 3s ease-in-out infinite",
        "card-hover": "card-hover 2.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;