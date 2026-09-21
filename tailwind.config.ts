import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0F2C",
        "midnight-900": "#06091F",
        "midnight-800": "#0A0F2C",
        "midnight-700": "#11193D",
        "midnight-600": "#1A2350",
        gold: "#D4AF37",
        "gold-dark": "#B8941F",
        "gold-light": "#E6C65A",
        ivory: "#F8F4EC",
        sand: "#E8DFCE",
        stone: "#8B8680",
        charcoal: "#2A2A2A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: ".35em",
      },
      boxShadow: {
        luxe: "0 30px 60px -30px rgba(10,15,44,0.35)",
        soft: "0 10px 30px -12px rgba(10,15,44,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "fade-up": "fadeUp 0.8s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
