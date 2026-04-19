"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { IconArrow } from "./icons";
import products from "@/content/products.json";
import siteContent from "@/content/site.json";

const PHONE = "525543612880";

function waUrl(msg: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

function CatalogModal({ onClose }: { onClose: () => void }) {
  const { page1, page2 } = siteContent.catalog;
  const pages = [page1, page2];
  const [current, setCurrent] = useState(0);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(20,12,6,0.92)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

        {/* Top bar */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(245,237,224,0.6)", fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            {current + 1} / {pages.length}
          </span>
          <button onClick={onClose} style={{ background: "rgba(245,237,224,0.12)", border: "1px solid rgba(245,237,224,0.25)", color: "#f5ede0", borderRadius: 999, padding: "6px 16px", fontSize: 13, cursor: "pointer" }}>
            Cerrar ✕
          </button>
        </div>

        {/* Image */}
        <div style={{ width: "100%", borderRadius: 12, overflow: "hidden", position: "relative", aspectRatio: "3/4", background: "#fff" }}>
          <Image src={pages[current]} alt={`Folleto página ${current + 1}`} fill style={{ objectFit: "contain" }} sizes="640px" priority />
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setCurrent(0)}
            disabled={current === 0}
            style={{ padding: "10px 24px", borderRadius: 999, border: "1.5px solid rgba(245,237,224,0.3)", background: current === 0 ? "rgba(245,237,224,0.15)" : "transparent", color: "#f5ede0", fontSize: 14, cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.4 : 1 }}
          >
            ← Frente
          </button>
          <button
            onClick={() => setCurrent(1)}
            disabled={current === 1}
            style={{ padding: "10px 24px", borderRadius: 999, border: "1.5px solid rgba(245,237,224,0.3)", background: current === 1 ? "rgba(245,237,224,0.15)" : "transparent", color: "#f5ede0", fontSize: 14, cursor: current === 1 ? "default" : "pointer", opacity: current === 1 ? 0.4 : 1 }}
          >
            Reverso →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { lang } = useLang();
  const t = L[lang];
  const [showCatalog, setShowCatalog] = useState(false);

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

        {/* Cards */}
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
          <button
            onClick={() => setShowCatalog(true)}
            style={{ fontSize: 14, color: "var(--grano)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--grano)", paddingBottom: 4 }}
          >
            {t.productsMore} <IconArrow size={14} />
          </button>
        </div>
      </div>

      {showCatalog && <CatalogModal onClose={() => setShowCatalog(false)} />}
    </section>
  );
}
