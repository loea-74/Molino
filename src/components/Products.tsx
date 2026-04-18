"use client";

import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { IconArrow } from "./icons";
import products from "@/content/products.json";

const PHONE = "525543612880";

function waUrl(msg: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

export default function Products() {
  const { lang } = useLang();
  const t = L[lang];

  return (
    <section
      id="productos"
      style={{ background: "var(--crema-light)", padding: "96px 48px", borderTop: "1px solid var(--linea)" }}
      className="max-sm:!px-5 max-sm:!py-14"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 48, alignItems: "end" }}
          className="max-md:!grid-cols-1 max-md:!gap-4 max-md:!mb-8"
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 14 }}>
              {t.productsEyebrow}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 0.98, fontWeight: 400, margin: 0, letterSpacing: "-0.025em", color: "var(--grano)" }}>
              {t.productsTitle}
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--grano-soft)", margin: 0, maxWidth: 480 }}>
            {t.productsBody}
          </p>
        </div>

        {/* Cards — horizontal 2-col */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}
          className="max-md:!grid-cols-1 max-md:!gap-4"
        >
          {products.map((p) => (
            <article
              key={p.slug}
              style={{
                background: "var(--crema)", border: "1px solid var(--linea)",
                borderRadius: 14, overflow: "hidden",
                display: "grid", gridTemplateColumns: "180px 1fr",
              }}
              className="max-sm:!grid-cols-1"
            >
              <div
                style={{ minHeight: 160, background: "var(--linea)", display: "flex", alignItems: "center", justifyContent: "center" }}
                className="max-sm:h-36"
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grano-soft)", padding: "0 12px", textAlign: "center" }}>
                  {p.imageAlt}
                </span>
              </div>

              <div style={{ padding: "24px 26px" }} className="max-sm:!p-4">
                <span style={{
                  display: "inline-block",
                  background: "var(--maiz)", color: "var(--grano)",
                  padding: "4px 10px", borderRadius: 999,
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  marginBottom: 12,
                }}>
                  {p.tag[lang]}
                </span>

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.01em", color: "var(--grano)" }}>
                  {p.name[lang]}
                </h3>

                <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--grano-soft)", margin: 0 }}>
                  {p.description[lang]}
                </p>

                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed var(--linea)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grano-soft)" }}>
                    {p.unit[lang]}
                  </span>
                  <a
                    href={waUrl(p.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, color: "var(--terracota)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    {t.productsOrder} <IconArrow size={14} color="var(--terracota)" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <a
            href={`https://wa.me/525543612880?text=${encodeURIComponent(lang === "es" ? "Hola, me gustaría ver el catálogo completo" : "Hi, I'd like to see the full catalogue")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: "var(--grano)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--grano)", paddingBottom: 4 }}
          >
            {t.productsMore} <IconArrow size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
