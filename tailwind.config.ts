import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0f",
        surface: "#141420",
        "surface-2": "#181826",
        "surface-3": "#1f1f2e",
        gold: "#c9a96e",
        "gold-2": "#d9bd86",
        cream: "#e8d5b0",
        "text-primary": "#ece7df",
        "text-2": "#a39e95",
        "text-3": "#6f6b64",
        "text-faint": "#4d4a45",
        video: "#8b6cdb",
        linkedin: "#2d8fe0",
        x: "#e7e7e7",
        substack: "#e8772a",
        youtube: "#e0504a",
        ready: "#58c98d",
        generating: "#e6ad4e",
        draft: "#7c97b4",
        published: "#46c4ac",
        danger: "#c47272",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
}

export default config
