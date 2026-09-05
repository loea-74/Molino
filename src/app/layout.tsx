import type { Metadata } from "next";
import { Fraunces, Inter, Bitter, Playfair_Display, Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import { LangProvider } from "@/lib/LangContext";
import site from "@/content/site.json";
import { cssDelTema, type Tema } from "@/lib/tema";
import "./globals.css";

/**
 * Las familias de las parejas de src/lib/tema.ts.
 *
 * Van todas con `preload: false` a propósito: sólo una pareja está activa a la
 * vez y no tiene sentido precargar cinco familias. El navegador baja la que
 * haga falta en cuanto la necesita para pintar texto.
 *
 * OJO con los nombres de las variables: next/font auto-hospeda cada fuente bajo
 * un nombre con hash, así que la única forma de referirse a ellas desde CSS es
 * por estas variables. Pedirlas por su nombre normal — `font-family: 'Fraunces'`
 * — no funciona, que es justo lo que le pasaba a este sitio: bajaba Fraunces e
 * Inter en cada visita y pintaba con Georgia y la fuente del sistema.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--tf-fraunces",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--tf-inter",
  display: "swap",
  preload: false,
});

const bitter = Bitter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--tf-bitter",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--tf-playfair",
  display: "swap",
  preload: false,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--tf-source",
  display: "swap",
  preload: false,
});

/**
 * Gagalin, la del título de la portada.
 *
 * Es un archivo del cliente, no de Google, así que se auto-hospeda desde el
 * repositorio. Va sólo en el título: es el nombre del molino, casi un logotipo,
 * y por eso no entra en el selector de tipografía del panel — ese cambia el
 * resto de la página, no la marca.
 */
const gagalin = localFont({
  src: "../fonts/Gagalin-Regular.otf",
  variable: "--tf-gagalin",
  display: "swap",
  weight: "400",
});

const FUENTES = [fraunces, inter, bitter, playfair, sourceSans, gagalin]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Molino la Jalisciense — Maíz cacahuazintle molido fresco · CDMX desde 1930",
  description:
    "Molino artesanal en la colonia Juárez desde 1930. Maíz cacahuazintle para pozole, harinas frescas, masa del día. Pedidos por WhatsApp.",
  openGraph: {
    title: "Molino la Jalisciense",
    description: "Maíz cacahuazintle molido fresco · CDMX desde 1930",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Los colores y la tipografía que se hayan guardado desde el panel. Van
  // después de tokens.css, así que ganan; lo que no esté elegido se queda con
  // el valor de tokens.css.
  const tema = (site as { theme?: Tema }).theme;

  return (
    <html lang="es" className={FUENTES}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssDelTema(tema) }} />
      </head>
      {/* El fondo y el color van en variables y no en clases de Tailwind:
          `bg-crema-light` compila el color literal #FBF6ED, así que el body era
          lo único de la página que no seguía al tema del panel. */}
      <body
        className="antialiased"
        style={{
          position: "relative",
          background: "var(--crema-light)",
          color: "var(--grano-soft)",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Imagen de fondo translúcida */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/fotos/botes.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "60%",
            opacity: 0.07,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <LangProvider>{children}</LangProvider>
        </div>
      </body>
    </html>
  );
}
