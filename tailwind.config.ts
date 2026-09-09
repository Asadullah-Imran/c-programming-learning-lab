import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#070B12",
        surface: {
          DEFAULT: "#0F172A",
          muted: "#131C31",
          elevated: "#1E293B",
          border: "#1E2942",
        },
        primary: {
          DEFAULT: "#38BDF8", // Vibrant Sky / Cyan
          hover: "#0EA5E9",
          muted: "rgba(56, 189, 248, 0.15)",
        },
        accent: {
          purple: "#A855F7",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        // Semantic C Types
        ctype: {
          int: "#38BDF8",     // Cyan
          char: "#F59E0B",    // Amber
          float: "#34D399",   // Emerald
          double: "#C084FC",  // Purple
          pointer: "#FB7185", // Rose
        },
        // Memory & Runtime States
        runtime: {
          created: "#38BDF8",
          updated: "#FACC15",
          evaluating: "#818CF8",
          trueBranch: "#10B981",
          falseBranch: "#F43F5E",
          activeLine: "#1E3A8A",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(56, 189, 248, 0.3)",
        "glow-purple": "0 0 20px -5px rgba(168, 85, 247, 0.3)",
        "glow-emerald": "0 0 20px -5px rgba(16, 185, 129, 0.3)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "value-flash": "valueFlash 0.6s ease-in-out",
      },
      keyframes: {
        valueFlash: {
          "0%": { transform: "scale(0.95)", opacity: "0.5", backgroundColor: "rgba(250, 204, 21, 0.3)" },
          "50%": { transform: "scale(1.05)", opacity: "1", backgroundColor: "rgba(250, 204, 21, 0.4)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
