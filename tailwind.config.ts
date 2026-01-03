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
        background: "#020617", // Deeper background (slate-950)
        surface: "#0f172a", // Surface (slate-900)
        "surface-highlight": "#1e293b", // Surface Highlight (slate-800)
        border: "#1e293b", // Deep border
        primary: {
          DEFAULT: "#10b981", // Emerald 500 - more sophisticated green
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#61707D", // Muted Blue-Gray
          50: "#f5f6f8",
          100: "#e8ecf1",
          200: "#cbd4e0",
          300: "#a1aec2",
          400: "#7a89a0",
          500: "#61707D", // Base
          600: "#505d6d",
          700: "#3d4a5a",
          800: "#2b3647",
          900: "#1a2332",
          foreground: "#ffffff",
        },
        accent: {
          coral: "#FF7A7A", // Softer coral
          orange: "#FFB84D", // Warm orange
          cyan: "#4DD9FF", // Softer cyan
          pink: "#FF66CC", // Vibrant pink
          yellow: "#FFE066", // Mellow yellow
        },
        text: {
          DEFAULT: "#f0f4f8", // Soft white
          muted: "#8a9aaa", // Mid gray
          dim: "#5a6a7a", // Dimmer gray
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"], // Technical font
      },
      backgroundImage: {
        "studio-gradient": "linear-gradient(to bottom right, #18181b, #09090b)",
      },
      boxShadow: {
        "studio": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "studio-hover": "0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
