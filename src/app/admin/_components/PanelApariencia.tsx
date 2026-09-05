"use client";

import { useRef, useState } from "react";
import { C, esp, radio, campo, etiqueta, botonSuave } from "./ui";
import { Bloque } from "./campos";
import type { Site } from "./PanelesSitio";
import {
  GRUPOS_COLOR, PAREJAS, PAREJA_OMISION, COLORES, temaCompleto,
  avisosDeContraste, type DefColor,
} from "@/lib/tema";

type Props = { site: Site; set: (f: (s: Site) => Site) => void };

export default function PanelApariencia({ site, set }: Props) {
  const tema = temaCompleto(site.theme);
  const pareja = PAREJAS[tema.fuente] ?? PAREJAS[PAREJA_OMISION];

  /** Qué color se está señalando en el mapa. null = se ven todos. */
  const [resaltado, setResaltado] = useState<string | null>(null);
  const mapa = useRef<HTMLDivElement>(null);

  const señalar = (clave: string) => {
    const nuevo = resaltado === clave ? null : clave;
    setResaltado(nuevo);
    // En celular el mapa no se queda pegado arriba, así que hay que subir a él
    // o el resaltado ocurre fuera de la pantalla.
    if (nuevo && window.innerWidth <= 900) {
      mapa.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
      <div ref={mapa} className="admin-mapa">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <span style={{ ...etiqueta, marginBottom: esp.xs }}>Tu sitio en chiquito</span>
          {resaltado ? (
            <button
              type="button"
              onClick={() => setResaltado(null)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, color: C.accion, textDecoration: "underline",
              }}
            >
              Ver todo otra vez
            </button>
          ) : (
            <span style={{ fontSize: 13, color: C.marronClaro }}>
              Toca un color de abajo para ver qué pinta
            </span>
          )}
        </div>

        <Mapa tema={tema} pareja={pareja} resaltado={resaltado} />
      </div>

      {GRUPOS_COLOR.map((g) => (
        <Bloque key={g.titulo} titulo={g.titulo} nota={g.nota}>
          {g.colores.map((c) => (
            <FilaColor
              key={c.clave}
              def={c}
              valor={tema.colores[c.clave]}
              propio={(site.theme?.colores?.[c.clave] ?? "").trim() !== ""}
              avisos={avisosDeContraste(c.clave, tema.colores)}
              señalado={resaltado === c.clave}
              onSeñalar={() => señalar(c.clave)}
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
      </div>

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
                  textAlign: "left", padding: "14px 16px", borderRadius: radio.medio,
                  border: `2px solid ${activa ? C.accion : C.lineaSuave}`,
                  background: activa ? C.papelHueso : "#fff",
                  cursor: "pointer", fontFamily: "inherit", display: "grid", gap: 6,
                }}
              >
                <span style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15.5, fontWeight: activa ? 600 : 500, color: C.tinta }}>
                    {p.nombre}
                  </span>
                  {clave === PAREJA_OMISION && (
                    <span style={{ fontSize: 11, color: C.gris, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      la de hoy
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
    </>
  );
}

/* ───────────────────────── UNA FILA DE COLOR ───────────────────────── */

function FilaColor({
  def, valor, propio, avisos, señalado, onSeñalar, onChange,
}: {
  def: DefColor; valor: string; propio: boolean;
  avisos: { que: string; razon: number; grave: boolean }[];
  señalado: boolean; onSeñalar: () => void; onChange: (v: string) => void;
}) {
  const grave = avisos.some((a) => a.grave);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 10px 10px 8px", marginBottom: 4,
        borderRadius: radio.medio, flexWrap: "wrap",
        background: señalado ? C.papelHueso : "transparent",
        border: `1.5px solid ${señalado ? C.accion : "transparent"}`,
        borderBottomColor: señalado ? C.accion : C.lineaSuave,
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

      {/* Pulsar el nombre señala el color en el mapa de arriba: es la única
          forma de que "naranja fuerte" signifique algo concreto. */}
      <button
        type="button"
        onClick={onSeñalar}
        aria-pressed={señalado}
        style={{
          flex: 1, minWidth: 170, textAlign: "left", background: "none",
          border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <span style={{ display: "block", fontSize: 15, color: C.tinta, fontWeight: 500 }}>
          {def.nombre}
        </span>
        <span style={{ display: "block", fontSize: 13, color: C.marronClaro, marginTop: 1, lineHeight: 1.4 }}>
          {def.donde}
        </span>
        <span
          style={{
            display: "inline-block", marginTop: 4, fontSize: 12.5,
            color: señalado ? C.accion : C.marron, textDecoration: "underline",
          }}
        >
          {señalado ? "◂ señalado arriba" : "¿Dónde se ve?"}
        </span>
      </button>

      <input
        value={valor}
        onChange={(e) => {
          const v = e.target.value.trim();
          onChange(v.startsWith("#") ? v.toUpperCase() : "#" + v.toUpperCase());
        }}
        spellCheck={false}
        aria-label={`${def.nombre}, código de color`}
        style={{
          ...campo, width: 106, flexShrink: 0,
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

      {/* Aviso de lectura. Va aquí y no escondido en una ayuda porque el daño
          es invisible desde el panel: se elige un color bonito y el texto de la
          página deja de leerse sin que nada lo indique. */}
      {avisos.length > 0 && (
        <div
          role="alert"
          style={{
            flexBasis: "100%",
            marginTop: 4,
            padding: "9px 12px",
            borderRadius: radio.chico,
            background: grave ? "#fdf0ee" : "#fdf6e8",
            border: `1px solid ${grave ? C.error : "#d8a54a"}55`,
            fontSize: 13,
            lineHeight: 1.45,
            color: grave ? C.error : "#8a6212",
          }}
        >
          <strong style={{ fontWeight: 600 }}>
            {grave ? "Con este color no se lee: " : "Cuesta leer: "}
          </strong>
          {avisos.map((a, i) => (
            <span key={a.que}>
              {i > 0 && " · "}
              {a.que} <span style={{ opacity: 0.75 }}>({a.razon.toFixed(1)} de 4.5)</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── EL MAPA ───────────────────────── */

/**
 * La página entera en miniatura, pintada con los colores elegidos.
 *
 * Existe porque una lista de códigos no dice nada: "#B8542E — botones y ligas"
 * no deja ver que ese mismo color es TAMBIÉN el fondo naranja completo de la
 * franja "Ven al molino". Aquí se señala y se entiende de un vistazo.
 *
 * Al señalar un color, lo que ese color NO pinta se apaga, y lo que sí pinta
 * queda con un cerco blanco y negro — que se ve tanto sobre el crema como
 * sobre las franjas oscuras.
 */
function Mapa({
  tema, pareja, resaltado,
}: {
  tema: ReturnType<typeof temaCompleto>;
  pareja: (typeof PAREJAS)[string];
  resaltado: string | null;
}) {
  const c = tema.colores;
  const activas = resaltado
    ? new Set(COLORES.find((x) => x.clave === resaltado)?.zonas ?? [])
    : null;

  /** Estilo de resaltado o de apagado, según la zona. */
  const z = (id: string): React.CSSProperties => {
    if (!activas) return {};
    return activas.has(id)
      ? { boxShadow: "0 0 0 2px #fff, 0 0 0 4px #1a1205", borderRadius: 3, position: "relative", zIndex: 2 }
      : { opacity: 0.2 };
  };

  const mono = "ui-monospace, monospace";

  return (
    <div
      style={{
        border: `1.5px solid ${C.lineaSuave}`, borderRadius: radio.grande,
        overflow: "hidden", background: c.cremaLight,
      }}
    >
      {/* ─── barra de arriba ─── */}
      <div
        style={{
          background: c.crema, padding: "7px 10px", display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: 8,
          ...z("nav"),
        }}
      >
        <span style={{ fontFamily: pareja.display, fontSize: 10, color: c.grano, ...z("navTexto") }}>
          Molino la Gran Jalisciense
        </span>
        <span
          style={{
            background: c.franjaOscura, fontFamily: pareja.body,
            fontSize: 7.5, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap",
            ...z("botonNav"),
          }}
        >
          <span style={{ color: c.textoClaro, ...z("textoBotonNav") }}>Pedir por WhatsApp</span>
        </span>
      </div>

      {/* ─── portada ─── */}
      <div style={{ background: c.cremaLight, padding: "14px 12px", ...z("fondo") }}>
        <div style={{ fontFamily: pareja.display, fontSize: 19, lineHeight: 1.1, color: c.grano, ...z("tituloPortada") }}>
          Maíz cacahuazintle
        </div>
        <div style={{ fontFamily: pareja.body, fontSize: 8.5, lineHeight: 1.5, color: c.granoSoft, marginTop: 5, maxWidth: "44ch", ...z("parrafoPortada") }}>
          Desde hace casi cien años en la colonia Juárez molemos maíz y harinas
          para las cocinas que toman en serio el pozole.
        </div>
        <span
          style={{
            display: "inline-block", marginTop: 8, background: c.terracota,
            color: c.cremaLight, fontFamily: pareja.body, fontSize: 8,
            padding: "5px 12px", borderRadius: 999, ...z("botonPortada"),
          }}
        >
          Pedir por WhatsApp
        </span>
      </div>

      {/* ─── catálogo ─── */}
      <div style={{ background: c.cremaLight, padding: "0 12px 14px" }}>
        <div style={{ fontFamily: pareja.display, fontSize: 12, color: c.grano, ...z("tituloCatalogo") }}>
          Lo que sale del molino
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 7 }}>
          {["Maíz cacahuazintle", "Masa para tortillas"].map((n) => (
            <div
              key={n}
              style={{
                flex: 1, background: c.crema, borderRadius: 5, padding: "7px 8px",
                ...z("tarjetaProducto"),
              }}
            >
              <span
                style={{
                  display: "inline-block", background: c.maiz, color: c.grano,
                  fontFamily: pareja.body, fontSize: 6, fontWeight: 600,
                  padding: "2px 6px", borderRadius: 999, ...z("etiquetaProducto"),
                }}
              >
                PRODUCTO ESTRELLA
              </span>
              <div style={{ fontFamily: pareja.display, fontSize: 9.5, color: c.grano, marginTop: 4, ...z("tituloCatalogo") }}>
                {n}
              </div>
              <div style={{ fontFamily: pareja.body, fontSize: 7.5, color: c.granoSoft, marginTop: 2, ...z("parrafoProducto") }}>
                Grande, blanco, para pozole.
              </div>
              <div style={{ borderTop: `1px dashed ${c.linea}`, marginTop: 6, paddingTop: 4, display: "flex", justifyContent: "space-between", ...z("bordes") }}>
                <span style={{ fontFamily: mono, fontSize: 6.5, color: c.granoSoft, ...z("parrafoProducto") }}>POR KILO</span>
                <span style={{ fontFamily: pareja.body, fontSize: 7, color: c.terracota, ...z("pedir") }}>Pedir →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── franja de historia (también oscura) ─── */}
      <div style={{ background: c.franjaOscura, padding: "13px 12px", display: "flex", gap: 10, ...z("historia") }}>
        <div style={{ width: 52, height: 66, borderRadius: 4, background: "rgba(245,237,224,0.14)", flexShrink: 0, ...z("textoHistoria") }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: mono, fontSize: 6.5, letterSpacing: "0.18em", color: c.maiz, ...z("kickerHistoria") }}>
            03 · HISTORIA
          </div>
          <div style={{ fontFamily: pareja.display, fontSize: 13, color: c.textoClaro, marginTop: 3, ...z("textoHistoria") }}>
            Cuatro generaciones en la colonia Juárez.
          </div>
          <div style={{ fontFamily: pareja.body, fontSize: 7.5, color: c.linea, marginTop: 4, lineHeight: 1.5, ...z("parrafoHistoria") }}>
            El Molino abrió sus puertas en 1930 en Abraham González 143.
          </div>
          <div style={{ borderLeft: `2px solid ${c.terracota}`, paddingLeft: 7, marginTop: 6, ...z("citaHistoria") }}>
            <span style={{ fontFamily: pareja.display, fontSize: 9, fontStyle: "italic", color: c.textoClaro, ...z("textoHistoria") }}>
              “Aquí el maíz se huele antes de verse.”
            </span>
          </div>
        </div>
      </div>

      {/* ─── franja de recetas (la oscura) ─── */}
      <div style={{ background: c.franjaOscura, padding: "13px 12px", ...z("recetas") }}>
        <div style={{ fontFamily: mono, fontSize: 6.5, letterSpacing: "0.18em", color: c.maiz, ...z("kickerRecetas") }}>
          04 · RECETAS Y NOTICIAS
        </div>
        <div style={{ fontFamily: pareja.display, fontSize: 14, color: c.textoClaro, marginTop: 4, ...z("textoRecetas") }}>
          Cómo se usa bien nuestro maíz
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: i === 0 ? 2 : 1, height: 34, borderRadius: 4,
                background: "rgba(245,237,224,0.14)", ...z("textoRecetas"),
              }}
            />
          ))}
        </div>
      </div>

      {/* ─── testimonios ─── */}
      <div style={{ background: c.crema, padding: "11px 12px", ...z("franjaTestimonios") }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1, background: c.cremaLight, border: `1px solid ${c.linea}`,
                borderRadius: 5, padding: "6px 7px", ...z("tarjetaTestimonio"),
              }}
            >
              <div style={{ fontSize: 7, color: c.maiz, letterSpacing: "0.1em", ...z("estrellas") }}>★★★★★</div>
              <div style={{ fontFamily: pareja.body, fontSize: 7, color: c.granoSoft, marginTop: 3, lineHeight: 1.45, ...z("parrafoProducto") }}>
                Vengo cada diciembre desde hace veinte años.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── franja visítanos (la naranja) ─── */}
      <div style={{ background: c.franjaOscura, padding: "13px 12px", ...z("visita") }}>
        <div style={{ fontFamily: pareja.display, fontSize: 15, color: c.textoClaro, ...z("textoVisita") }}>
          Ven al molino.
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 7 }}>
          <span
            style={{
              width: 13, height: 13, borderRadius: "50%", background: c.maiz,
              color: c.grano, fontSize: 8, display: "grid", placeItems: "center",
              flexShrink: 0, fontWeight: 700, ...z("avisoVisita"),
            }}
          >
            !
          </span>
          <span style={{ fontFamily: pareja.body, fontSize: 7.5, color: c.textoClaro, lineHeight: 1.5, ...z("textoVisita") }}>
            Un solo local, sin sucursales. Abraham González 143, colonia Juárez.
          </span>
        </div>
      </div>

      {/* ─── pie ─── */}
      <div style={{ background: c.pieFondo, padding: "10px 12px", ...z("pie") }}>
        <span style={{ fontFamily: mono, fontSize: 6.5, color: c.textoClaro, opacity: 0.85, ...z("textoPie") }}>
          © 2026 MOLINO LA GRAN JALISCIENSE
        </span>
      </div>
    </div>
  );
}
