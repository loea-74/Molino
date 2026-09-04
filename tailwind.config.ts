import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Apuntan a las variables de tokens.css, no a los colores escritos a
      // mano: layout.tsx vuelve a declarar esas variables con el tema elegido
      // en el panel, y una clase que compile "#B8542E" se queda fuera del
      // cambio. Se pueden usar var() porque ninguna clase de la paleta lleva
      // modificador de opacidad (bg-terracota/50), que es lo único que esto
      // rompería.
      colors: {
        terracota: {
          DEFAULT: "var(--terracota)",
          dark: "var(--terracota-dark)",
        },
        maiz: {
          DEFAULT: "var(--maiz)",
          light: "var(--maiz-light)",
        },
        crema: {
          DEFAULT: "var(--crema)",
          light: "var(--crema-light)",
        },
        grano: {
          DEFAULT: "var(--grano)",
          soft: "var(--grano-soft)",
        },
        nopal: "var(--nopal)",
        linea: "var(--linea)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
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
