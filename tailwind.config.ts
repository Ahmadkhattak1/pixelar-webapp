import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Zinc 950 - Deep Matte Black
        surface: "#18181b", // Zinc 900 - Panel Background
        "surface-highlight": "#27272a", // Zinc 800 - Hover/Active
        border: "#27272a", // Zinc 800
        primary: {
          DEFAULT: "#8b5cf6", // Violet 500 - Sharp Accent
          hover: "#7c3aed", // Violet 600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#10b981", // Emerald 500 - Success/Secondary
          foreground: "#ffffff",
        },
        text: {
          DEFAULT: "#fafafa", // Zinc 50
          muted: "#a1a1aa", // Zinc 400
          dim: "#52525b", // Zinc 600
        },
        accent: {
          pink: "#ec4899",
          cyan: "#06b6d4",
          orange: "#f97316",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"], // Technical font
      },
      backgroundImage: {
        "studio-gradient": "linear-gradient(to bottom right, #18181b, #09090b)",
      },
      boxShadow: {
        "studio": "0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.15)",
        "studio-hover": "0 0 0 1px rgba(255,255,255,0.1), 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.2)",
        "glow": "0 0 20px -5px var(--tw-shadow-color)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
