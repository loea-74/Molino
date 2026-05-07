"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { L } from "@/lib/i18n";
import Image from "next/image";
import { IconWhatsApp, IconInstagram, IconFacebook, IconTikTok, IconYouTube, IconTwitter, IconLinkedIn } from "./icons";
import siteContent from "@/content/site.json";

const NAV_HREFS = ["#productos", "#historia", "#recetas", "#visita"];

function SocialIcons() {
  const [hovered, setHovered] = useState<string | null>(null);
  const s = siteContent.social;

  const links = [
    { key: "instagram", icon: <IconInstagram size={16} />, href: s.instagram },
    { key: "facebook",  icon: <IconFacebook size={16} />,  href: s.facebook },
    { key: "whatsapp",  icon: <IconWhatsApp size={16} color="currentColor" />, href: s.whatsapp ? `https://wa.me/${s.whatsapp}` : "" },
    { key: "tiktok",    icon: <IconTikTok size={16} />,    href: s.tiktok },
    { key: "youtube",   icon: <IconYouTube size={16} />,   href: s.youtube },
    { key: "twitter",   icon: <IconTwitter size={16} />,   href: s.twitter },
    { key: "linkedin",  icon: <IconLinkedIn size={16} />,  href: s.linkedin },
  ].filter(({ href }) => href);

  if (links.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {links.map(({ key, icon, href }) => {
        const dimmed = hovered !== null && hovered !== key;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(245,237,224,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--crema-light)", textDecoration: "none",
              background: hovered === key ? "rgba(245,237,224,0.18)" : "transparent",
              opacity: dimmed ? 0.3 : 1,
              transform: hovered === key ? "scale(1.15)" : "scale(1)",
              transition: "opacity 200ms ease, transform 200ms ease, background 200ms ease",
            }}
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}

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
            <SocialIcons />
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: "1px solid rgba(245,237,224,0.15)", fontSize: 11, opacity: 0.6, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>{t.footerRights}</div>
          <div style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>{t.footerLocation}</div>
        </div>
        <div style={{ marginTop: 14, textAlign: "center", fontSize: 10, opacity: 0.35, letterSpacing: "0.1em" }}>
          Creado por{" "}
          <a
            href="https://loeasolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            title="LoeaSolutions"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            LoeaSolutions
          </a>
        </div>
      </div>
    </footer>
  );
}
