"use client";

import { useState } from "react";
import { C, esp, radio, tarjeta, botonSuave } from "./ui";
import { CampoBilingue, CampoArea, CampoLista, Bloque, type Bilingue } from "./campos";
import CampoImagen from "./CampoImagen";
import CampoVideo from "./CampoVideo";
import BotonEliminar from "./BotonEliminar";
import { CabeceraSeccion } from "./Armazon";
import { useArchivo, useAvisoSinGuardar } from "./useArchivo";
import { recetaNueva } from "@/lib/nuevosItems";

type Idioma = { intro: string; ingredients: string[]; steps: string[]; tip: string };

export type Recipe = {
  slug: string;
  kicker: Bilingue;
  title: Bilingue;
  body: Bilingue;
  date: Bilingue;
  cta: Bilingue;
  image: string;
  video?: string;
  fullContent: { es: Idioma; en: Idioma };
};

function Ficha({
  receta, indice, onChange, onDelete,
}: {
  receta: Recipe; indice: number;
  onChange: (r: Recipe) => void; onDelete: () => void;
}) {
  const [abierta, setAbierta] = useState(false);
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  const set = (c: keyof Recipe, v: unknown) => onChange({ ...receta, [c]: v });
  const setLargo = (l: "es" | "en", c: keyof Idioma, v: string | string[]) =>
    onChange({
      ...receta,
      fullContent: { ...receta.fullContent, [l]: { ...receta.fullContent[l], [c]: v } },
    });

  return (
    <div style={{ ...tarjeta, marginBottom: esp.sm }}>
      <button
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        style={{
          width: "100%", padding: "15px 18px", background: abierta ? C.papelHueso : C.papelClaro,
          border: "none", cursor: "pointer", display: "flex", gap: 12,
          justifyContent: "space-between", alignItems: "center", textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
          <span
            style={{
              width: 44, height: 44, borderRadius: 8, flexShrink: 0, overflow: "hidden",
              background: C.papelTenue, display: "grid", placeItems: "center",
            }}
          >
            {receta.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={receta.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : receta.video ? (
              <span style={{ fontSize: 17 }}>&#127909;</span>
            ) : (
              <span style={{ fontSize: 17, color: C.accionApagada }}>&#128247;</span>
            )}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ fontSize: 10.5, color: C.marron, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
              {String(indice + 1).padStart(2, "0")}
              {receta.kicker.es ? " · " + receta.kicker.es : ""}
            </span>
            <span style={{ fontSize: 15.5, color: C.tinta, fontWeight: 500, display: "block", marginTop: 1 }}>
              {receta.title.es || "Sin título"}
            </span>
          </span>
        </span>
        <span style={{ fontSize: 13, color: C.marron, flexShrink: 0 }}>
          {abierta ? "Cerrar ▲" : "Abrir ▼"}
        </span>
      </button>

      {abierta && (
        <div style={{ padding: "22px 18px", background: "#fff", borderTop: `1px solid ${C.lineaSuave}` }}>
          <Bloque titulo="La tarjeta" nota="Lo que se ve sin abrir la entrada">
            <CampoBilingue rotulo="Etiqueta de arriba" nota="Por ejemplo: Receta · 30 min" valor={receta.kicker} onChange={(v) => set("kicker", v)} />
            <CampoBilingue rotulo="Título" valor={receta.title} onChange={(v) => set("title", v)} />
            <CampoBilingue rotulo="Resumen" valor={receta.body} onChange={(v) => set("body", v)} largo filas={2} />
            <CampoBilingue rotulo="Fecha" valor={receta.date} onChange={(v) => set("date", v)} />
            <CampoBilingue rotulo="Texto del botón" valor={receta.cta} onChange={(v) => set("cta", v)} />
          </Bloque>

          <Bloque titulo="La imagen" nota="Si pones video, se usa el video en lugar de la foto">
            <CampoImagen etiqueta="Foto" valor={receta.image} onChange={(v) => set("image", v)} />
            <CampoVideo etiqueta="Video (opcional)" valor={receta.video ?? ""} onChange={(v) => set("video", v)} />
          </Bloque>

          <Bloque titulo="El contenido completo" nota="Lo que aparece al abrir la entrada">
            <div style={{ display: "flex", gap: 8, marginBottom: esp.md }}>
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setIdioma(l)}
                  style={{
                    ...botonSuave,
                    borderColor: idioma === l ? C.accion : C.linea,
                    background: idioma === l ? C.accion : "transparent",
                    color: idioma === l ? C.papel : C.marron,
                    fontWeight: idioma === l ? 500 : 400,
                  }}
                >
                  {l === "es" ? "Español" : "English"}
                </button>
              ))}
            </div>

            <CampoArea rotulo="Introducción" valor={receta.fullContent[idioma].intro} onChange={(v) => setLargo(idioma, "intro", v)} filas={3} />
            <CampoLista rotulo="Ingredientes" valor={receta.fullContent[idioma].ingredients} onChange={(v) => setLargo(idioma, "ingredients", v)} />
            <CampoLista rotulo="Pasos" valor={receta.fullContent[idioma].steps} onChange={(v) => setLargo(idioma, "steps", v)} />
            <CampoArea rotulo="Consejo del molino" valor={receta.fullContent[idioma].tip} onChange={(v) => setLargo(idioma, "tip", v)} filas={2} />
          </Bloque>

          <div style={{ borderTop: `1px solid ${C.lineaSuave}`, paddingTop: esp.md }}>
            <BotonEliminar que="entrada" onDelete={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanelRecetas({ titulo, explicacion }: { titulo: string; explicacion: string }) {
  const a = useArchivo<Recipe[]>("recipes", "recipes");
  useAvisoSinGuardar(a.sucio);
  const recetas = a.datos ?? [];

  return (
    <>
      <CabeceraSeccion
        titulo={titulo}
        explicacion={explicacion}
        sucio={a.sucio}
        guardando={a.guardando}
        cargando={a.cargando}
        msg={a.msg}
        error={a.error}
        onGuardar={a.guardar}
      />

      {a.cargando ? (
        <div style={{ textAlign: "center", color: C.marron, padding: esp.xl, fontSize: 14 }}>Cargando…</div>
      ) : (
        <>
          {recetas.map((r, i) => (
            <Ficha
              key={r.slug}
              receta={r}
              indice={i}
              onChange={(nueva) => a.cambiar((prev) => prev.map((x, j) => (j === i ? nueva : x)))}
              onDelete={() => a.cambiar((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => a.cambiar((prev) => [...prev, recetaNueva(prev.map((x) => x.slug))])}
            style={{
              width: "100%", padding: 15, borderRadius: radio.grande,
              border: `1.5px dashed ${C.accionApagada}`, background: "transparent",
              color: C.marron, fontSize: 14.5, cursor: "pointer", marginTop: esp.xs,
              fontFamily: "inherit",
            }}
          >
            + Agregar receta o noticia
          </button>
        </>
      )}
    </>
  );
}
