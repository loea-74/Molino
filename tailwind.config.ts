import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracota: {
          DEFAULT: "#B8542E",
          dark: "#8B3E1F",
        },
        maiz: {
          DEFAULT: "#E8B858",
          light: "#F2D58A",
        },
        crema: {
          DEFAULT: "#F5EDE0",
          light: "#FBF6ED",
        },
        grano: {
          DEFAULT: "#2A1D14",
          soft: "#4A3728",
        },
        nopal: "#556B3A",
        linea: "#D9C8A8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": "11px",
        xs: "13px",
        sm: "15px",
        base: "17px",
        lg: "22px",
        xl: "28px",
        "2xl": "40px",
        "3xl": "56px",
        "4xl": "72px",
        "5xl": "108px",
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        full: "999px",
      },
    },
  },
  plugins: [],
};
export default config;
