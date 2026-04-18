"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { IconChevronLeft, IconChevronRight, IconArrow } from "./icons";
import RecipeModal from "./RecipeModal";
import recipes from "@/content/recipes.json";

const GRADIENTS = [
  "linear-gradient(145deg, #c4673a 0%, #8b3e1f 100%)",
  "linear-gradient(145deg, #b8542e 0%, #7a3520 100%)",
  "linear-gradient(145deg, #7a9e52 0%, #4a6830 100%)",
  "linear-gradient(145deg, #d4784a 0%, #9e4a28 100%)",
  "linear-gradient(145deg, #8aaa5c 0%, #556b3a 100%)",
  "linear-gradient(145deg, #c87840 0%, #8b5230 100%)",
];

export default function Recipes() {
  const { lang } = useLang();
  const t = L[lang];
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const n = recipes.length;
  const thumb1 = (active + 1) % n;
  const thumb2 = (active + 2) % n;

  const goTo = (i: number) => {
    if (i === active) return;
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 220);
  };

  const goNext = () => goTo((active + 1) % n);
  const goPrev = () => goTo((active - 1 + n) % n);

  const featured = recipes[active];

  return (
    <>
    <section id="recetas" style={{ padding: "96px 0", background: "var(--grano)" }} className="max-sm:!py-14">

      {/* Header */}
      <div
        style={{ padding: "0 48px", maxWidth: 1280, margin: "0 auto 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}
        className="max-sm:!px-5"
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--maiz)", marginBottom: 14 }}>
            {t.recipesEyebrow}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 1, fontWeight: 400, margin: "0 0 10px", letterSpacing: "-0.025em", color: "var(--crema-light)" }}>
            {t.recipesTitle}
          </h2>
          <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,237,224,0.45)" }}>
            {t.recipesKicker}
          </div>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", gap: 10 }}>
          {([goPrev, goNext] as const).map((fn, i) => {
            const Icon = i === 0 ? IconChevronLeft : IconChevronRight;
            return (
              <button
                key={i}
                onClick={fn}
                aria-label={i === 0 ? t.recipesPrev : t.recipesNext}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: "1px solid rgba(245,237,224,0.25)",
                  background: "rgba(245,237,224,0.08)",
                  color: "var(--crema-light)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 180ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--crema-light)"; e.currentTarget.style.color = "var(--grano)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,237,224,0.08)"; e.currentTarget.style.color = "var(--crema-light)"; }}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento grid */}
      <div style={{ padding: "0 48px", maxWidth: 1280, margin: "0 auto" }} className="max-sm:!px-5">
        <div
          style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14, height: 640 }}
          className="max-md:!grid-cols-1 max-md:!h-auto max-md:!grid-rows-[none]"
        >
          {/* Featured card — spans 2 rows */}
          <div
            style={{
              gridRow: "1 / 3",
              position: "relative", borderRadius: 18, overflow: "hidden",
              background: GRADIENTS[active],
              opacity: fading ? 0 : 1,
              transform: fading ? "scale(0.98)" : "scale(1)",
              transition: "opacity 220ms ease, transform 220ms ease",
            }}
            className="max-md:!min-h-[420px] max-md:!row-auto"
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,5,0.96) 0%, rgba(26,18,5,0.35) 55%, transparent 100%)" }} />

            {/* Date badge */}
            <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(245,237,224,0.12)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(245,237,224,0.18)", padding: "5px 14px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--crema-light)" }}>
              {featured.date[lang]}
            </div>

            {/* Content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 36px" }} className="max-sm:!p-6">
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--maiz)", marginBottom: 12 }}>
                {featured.kicker[lang]}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 400, margin: "0 0 14px", letterSpacing: "-0.02em", color: "var(--crema-light)", lineHeight: 1.1 }}>
                {featured.title[lang]}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(245,237,224,0.78)", margin: "0 0 22px", maxWidth: 440 }} className="max-sm:!text-sm">
                {featured.body[lang]}
              </p>
              <button
                onClick={() => setModalOpen(true)}
                style={{ fontSize: 13, fontWeight: 500, color: "var(--maiz)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(232,184,88,0.35)", paddingBottom: 3, background: "none", border: "none", borderBottom: "1px solid rgba(232,184,88,0.35)", cursor: "pointer", padding: "0 0 3px" }}
              >
                {featured.cta[lang]} <IconArrow size={12} color="var(--maiz)" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {[thumb1, thumb2].map((ri) => {
            const r = recipes[ri];
            return (
              <div
                key={r.slug}
                onClick={() => goTo(ri)}
                style={{
                  position: "relative", borderRadius: 18, overflow: "hidden",
                  background: GRADIENTS[ri],
                  cursor: "pointer",
                  transition: "opacity 180ms ease, transform 180ms ease",
                }}
                className="max-md:!min-h-[220px]"
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scale(0.985)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,5,0.93) 0%, rgba(26,18,5,0.15) 60%, transparent 100%)" }} />

                {/* Date badge */}
                <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(245,237,224,0.1)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(245,237,224,0.15)", padding: "4px 11px", borderRadius: 999, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--crema-light)" }}>
                  {r.date[lang]}
                </div>

                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 26px" }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--maiz)", marginBottom: 7 }}>
                    {r.kicker[lang]}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, margin: 0, letterSpacing: "-0.01em", color: "var(--crema-light)", lineHeight: 1.2 }}>
                    {r.title[lang]}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots + view all */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginTop: 22 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {recipes.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Receta ${i + 1}`}
                style={{
                  width: i === active ? 24 : 8, height: 8,
                  borderRadius: 999, border: "none",
                  background: i === active ? "var(--maiz)" : "rgba(245,237,224,0.22)",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
          <a
            href="#"
            style={{ fontSize: 14, color: "var(--crema-light)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(245,237,224,0.35)", paddingBottom: 4 }}
          >
            {t.recipesAll} <IconArrow size={14} color="var(--crema-light)" />
          </a>
        </div>
      </div>
    </section>

    {modalOpen && (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <RecipeModal recipe={recipes[active] as any} onClose={() => setModalOpen(false)} />
    )}
    </>
  );
}
