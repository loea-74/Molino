"use client";

import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import Image from "next/image";
import { IconWhatsApp, IconInstagram, IconFacebook } from "./icons";

const WHATSAPP = "https://wa.me/525543612880";

const NAV_HREFS = ["#productos", "#historia", "#recetas", "#visita"];

export default function Footer() {
  const { lang } = useLang();
  const t = L[lang];

  return (
    <footer style={{ background: "var(--grano)", color: "var(--crema-light)", padding: "56px 48px 32px" }} className="max-sm:!px-5 max-sm:!py-10">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 32, marginBottom: 36 }} className="max-md:!grid-cols-1 max-md:!gap-8">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image src="/fotos/logo.jpg" alt="Logo" width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--crema-light)" }}>
                  Molino la Gran Jalisciense
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>
                  {t.footerTag}
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: 12 }}>
              {t.footerSite}
            </div>
            {t.nav.map((label, i) => (
              <div key={NAV_HREFS[i]} style={{ fontSize: 13, marginBottom: 8 }}>
                <a href={NAV_HREFS[i]} style={{ color: "inherit", textDecoration: "none" }}>{label}</a>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: 12 }}>
              {t.footerFollow}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Instagram", icon: <IconInstagram size={16} />, href: "#" },
                { label: "Facebook",  icon: <IconFacebook size={16} />,  href: "#" },
                { label: "WhatsApp",  icon: <IconWhatsApp size={16} color="currentColor" />, href: WHATSAPP },
              ].map(({ label, icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(245,237,224,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--crema-light)", textDecoration: "none" }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: "1px solid rgba(245,237,224,0.15)", fontSize: 11, opacity: 0.6, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>{t.footerRights}</div>
          <div style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>{t.footerLocation}</div>
        </div>
        <div style={{ marginTop: 14, textAlign: "center", fontSize: 10, opacity: 0.35, letterSpacing: "0.1em" }}>
          Creado por LoeaaSolutions
        </div>
      </div>
    </footer>
  );
}
