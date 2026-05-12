import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50:  "#f0f5fa",
          100: "#d6e4f0",
          200: "#adc9e1",
          300: "#7aaece",
          400: "#4d93bb",
          500: "#2d75a0",
          600: "#1B3A5C",
          700: "#152e49",
          800: "#0e2133",
          900: "#071420",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
