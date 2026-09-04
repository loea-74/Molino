"use client";

import { C, esp, radio, campo, etiqueta, tarjeta, botonSuave } from "./ui";
import { Bloque } from "./campos";
import type { Site } from "./PanelesSitio";
import {
  GRUPOS_COLOR, PAREJAS, PAREJA_OMISION, COLORES, temaCompleto, type DefColor,
} from "@/lib/tema";

type Props = { site: Site; set: (f: (s: Site) => Site) => void };

export default function PanelApariencia({ site, set }: Props) {
  const tema = temaCompleto(site.theme);
  const pareja = PAREJAS[tema.fuente] ?? PAREJAS[PAREJA_OMISION];

  const ponerColor = (clave: string, valor: string) =>
    set((s) => ({
      ...s,
      theme: { ...s.theme, colores: { ...s.theme?.colores, [clave]: valor } },
    }));

  const ponerFuente = (clave: string) =>
    set((s) => ({ ...s, theme: { ...s.theme, fuente: clave } }));

  const restablecerColores = () =>
    set((s) => ({ ...s, theme: { ...s.theme, colores: {} } }));

  const hayColoresPropios = COLORES.some(
    (c) => (site.theme?.colores?.[c.clave] ?? "").trim() !== ""
  );

  return (
    <>
      <Vista tema={tema} pareja={pareja} />

      <Bloque titulo="Tipografía" nota="Cómo se ven las letras en toda la página">
        <div style={{ display: "grid", gap: esp.sm }}>
          {Object.entries(PAREJAS).map(([clave, p]) => {
            const activa = clave === tema.fuente;
            return (
              <button
                key={clave}
                type="button"
                onClick={() => ponerFuente(clave)}
                aria-pressed={activa}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  borderRadius: radio.medio,
                  border: `2px solid ${activa ? C.accion : C.lineaSuave}`,
                  background: activa ? C.papelHueso : "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "grid",
                  gap: 6,
                }}
              >
                <span style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15.5, fontWeight: activa ? 600 : 500, color: C.tinta }}>
                    {p.nombre}
                  </span>
                  {clave === PAREJA_OMISION && (
                    <span style={{ fontSize: 11, color: C.gris, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      actual
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 13, color: C.marronClaro, lineHeight: 1.45 }}>{p.nota}</span>
                {/* La muestra usa la fuente de verdad: se juzga viéndola. */}
                <span style={{ display: "block", marginTop: 3 }}>
                  <span style={{ fontFamily: p.display, fontSize: 26, color: C.tinta, display: "block", lineHeight: 1.15 }}>
                    Maíz cacahuazintle
                  </span>
                  <span style={{ fontFamily: p.body, fontSize: 14, color: C.marron, display: "block", marginTop: 3 }}>
                    Molido el mismo día, para pozole y tamales de casa.
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Bloque>

      {GRUPOS_COLOR.map((g) => (
        <Bloque key={g.titulo} titulo={g.titulo} nota={g.nota}>
          {g.colores.map((c) => (
            <FilaColor
              key={c.clave}
              def={c}
              valor={tema.colores[c.clave]}
              propio={(site.theme?.colores?.[c.clave] ?? "").trim() !== ""}
              onChange={(v) => ponerColor(c.clave, v)}
            />
          ))}
        </Bloque>
      ))}

      <div style={{ borderTop: `1px solid ${C.lineaSuave}`, paddingTop: esp.md, marginBottom: esp.xl }}>
        <button
          type="button"
          onClick={restablecerColores}
          disabled={!hayColoresPropios}
          style={{ ...botonSuave, opacity: hayColoresPropios ? 1 : 0.45, cursor: hayColoresPropios ? "pointer" : "default" }}
        >
          Volver a los colores originales
        </button>
        <div style={{ fontSize: 13, color: C.marronClaro, marginTop: 7 }}>
          Sólo los colores. La tipografía se elige arriba.
        </div>
      </div>
    </>
  );
}

/* ───────────────────────── UNA FILA DE COLOR ───────────────────────── */

function FilaColor({
  def, valor, propio, onChange,
}: {
  def: DefColor; valor: string; propio: boolean; onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "11px 0", borderBottom: `1px solid ${C.lineaSuave}`,
        flexWrap: "wrap",
      }}
    >
      <input
        type="color"
        value={valor}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        aria-label={def.nombre}
        style={{
          // 46 px: el selector nativo del celular necesita blanco para tocarse.
          width: 46, height: 46, padding: 2, flexShrink: 0,
          border: `1.5px solid ${C.linea}`, borderRadius: radio.chico,
          background: "#fff", cursor: "pointer",
        }}
      />

      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontSize: 15, color: C.tinta, fontWeight: 500 }}>{def.nombre}</div>
        <div style={{ fontSize: 13, color: C.marronClaro, marginTop: 1 }}>{def.donde}</div>
      </div>

      <input
        value={valor}
        onChange={(e) => {
          const v = e.target.value.trim();
          onChange(v.startsWith("#") ? v.toUpperCase() : "#" + v.toUpperCase());
        }}
        spellCheck={false}
        aria-label={`${def.nombre}, código de color`}
        style={{
          ...campo, width: 108, flexShrink: 0,
          fontFamily: "ui-monospace, monospace", fontSize: 14, textTransform: "uppercase",
        }}
      />

      {propio && valor.toUpperCase() !== def.omision.toUpperCase() && (
        <button
          type="button"
          onClick={() => onChange(def.omision)}
          style={{
            background: "none", border: "none", padding: "4px 0",
            fontSize: 12.5, color: C.marron, cursor: "pointer",
            textDecoration: "underline", fontFamily: "inherit", flexShrink: 0,
          }}
        >
          Deshacer
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── VISTA PREVIA ───────────────────────── */

/**
 * Un trozo de la página con los colores y la letra elegidos.
 *
 * Va arriba del todo y se queda pegada al desplazarse: cambiar un color a
 * ciegas y esperar el minuto que tarda Vercel en desplegar para ver si se lee
 * es la peor forma posible de elegir una paleta.
 */
function Vista({
  tema, pareja,
}: {
  tema: ReturnType<typeof temaCompleto>;
  pareja: (typeof PAREJAS)[string];
}) {
  const c = tema.colores;

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 5, paddingBottom: esp.md, background: C.papel }}>
      <div style={{ ...etiqueta, marginBottom: esp.xs }}>Así se verá</div>

      <div
        style={{
          ...tarjeta,
          background: c.cremaLight,
          borderColor: c.linea,
          padding: "22px 24px",
        }}
      >
        <div
          style={{
            fontFamily: pareja.body, fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: c.terracota,
          }}
        >
          02 · Catálogo
        </div>

        <div
          style={{
            fontFamily: pareja.display, fontSize: 32, lineHeight: 1.1,
            letterSpacing: "-0.03em", color: c.grano, marginTop: 8,
          }}
        >
          Lo que sale del molino
        </div>

        <p
          style={{
            fontFamily: pareja.body, fontSize: 15, lineHeight: 1.55,
            color: c.granoSoft, margin: "10px 0 0", maxWidth: "48ch",
          }}
        >
          Producto fresco, molido el mismo día. Pedidos por WhatsApp para llevar
          o recoger en tienda.
        </p>

        <div
          style={{
            marginTop: 18, padding: 16, borderRadius: 14,
            background: c.crema, border: `1px solid ${c.linea}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                fontFamily: pareja.body, display: "inline-block",
                background: c.maiz, color: c.grano, fontSize: 10.5, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "4px 10px", borderRadius: 999,
              }}
            >
              Producto estrella
            </span>
            <div style={{ fontFamily: pareja.display, fontSize: 19, color: c.grano, marginTop: 8 }}>
              Maíz cacahuazintle
            </div>
            <div style={{ fontFamily: pareja.body, fontSize: 13.5, color: c.granoSoft, marginTop: 2 }}>
              Grande, blanco, perfecto para pozole.
            </div>
          </div>

          <span
            style={{
              fontFamily: pareja.body, fontSize: 14, fontWeight: 500,
              color: c.cremaLight, background: c.terracota,
              padding: "10px 20px", borderRadius: 999, whiteSpace: "nowrap",
            }}
          >
            Pedir →
          </span>
        </div>
      </div>
    </div>
  );
}
