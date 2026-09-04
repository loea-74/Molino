"use client";

import { useState } from "react";
import { C, esp, radio, tarjeta } from "./ui";
import { CampoTexto, CampoBilingue, type Bilingue } from "./campos";
import BotonEliminar from "./BotonEliminar";
import BotonesOrden, { moverEnLista } from "./BotonesOrden";
import { BloqueEncabezado, type Site } from "./PanelesSitio";

export type Testimonial = {
  quote: Bilingue;
  name: string;
  meta: Bilingue;
};

function testimonioNuevo(): Testimonial {
  return { quote: { es: "", en: "" }, name: "", meta: { es: "", en: "" } };
}

function Ficha({
  t, indice, total, abierta, onAbrir, onChange, onDelete, onMover,
}: {
  t: Testimonial; indice: number; total: number;
  abierta: boolean; onAbrir: () => void;
  onChange: (v: Testimonial) => void; onDelete: () => void;
  onMover: (destino: number) => void;
}) {

  return (
    <div style={{ ...tarjeta, marginBottom: esp.sm }}>
      {/* La fila entera era un <button>; los de ordenar no pueden ir dentro de
          otro botón, así que ahora son hermanos dentro de un contenedor. */}
      <div
        style={{
          display: "flex", alignItems: "center",
          background: abierta ? C.papelHueso : C.papelClaro,
        }}
      >
      <button
        onClick={onAbrir}
        aria-expanded={abierta}
        style={{
          flex: 1, minWidth: 0, padding: "15px 18px", background: "transparent",
          border: "none", cursor: "pointer", display: "flex", gap: 12,
          justifyContent: "space-between", alignItems: "center", textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <span style={{ minWidth: 0 }}>
          <span style={{ fontSize: 10.5, color: C.marron, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
            {String(indice + 1).padStart(2, "0")} · Testimonio
          </span>
          <span style={{ fontSize: 15.5, color: C.tinta, fontWeight: 500, display: "block", marginTop: 1 }}>
            {t.name || "Sin nombre"}
          </span>
        </span>
        <span style={{ fontSize: 13, color: C.marron, flexShrink: 0 }}>
          {abierta ? "Cerrar ▲" : "Abrir ▼"}
        </span>
      </button>

        <BotonesOrden indice={indice} total={total} onMover={onMover} que="este testimonio" />
      </div>

      {abierta && (
        <div style={{ padding: "22px 18px", background: "#fff", borderTop: `1px solid ${C.lineaSuave}` }}>
          <CampoBilingue rotulo="Lo que dijo" valor={t.quote} onChange={(v) => onChange({ ...t, quote: v })} largo filas={3} />
          <CampoTexto rotulo="Nombre" valor={t.name} onChange={(v) => onChange({ ...t, name: v })} />
          <CampoBilingue
            rotulo="Quién es"
            nota="Una línea corta debajo del nombre. Por ejemplo: Clienta desde 1998."
            valor={t.meta}
            onChange={(v) => onChange({ ...t, meta: v })}
          />

          <div style={{ borderTop: `1px solid ${C.lineaSuave}`, paddingTop: esp.md, marginTop: esp.xs }}>
            <BotonEliminar que="este testimonio" onDelete={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanelTestimonios({
  datos, cambiar, site, setSite,
}: {
  datos: Testimonial[];
  cambiar: (f: (prev: Testimonial[]) => Testimonial[]) => void;
  site: Site | null;
  setSite: (f: (s: Site) => Site) => void;
}) {
  const [abiertaIdx, setAbiertaIdx] = useState<number | null>(null);

  function mover(de: number, a: number) {
    cambiar((prev) => moverEnLista(prev, de, a));
    // Los botones sólo intercambian con el vecino, así que la tarjeta abierta
    // sigue siendo la misma: basta con cambiarle el número.
    setAbiertaIdx((ab) => (ab === de ? a : ab === a ? de : ab));
  }

  return (
    <>
      {site && <BloqueEncabezado site={site} set={setSite} seccion="testimonios" />}

      {datos.map((t, i) => (
        <Ficha
          key={i}
          t={t}
          indice={i}
          total={datos.length}
          abierta={abiertaIdx === i}
          onAbrir={() => setAbiertaIdx(abiertaIdx === i ? null : i)}
          onChange={(v) => cambiar((prev) => prev.map((x, j) => (j === i ? v : x)))}
          onDelete={() => {
            cambiar((prev) => prev.filter((_, j) => j !== i));
            setAbiertaIdx(null);
          }}
          onMover={(destino) => mover(i, destino)}
        />
      ))}
      <button
        type="button"
        onClick={() => cambiar((prev) => [...prev, testimonioNuevo()])}
        style={{
          width: "100%", padding: 15, borderRadius: radio.grande,
          border: `1.5px dashed ${C.accionApagada}`, background: "transparent",
          color: C.marron, fontSize: 14.5, cursor: "pointer", marginTop: esp.xs,
          fontFamily: "inherit",
        }}
      >
        + Agregar testimonio
      </button>
    </>
  );
}
