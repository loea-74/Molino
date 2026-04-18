"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import { Seal, IconWhatsApp, IconMenu } from "./icons";

const WHATSAPP = "https://wa.me/525543612880";

export default function Nav() {
  const { lang, toggle } = useLang();
  const t = L[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  const navHrefs = ["#productos", "#historia", "#recetas", "#visita"];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(245,237,224,0.93)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--linea)",
      }}
    >
      <nav
        style={{
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
        }}
        className="max-sm:!px-5 max-sm:!py-3"
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <Seal size={44} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1, color: "var(--grano)" }}>
              Molino la Jalisciense
            </div>
            <div style={{ fontSize: 11, color: "var(--grano-soft)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>
              Desde 1962
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="max-md:!hidden flex items-center" style={{ gap: 28 }}>
          {t.nav.map((label, i) => (
            <a key={navHrefs[i]} href={navHrefs[i]} style={{ fontSize: 14, color: "var(--grano)", textDecoration: "none", fontWeight: 500 }}>
              {label}
            </a>
          ))}

          <button
            onClick={toggle}
            aria-pressed={lang === "en"}
            aria-label="Cambiar idioma"
            style={{
              background: "transparent",
              border: "1px solid var(--grano)",
              padding: "6px 12px",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              cursor: "pointer",
              color: "var(--grano)",
            }}
          >
            {t.langToggle}
          </button>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--grano)",
              color: "var(--crema)",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconWhatsApp size={14} color="var(--maiz)" />
            {t.navCta}
          </a>
        </div>

        {/* Mobile controls */}
        <div className="md:!hidden flex items-center" style={{ gap: 10 }}>
          <button
            onClick={toggle}
            aria-pressed={lang === "en"}
            aria-label="Cambiar idioma"
            style={{
              background: "transparent",
              border: "1px solid var(--grano)",
              padding: "4px 10px",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              cursor: "pointer",
              color: "var(--grano)",
            }}
          >
            {t.langToggle}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
            style={{
              width: 36, height: 36,
              border: "1px solid var(--grano)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent",
              cursor: "pointer",
              color: "var(--grano)",
            }}
          >
            <IconMenu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid var(--linea)", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {t.nav.map((label, i) => (
            <a
              key={navHrefs[i]}
              href={navHrefs[i]}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: 15, color: "var(--grano)", textDecoration: "none", fontWeight: 500 }}
            >
              {label}
            </a>
          ))}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--grano)", color: "var(--crema)",
              padding: "12px 18px", borderRadius: 999,
              fontSize: 14, fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 4,
            }}
          >
            <IconWhatsApp size={16} color="var(--maiz)" />
            {t.navCta}
          </a>
        </div>
      )}
    </header>
  );
}
