"use client";

import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { IconWhatsApp, IconMap } from "./icons";
import siteContent from "@/content/site.json";

// El logo sale de site.json para poder cambiarlo desde el panel. La ruta de
// reserva evita que la portada quede sin sello si la llave falta.
const LOGO = (siteContent as { logo?: string }).logo || "/fotos/logo-grande.png";

function MiniMd({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**"))
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          if (part.startsWith("*") && part.endsWith("*"))
            return <em key={j}>{part.slice(1, -1)}</em>;
          return part;
        });
        return <div key={i}>{parts}</div>;
      })}
    </>
  );
}

export default function Hero() {
  const { lang } = useLang();
  const h = siteContent.hero;
  const WHATSAPP = `https://wa.me/${h.whatsapp}?text=Hola%2C%20me%20interesa%20hacer%20un%20pedido`;
  const MAPS = "https://maps.google.com/?q=Abraham+Gonz%C3%A1lez+143+Ju%C3%A1rez+CDMX";

  const stats = [
    { n: h.stat1.number, l: h.stat1.label[lang] },
    { n: h.stat2.number, l: h.stat2.label[lang] },
    { n: h.stat3.number, l: h.stat3.label[lang] },
  ];

  return (
    <section
      id="inicio"
      style={{ padding: "56px 48px 80px", position: "relative", maxWidth: 1280, margin: "0 auto" }}
      className="max-sm:!px-5 max-sm:!py-8"
    >
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{ width: 28, height: 1, background: "var(--terracota)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--terracota)" }}>
          {h.pill[lang]}
        </span>
      </div>

      {/* El título, en su propia banda a todo lo ancho.
          Antes iba dentro de la columna de la izquierda, apretado contra la
          foto: a 108 px necesita el ancho entero para respirar. */}
      <h1
        className="hero-titulo"
        style={{
          // La familia y el tamaño van en la clase, no aquí: un estilo en línea
          // gana sobre la hoja de estilos y dejaba a Gagalin sin efecto.
          lineHeight: 1,
          fontWeight: 300,
          margin: "0 0 8px",
          letterSpacing: "-0.035em",
          color: "var(--titulo-portada)",
        }}
      >
        {/* Se descartan los renglones vacíos: al editar el título desde el
            panel es fácil dejar líneas de más, y cada una se dibujaba como un
            hueco con la altura de la letra — a 104 px, dos huecos enormes
            colgando bajo el nombre. */}
        {h.title[lang].filter((line: string) => line.trim()).map((line: string, i: number) => (
          <div
            key={i}
            style={{
              fontStyle: i === 1 ? "italic" : "normal",
              fontWeight: i === 1 ? 400 : 300,
              color: i === 1 ? "var(--terracota)" : "var(--titulo-portada)",
            }}
          >
            {line}
          </div>
        ))}
      </h1>

      {/* Two-column grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "center", marginTop: 44 }}
        className="max-md:!grid-cols-1 max-md:!gap-8 max-sm:!mt-7"
      >
        {/* Left: copy */}
        <div>
          {/* El logo, al lado de la foto del local.
              Hueco de tamaño fijo con objectFit "contain": así el acomodo no
              se mueve si se cambia el archivo, tenga el margen que tenga. */}
          <div
            style={{ width: 300, height: 300, margin: "0 auto 40px" }}
            className="max-sm:!w-[200px] max-sm:!h-[200px] max-sm:!mt-6"
          >
            <Image
              src={LOGO}
              alt="Molino la Gran Jalisciense"
              width={630}
              height={630}
              priority
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--grano-soft)", maxWidth: 560, margin: 0 }} className="max-sm:!text-base">
            {h.body[lang]}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }} className="max-sm:!mt-6">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "var(--terracota)", color: "var(--crema-light)",
                padding: "16px 26px", borderRadius: 999,
                fontSize: 15, fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
              }}
              className="max-sm:!text-sm max-sm:!px-5 max-sm:!py-3.5"
            >
              <IconWhatsApp size={18} color="var(--crema-light)" />
              {lang === "es" ? "Pedir por WhatsApp" : "Order on WhatsApp"}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, opacity: 0.7, marginLeft: 4 }}>
                {h.phone}
              </span>
            </a>

            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent", color: "var(--grano)",
                padding: "16px 22px", borderRadius: 999,
                fontSize: 15, fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid var(--grano)",
              }}
              className="max-sm:!text-sm max-sm:!px-4 max-sm:!py-3.5"
            >
              <IconMap size={16} />
              {lang === "es" ? "Cómo llegar" : "Get directions"}
            </a>
          </div>
        </div>

        {/* Right: image + floating schedule card */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "4/5", borderRadius: 14, overflow: "hidden", position: "relative" }}>
            <Image
              src={h.image}
              alt="Fachada del Molino la Jalisciense"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Floating notice card */}
          <div
            style={{
              position: "absolute", bottom: -28, left: -32,
              background: "var(--crema-light)", border: "1px solid var(--linea)",
              padding: "22px 28px", borderRadius: 16,
              boxShadow: "0 16px 48px -12px rgba(42, 29, 20, 0.28)",
              minWidth: 230, maxWidth: 280,
            }}
            className="max-sm:!-bottom-4 max-sm:!left-3 max-sm:!px-4 max-sm:!py-4"
          >
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--terracota)", textTransform: "uppercase", marginBottom: 10 }}>
              {h.heroNotice.title[lang]}
            </div>
            <div style={{ fontSize: 14, color: "var(--grano)", lineHeight: 1.55, whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)" }}>
              <MiniMd text={h.heroNotice.body[lang]} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          marginTop: 80, paddingTop: 28,
          borderTop: "1px solid var(--linea)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr) auto",
          gap: 32, alignItems: "center",
        }}
        className="max-md:!grid-cols-3 max-md:!mt-14 max-md:gap-3"
      >
        {stats.map(({ n, l }) => (
          <div key={l}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 400, color: "var(--grano)", lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grano-soft)", marginTop: 6 }}>{l}</div>
          </div>
        ))}
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--grano-soft)", textAlign: "right", letterSpacing: "0.1em", textTransform: "uppercase" }} className="max-md:hidden">
          {h.address[lang]}
        </div>
      </div>
    </section>
  );
}
