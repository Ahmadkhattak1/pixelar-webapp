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
        background: "#0a0a0a", // True dark grey (neutral)
        surface: "#141414", // Surface (neutral dark grey)
        "surface-highlight": "#1f1f1f", // Surface Highlight (neutral grey)
        border: "#262626", // Neutral border
        primary: {
          DEFAULT: "#9FDE5A", // Logo lime green - main brand color
          50: "#f4fce8",
          100: "#e7f8cd",
          200: "#d0f2a0",
          300: "#b4e86b",
          400: "#9FDE5A", // Base
          500: "#7bc234",
          600: "#5f9a26",
          700: "#497521",
          800: "#3c5d20",
          900: "#344f1f",
          foreground: "#0a0a0a", // Dark text for contrast on lime
        },
        secondary: {
          DEFAULT: "#71717a", // Neutral zinc
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a", // Base
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
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
          DEFAULT: "#fafafa", // Bright white
          muted: "#a1a1aa", // Neutral grey (zinc-400)
          dim: "#71717a", // Dimmer neutral grey (zinc-500)
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"], // Technical font
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
