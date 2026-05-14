import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EA",
        bone: "#FFFDF7",
        emeraldDeep: "#064E3B",
        gold: "#D6A84F",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-amiri)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(6, 78, 59, 0.16)",
      },
      backgroundImage: {
        "islamic-pattern": "radial-gradient(circle at 1px 1px, rgba(214,168,79,0.22) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
