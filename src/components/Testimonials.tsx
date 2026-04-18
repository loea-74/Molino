"use client";

import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { IconStar } from "./icons";
import testimonials from "@/content/testimonials.json";

export default function Testimonials() {
  const { lang } = useLang();
  const t = L[lang];

  return (
    <section style={{ padding: "48px 48px 96px" }} className="max-sm:!px-5 max-sm:!py-14">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--terracota)", marginBottom: 28 }}>
          {t.testimonialsEyebrow}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="max-md:!grid-cols-1 max-md:!gap-4">
          {testimonials.map((tst) => (
            <blockquote key={tst.name} style={{ margin: 0, background: "var(--crema-light)", padding: 28, borderRadius: 14, border: "1px solid var(--linea)" }} className="max-sm:!p-5">
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {[1, 2, 3, 4, 5].map((n) => <IconStar key={n} size={14} color="var(--maiz)" />)}
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.4, fontStyle: "italic", fontWeight: 400, margin: "0 0 16px", color: "var(--grano)" }} className="max-sm:!text-base">
                {tst.quote[lang]}
              </p>
              <div style={{ paddingTop: 12, borderTop: "1px dashed var(--linea)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--grano)" }}>{tst.name}</div>
                <div style={{ fontSize: 11, color: "var(--grano-soft)", marginTop: 2, letterSpacing: "0.05em" }}>{tst.meta[lang]}</div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
