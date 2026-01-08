import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#FF6B35",
          orange: "#FF6B35",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          green: "#10B981",
        },
        text: {
          DEFAULT: "#ffffff",
          secondary: "#a0a0a0",
          muted: "#666666",
        },
      },
      fontFamily: {
        heading: ["Gill Sans", "Gill Sans MT", "Calibri", "Trebuchet MS", "sans-serif"],
        body: ["Gill Sans", "Gill Sans MT", "Calibri", "Trebuchet MS", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(135deg, #FF6B35 0%, #8B5CF6 50%, #06B6D4 100%)",
        "gradient-glow": "radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-orange": "0 0 20px rgba(255, 107, 53, 0.4)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.4)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.4)",
        "glow-accent": "0 0 30px rgba(255, 107, 53, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
