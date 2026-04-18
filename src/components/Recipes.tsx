"use client";

import { useRef, useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { IconChevronLeft, IconChevronRight, IconArrow } from "./icons";
import recipes from "@/content/recipes.json";

export default function Recipes() {
  const { lang } = useLang();
  const t = L[lang];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const PER_VIEW = 3;
  const totalPages = Math.max(1, recipes.length - PER_VIEW + 1);

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    const card = el.querySelector<HTMLElement>("[data-card]");
    if (card) {
      const w = card.getBoundingClientRect().width + 18;
      setIdx(Math.round(el.scrollLeft / w));
    }
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const w = card ? card.getBoundingClientRect().width + 18 : 320;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const w = card ? card.getBoundingClientRect().width + 18 : 320;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  };

  return (
    <section id="recetas" style={{ padding: "96px 0" }} className="max-sm:!py-14">
      {/* Header */}
      <div
        style={{ padding: "0 48px", marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, maxWidth: 1280, margin: "0 auto 40px" }}
        className="max-sm:!px-5 max-sm:!mb-6"
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 14 }}>
            {t.recipesEyebrow}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1, fontWeight: 400, margin: "0 0 12px", letterSpacing: "-0.025em", color: "var(--grano)" }}>
            {t.recipesTitle}
          </h2>
          <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--grano-soft)" }}>
            {t.recipesKicker}
          </div>
        </div>

        {/* Prev/Next buttons */}
        <div style={{ display: "flex", gap: 10 }} className="max-md:hidden">
          {[
            { dir: -1, label: t.recipesPrev, can: canPrev, Icon: IconChevronLeft },
            { dir: 1,  label: t.recipesNext, can: canNext, Icon: IconChevronRight },
          ].map(({ dir, label, can, Icon }) => (
            <button
              key={dir}
              aria-label={label}
              onClick={() => scrollBy(dir)}
              disabled={!can}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1px solid var(--grano)",
                background: can ? "var(--grano)" : "transparent",
                color: can ? "var(--crema-light)" : "var(--grano)",
                cursor: can ? "pointer" : "not-allowed",
                opacity: can ? 1 : 0.35,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 180ms ease",
              }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollerRef}
        style={{
          display: "flex", gap: 18,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: "4px 48px 24px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
        className="max-sm:!px-5 scrollbar-hide"
      >
        {recipes.map((r) => (
          <a
            key={r.slug}
            data-card
            href="#"
            style={{
              flex: "0 0 calc((100% - 96px - 36px) / 3)",
              minWidth: 300,
              scrollSnapAlign: "start",
              textDecoration: "none", color: "inherit",
              border: "1px solid var(--linea)", borderRadius: 14,
              overflow: "hidden",
              background: "var(--crema-light)",
              display: "flex", flexDirection: "column",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px -20px rgba(42,29,20,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <div style={{ position: "relative" }}>
              <div style={{ height: 220, background: "var(--linea)", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--grano-soft)" }}>foto</span>
              </div>
              <div style={{ position: "absolute", top: 14, left: 14, background: "var(--crema-light)", color: "var(--grano)", padding: "4px 10px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid var(--linea)" }}>
                {r.date[lang]}
              </div>
            </div>

            <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 10 }}>
                {r.kicker[lang]}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.01em", color: "var(--grano)" }}>
                {r.title[lang]}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "var(--grano-soft)", margin: 0, flex: 1 }}>
                {r.body[lang]}
              </p>
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--linea)", fontSize: 13, color: "var(--terracota)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {r.cta[lang]} <IconArrow size={12} color="var(--terracota)" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Dots + view all */}
      <div
        style={{ padding: "0 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginTop: 12, maxWidth: 1280, marginInline: "auto" }}
        className="max-sm:!px-5"
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              aria-label={`${lang === "es" ? "Ir a" : "Go to"} ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 24 : 8, height: 8,
                borderRadius: 999, border: "none",
                background: i === idx ? "var(--terracota)" : "var(--linea)",
                cursor: "pointer",
                transition: "all 200ms ease",
                padding: 0,
              }}
            />
          ))}
        </div>
        <a
          href="#"
          style={{ fontSize: 14, color: "var(--grano)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--grano)", paddingBottom: 4 }}
        >
          {t.recipesAll} <IconArrow size={14} />
        </a>
      </div>
    </section>
  );
}
