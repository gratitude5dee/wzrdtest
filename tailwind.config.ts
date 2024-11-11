import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFBF7",
          100: "#FAF7F2",
          200: "#F5EDE3",
          300: "#EFE3D4",
          400: "#E8D5C0",
          500: "#E2C7AD",
          600: "#D4B194",
        },
        teleprompter: {
          bg: "#FAF7F2",
          text: "#2D2A28",
          dimmed: "#6B6661",
          control: "#EFE3D4",
          highlight: "#D4B194",
          "highlight-strong": "rgba(212, 177, 148, 0.5)",
          "highlight-glow": "rgba(212, 177, 148, 0.1)",
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "gradient-shift": "gradient-shift 3s ease infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;