import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { LangProvider } from "@/lib/LangContext";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Molino la Jalisciense — Maíz cacahuazintle molido fresco · CDMX desde 1962",
  description:
    "Molino artesanal en la colonia Juárez desde 1962. Maíz cacahuazintle para pozole, harinas frescas, masa del día. Pedidos por WhatsApp.",
  openGraph: {
    title: "Molino la Jalisciense",
    description: "Maíz cacahuazintle molido fresco · CDMX desde 1962",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased font-body bg-crema-light text-grano-soft">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
