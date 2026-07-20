import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        studio: {
          void: "#ffffff",
          concrete: "#f5f5f7",
          panel: "#ffffff",
          line: "#d2d2d7",
          ink: "#1d1d1f",
        },
        accent: {
          purple: "#bf5af2",
          cyan: "#2997ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        wordmark: ["var(--font-wordmark)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
