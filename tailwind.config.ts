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
        brand: {
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)",
          bg: "var(--color-bg-main)",
          surface: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
          text: "var(--color-text-main)",
          "text-muted": "var(--color-text-muted)",
        },
      },
      borderRadius: {
        card: "1rem",
        btn: "0.75rem",
      },
    },
  },
  plugins: [],
};
export default config;