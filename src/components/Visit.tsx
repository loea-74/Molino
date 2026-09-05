"use client";

import { useLang } from "@/lib/LangContext";
import { textos } from "@/lib/textos";
import { IconWhatsApp, IconMail, IconMap } from "./icons";
import siteContent from "@/content/site.json";

export default function Visit() {
  const { lang } = useLang();
  const t = textos(lang);
  const v = siteContent.visit;
  const WHATSAPP = `https://wa.me/${v.whatsapp}`;

  return (
    <section
      id="visita"
      style={{ background: "var(--franja-oscura)", color: "var(--texto-claro)", padding: "96px 48px" }}
      className="max-sm:!px-5 max-sm:!py-14"
    >
      <div
        style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}
        className="max-md:!grid-cols-1 max-md:!gap-10"
      >
        {/* Left */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--maiz)", marginBottom: 14 }}>
            {t.visitEyebrow}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 0.98, fontWeight: 300, margin: "0 0 20px", letterSpacing: "-0.03em", color: "var(--texto-claro)" }}>
            {v.title[lang]}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, maxWidth: 480, margin: "0 0 28px", color: "var(--texto-claro)", opacity: 0.92 }} className="max-sm:!text-sm">
            {v.body[lang]}
          </p>

          {/* Notice */}
          <div style={{ background: "rgba(42, 29, 20, 0.25)", border: "1px solid rgba(245, 237, 224, 0.3)", borderRadius: 12, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--maiz)", color: "var(--grano)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }} aria-hidden="true">!</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, marginBottom: 4, color: "var(--texto-claro)" }}>{v.noticeTitle[lang]}</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.9, color: "var(--texto-claro)" }}>{v.noticeBody[lang]}</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ height: 320, borderRadius: 14, border: "1px solid rgba(245, 237, 224, 0.3)", overflow: "hidden", marginBottom: 20 }} className="max-sm:!h-52">
            <iframe
              src="https://maps.google.com/maps?q=19.4259601,-99.1554247+(MOLINO+LA+GRAN+JALISCIENSE)&z=18&hl=es&output=embed"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Molino la Jalisciense"
            />
          </div>

          <a
            href={v.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 22, color: "var(--texto-claro)", textDecoration: "none", fontSize: 14, fontWeight: 500, border: "1px solid rgba(245, 237, 224, 0.45)", borderRadius: 999, padding: "9px 18px" }}
          >
            <IconMap size={16} /> {t.visitDirections}
          </a>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>{t.visitAddressL}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.4, whiteSpace: "pre-line", color: "var(--texto-claro)" }} className="max-sm:!text-base">{v.address[lang]}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>{t.visitHoursL}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1.4, whiteSpace: "pre-line", color: "var(--texto-claro)" }} className="max-sm:!text-base">{v.hours[lang]}</div>
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(245, 237, 224, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: "var(--texto-claro)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
              <IconWhatsApp size={18} color="var(--texto-claro)" /> {v.phone}
            </a>
            <a href={`tel:+52${v.phone2.replace(/\s/g, "")}`} style={{ color: "var(--texto-claro)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, opacity: 0.85, paddingLeft: 28 }}>
              {v.phone2}
            </a>
            <a href={`mailto:${v.email}`} style={{ color: "var(--texto-claro)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, opacity: 0.85 }}>
              <IconMail size={18} /> {v.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
