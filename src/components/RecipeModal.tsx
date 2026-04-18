"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import { IconArrow } from "./icons";

type Recipe = {
  slug: string;
  kicker: { es: string; en: string };
  title: { es: string; en: string };
  date: { es: string; en: string };
  cta: { es: string; en: string };
  fullContent: {
    es: { intro: string; ingredients: string[]; steps: string[]; tip: string };
    en: { intro: string; ingredients: string[]; steps: string[]; tip: string };
  };
};

const WHATSAPP = "https://wa.me/525543612880?text=Hola%2C%20me%20interesa%20hacer%20un%20pedido";

export default function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { lang } = useLang();
  const content = recipe.fullContent[lang];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(42, 29, 20, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 200ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--crema-light)",
          borderRadius: 20,
          maxWidth: 680,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          animation: "slideUp 250ms ease",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ padding: "32px 36px 24px", borderBottom: "1px solid var(--linea)", position: "sticky", top: 0, background: "var(--crema-light)", zIndex: 1, borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 8 }}>
                {recipe.kicker[lang]} · {recipe.date[lang]}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, margin: 0, letterSpacing: "-0.02em", color: "var(--grano)", lineHeight: 1.1 }}>
                {recipe.title[lang]}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--linea)",
                background: "transparent", cursor: "pointer", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--grano-soft)", fontSize: 18, lineHeight: 1,
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--grano)"; e.currentTarget.style.color = "var(--crema-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--grano-soft)"; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 36px 36px" }}>

          {/* Intro */}
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--grano-soft)", margin: "0 0 28px" }}>
            {content.intro}
          </p>

          {/* Ingredients */}
          {content.ingredients.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 14 }}>
                {lang === "es" ? "Ingredientes" : "Ingredients"}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {content.ingredients.map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "var(--grano-soft)", lineHeight: 1.45 }}>
                    <span style={{ color: "var(--terracota)", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 2, flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 14 }}>
              {content.ingredients.length > 0
                ? (lang === "es" ? "Preparación" : "Preparation")
                : (lang === "es" ? "Detalles" : "Details")}
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {content.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  {content.ingredients.length > 0 && (
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--terracota)", fontWeight: 500, minWidth: 22, marginTop: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span style={{ fontSize: 15, lineHeight: 1.55, color: "var(--grano-soft)" }}
                    dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--grano)">$1</strong>') }}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* Tip */}
          {content.tip && (
            <div style={{ background: "var(--crema)", border: "1px solid var(--linea)", borderLeft: "3px solid var(--terracota)", borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: 28 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--terracota)", display: "block", marginBottom: 6 }}>
                {lang === "es" ? "Consejo del molino" : "Mill tip"}
              </span>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--grano-soft)", margin: 0 }}>{content.tip}</p>
            </div>
          )}

          {/* CTA */}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "var(--terracota)", color: "var(--crema-light)",
              padding: "14px 24px", borderRadius: 999,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}
          >
            {lang === "es" ? "Pedir ingredientes por WhatsApp" : "Order ingredients on WhatsApp"}
            <IconArrow size={14} color="var(--crema-light)" />
          </a>
        </div>
      </div>
    </div>
  );
}
