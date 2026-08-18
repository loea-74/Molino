"use client";

import { useState } from "react";
import { C, esp, radio, tarjeta } from "./ui";
import { CampoTexto, CampoBilingue, type Bilingue } from "./campos";
import BotonEliminar from "./BotonEliminar";
import { CabeceraSeccion } from "./Armazon";
import { useArchivo, useAvisoSinGuardar } from "./useArchivo";

export type Testimonial = {
  quote: Bilingue;
  name: string;
  meta: Bilingue;
};

function testimonioNuevo(): Testimonial {
  return { quote: { es: "", en: "" }, name: "", meta: { es: "", en: "" } };
}

function Ficha({
  t, indice, onChange, onDelete,
}: {
  t: Testimonial; indice: number;
  onChange: (v: Testimonial) => void; onDelete: () => void;
}) {
  const [abierta, setAbierta] = useState(false);

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
            <BotonEliminar que="testimonio" onDelete={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanelTestimonios({ titulo, explicacion }: { titulo: string; explicacion: string }) {
  const a = useArchivo<Testimonial[]>("testimonials", "testimonials");
  useAvisoSinGuardar(a.sucio);
  const items = a.datos ?? [];

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
          {items.map((t, i) => (
            <Ficha
              key={i}
              t={t}
              indice={i}
              onChange={(v) => a.cambiar((prev) => prev.map((x, j) => (j === i ? v : x)))}
              onDelete={() => a.cambiar((prev) => prev.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => a.cambiar((prev) => [...prev, testimonioNuevo()])}
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
      )}
    </>
  );
}
