"use client";

import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";

export default function History() {
  const { lang } = useLang();
  const t = L[lang];

  return (
    <section
      id="historia"
      style={{ background: "var(--grano)", color: "var(--crema)", padding: "96px 48px", position: "relative" }}
      className="max-sm:!px-5 max-sm:!py-14"
    >
      <div
        style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "center" }}
        className="max-md:!grid-cols-1 max-md:!gap-8"
      >
        {/* Photo */}
        <div style={{ position: "relative" }}>
          <div
            style={{ width: "100%", aspectRatio: "3/4", background: "rgba(255,255,255,0.08)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-hidden="true"
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--linea)" }}>
              {t.historyImgLabel}
            </span>
          </div>
          <div style={{ position: "absolute", top: 16, left: 16, background: "var(--maiz)", color: "var(--grano)", padding: "6px 12px", borderRadius: 999, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {t.historyBadge}
          </div>
        </div>

        {/* Text */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--maiz)", marginBottom: 14 }}>
            {t.historyEyebrow}
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02, fontWeight: 400, margin: "0 0 24px", letterSpacing: "-0.02em", color: "var(--crema)" }}>
            {t.historyTitle}
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--linea)", marginBottom: 18 }} className="max-sm:!text-sm">
            {t.historyBody1}
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--linea)", marginBottom: 32 }} className="max-sm:!text-sm">
            {t.historyBody2}
          </p>

          <div style={{ borderLeft: "2px solid var(--terracota)", paddingLeft: 20 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.25, margin: "0 0 10px", color: "var(--crema-light)" }}>
              {t.historyQuote}
            </p>
            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--maiz)", margin: 0 }}>
              {t.historyCaption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
