"use client";

import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { textos } from "@/lib/textos";
import { IconWhatsApp } from "./icons";
import catalogo from "@/content/catalogo.json";
import siteContent from "@/content/site.json";

/**
 * El catálogo entero, por departamento y categoría.
 *
 * Son mil y pico productos: enseñarlos todos de golpe sería un muro. Se
 * presenta como la carta de un restaurante — un índice de departamentos arriba,
 * y del elegido se despliegan sus categorías con unos pocos productos de
 * muestra y la cuenta del resto.
 *
 * Sin precios, a propósito: los del punto de venta envejecen y una web con
 * precios viejos hace más daño que una sin ellos. Se remata con la invitación
 * a preguntar por WhatsApp, que además abre conversación.
 */

type Producto = { clave: string; nombre: string; oculto?: boolean };
type Categoria = { clave: string; nombre: string; cuantos: number; productos: Producto[]; oculto?: boolean };
type Departamento = { clave: string; nombre: string; categorias: Categoria[]; oculto?: boolean };

/** Lo que se ve, ya sin lo escondido desde el panel. */
const DEPARTAMENTOS: Departamento[] = (catalogo.departamentos as Departamento[])
  .filter((d) => !d.oculto)
  .map((d) => ({
    ...d,
    categorias: d.categorias
      .filter((c) => !c.oculto)
      .map((c) => ({ ...c, productos: c.productos.filter((p) => !p.oculto) }))
      .filter((c) => c.productos.length > 0),
  }))
  .filter((d) => d.categorias.length > 0);

/** Cuántos productos tiene un departamento, ya descontado lo escondido. */
const cuenta = (d: Departamento) =>
  d.categorias.reduce((n, c) => n + c.productos.length, 0);
const SERVICIOS = catalogo.servicios as { nombre: string; nota: string }[];

export default function Catalogo() {
  const { lang } = useLang();
  const t = textos(lang);
  const [activo, setActivo] = useState(0);
  const dep = DEPARTAMENTOS[activo];

  const WHATSAPP = `https://wa.me/${siteContent.visit.whatsapp}?text=${encodeURIComponent(
    lang === "es" ? "Hola, quiero preguntar por un producto" : "Hi, I'd like to ask about a product"
  )}`;

  return (
    <section
      id="catalogo"
      style={{ padding: "96px 48px", background: "var(--crema-light)" }}
      className="max-sm:!px-5 max-sm:!py-14"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* ───────── encabezado ───────── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 56, alignItems: "end" }}
          className="max-md:!grid-cols-1 max-md:!gap-4 max-md:!mb-9"
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--terracota)", marginBottom: 14,
              }}
            >
              {t.catalogoEyebrow}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5vw, 64px)",
                lineHeight: 0.98, fontWeight: 400, margin: 0,
                letterSpacing: "-0.025em", color: "var(--grano)",
              }}
            >
              {t.catalogoTitle}
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: "var(--grano-soft)", margin: 0, maxWidth: 480 }}>
            {t.catalogoBody}
          </p>
        </div>

        {/* ───────── índice de departamentos ───────── */}
        <nav
          aria-label={lang === "es" ? "Departamentos del catálogo" : "Catalogue departments"}
          className="cat-nav"
          style={{
            display: "flex", flexWrap: "wrap", gap: "4px 26px",
            borderBottom: "1px solid var(--linea)", paddingBottom: 14, marginBottom: 40,
          }}
        >
          {DEPARTAMENTOS.map((d, i) => {
            const on = i === activo;
            return (
              <button
                key={d.nombre}
                type="button"
                onClick={() => setActivo(i)}
                aria-current={on ? "true" : undefined}
                className={"cat-dep" + (on ? " cat-dep-on" : "")}
              >
                {d.nombre}
                <span className="cat-dep-n">{cuenta(d)}</span>
              </button>
            );
          })}
        </nav>

        {/* ───────── las categorías del departamento elegido ─────────
            En columnas de CSS: los bloques tienen alturas dispares y así fluyen
            solos sin dejar huecos, como las secciones de una carta. */}
        <div
          key={dep.nombre}
          style={{ columnCount: 3, columnGap: 44 }}
          className="max-md:!columns-2 max-sm:!columns-1"
        >
          {dep.categorias.map((c) => {
            const visibles = c.productos.slice(0, c.cuantos);
            const resto = c.productos.length - visibles.length;
            return (
              <div key={c.nombre} style={{ breakInside: "avoid", marginBottom: 30 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em",
                    textTransform: "uppercase", color: "var(--terracota)",
                    margin: "0 0 10px", paddingBottom: 7,
                    borderBottom: "1px solid var(--linea)",
                    display: "flex", justifyContent: "space-between", gap: 10,
                  }}
                >
                  <span>{c.nombre}</span>
                  <span style={{ color: "var(--grano-soft)", opacity: 0.7 }}>{c.productos.length}</span>
                </h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {visibles.map((p) => (
                    <li
                      key={p.clave}
                      style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--grano-soft)", marginBottom: 3 }}
                    >
                      {p.nombre}
                    </li>
                  ))}
                  {resto > 0 && (
                    <li style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--grano-soft)", opacity: 0.6, marginTop: 5, fontStyle: "italic" }}>
                      {resto === 1 ? t.catalogoUno : t.catalogoMas.replace("{n}", String(resto))}
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ───────── servicios ─────────
            Cierran el catálogo, con fondo propio para que no se confundan con
            un departamento más: moler no es un producto que se compra, es lo
            que el molino hace con lo que le lleves. */}
        <div
          style={{
            background: "var(--crema)", border: "1px solid var(--linea)",
            borderRadius: 16, padding: "32px 36px", marginTop: 56,
          }}
          className="max-sm:!p-6 max-sm:!mt-9"
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.6vw, 30px)",
                fontWeight: 400, margin: 0, letterSpacing: "-0.02em", color: "var(--grano)",
              }}
            >
              {t.catalogoServicios}
            </h3>
            <span style={{ fontSize: 14.5, color: "var(--grano-soft)" }}>{t.catalogoServiciosBody}</span>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}
            className="max-md:!grid-cols-2 max-sm:!grid-cols-1 max-sm:!gap-3"
          >
            {SERVICIOS.map((s) => (
              <div
                key={s.nombre}
                style={{
                  borderTop: "2px solid var(--maiz)", paddingTop: 12,
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--grano)", lineHeight: 1.25 }}>
                  {s.nombre}
                </div>
                <div style={{ fontSize: 13.5, color: "var(--grano-soft)", marginTop: 4, lineHeight: 1.45 }}>
                  {s.nota}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ───────── cierre: preguntar por precios ───────── */}
        <div
          style={{
            marginTop: 48, paddingTop: 28, borderTop: "1px solid var(--linea)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 20, flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: 16, color: "var(--grano-soft)", margin: 0, maxWidth: 520 }}>
            {t.catalogoPrecios}
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--terracota)", color: "var(--crema-light)",
              padding: "14px 24px", borderRadius: 999, fontSize: 15, fontWeight: 500,
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
              whiteSpace: "nowrap",
            }}
          >
            <IconWhatsApp size={18} color="var(--crema-light)" />
            {t.navCta}
          </a>
        </div>
      </div>
    </section>
  );
}
