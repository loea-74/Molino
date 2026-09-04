"use client";

import { useState } from "react";
import { C, esp, radio, campo, etiqueta, tarjeta } from "./ui";
import { CampoTexto, CampoBilingue, Bloque, type Bilingue } from "./campos";
import CampoImagen from "./CampoImagen";
import BotonEliminar from "./BotonEliminar";
import BotonesOrden, { moverEnLista } from "./BotonesOrden";
import { BloqueEncabezado, type Site } from "./PanelesSitio";
import { productoNuevo } from "@/lib/nuevosItems";

export type Product = {
  slug: string;
  name: Bilingue;
  tag: Bilingue;
  description: Bilingue;
  unit: Bilingue;
  price: number | null;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
};

function Ficha({
  producto, indice, total, onChange, onDelete, onMover,
}: {
  producto: Product; indice: number; total: number;
  onChange: (p: Product) => void; onDelete: () => void;
  onMover: (destino: number) => void;
}) {
  const [abierta, setAbierta] = useState(false);
  const set = (c: keyof Product, v: unknown) => onChange({ ...producto, [c]: v });

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
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        style={{
          flex: 1, minWidth: 0, padding: "15px 18px", background: "transparent",
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
            {producto.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={producto.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 17, color: C.accionApagada }}>&#128247;</span>
            )}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ fontSize: 10.5, color: C.marron, letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
              {String(indice + 1).padStart(2, "0")}
              {producto.tag.es ? " · " + producto.tag.es : ""}
            </span>
            <span style={{ fontSize: 15.5, color: C.tinta, fontWeight: 500, display: "block", marginTop: 1 }}>
              {producto.name.es || "Sin nombre"}
            </span>
          </span>
        </span>
        <span style={{ fontSize: 13, color: C.marron, flexShrink: 0 }}>
          {abierta ? "Cerrar ▲" : "Abrir ▼"}
        </span>
      </button>

        <BotonesOrden indice={indice} total={total} onMover={onMover} que="este producto" />
      </div>

      {abierta && (
        <div style={{ padding: "22px 18px", background: "#fff", borderTop: `1px solid ${C.lineaSuave}` }}>
          <Bloque titulo="Qué es">
            <CampoBilingue rotulo="Nombre" valor={producto.name} onChange={(v) => set("name", v)} />
            <CampoBilingue rotulo="Etiqueta" nota="El distintivo chico sobre la tarjeta. Por ejemplo: Producto estrella." valor={producto.tag} onChange={(v) => set("tag", v)} />
            <CampoBilingue rotulo="Descripción" valor={producto.description} onChange={(v) => set("description", v)} largo filas={2} />
          </Bloque>

          <Bloque titulo="Cómo se vende">
            <CampoBilingue rotulo="Unidad" nota="Por ejemplo: por kilo." valor={producto.unit} onChange={(v) => set("unit", v)} />
            <div style={{ marginBottom: esp.md }}>
              <span style={etiqueta}>Precio</span>
              <div style={{ fontSize: 12, color: C.marronClaro, marginBottom: esp.xs }}>
                Déjalo vacío y en la página dirá que se consulte.
              </div>
              <input
                type="number"
                inputMode="numeric"
                value={producto.price ?? ""}
                onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="98"
                style={{ ...campo, maxWidth: 170 }}
              />
            </div>
            <CampoTexto
              rotulo="Mensaje de WhatsApp"
              nota="Lo que se escribe solo cuando alguien pulsa Pedir en este producto."
              valor={producto.whatsappMessage}
              onChange={(v) => set("whatsappMessage", v)}
            />
          </Bloque>

          <Bloque titulo="La foto">
            <CampoImagen etiqueta="Foto del producto" valor={producto.image} onChange={(v) => set("image", v)} />
            <CampoTexto
              rotulo="Descripción de la foto"
              nota="Para quien no puede verla: lectores de pantalla y buscadores."
              valor={producto.imageAlt}
              onChange={(v) => set("imageAlt", v)}
            />
          </Bloque>

          <div style={{ borderTop: `1px solid ${C.lineaSuave}`, paddingTop: esp.md }}>
            <BotonEliminar que="este producto" onDelete={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanelCatalogo({
  datos, cambiar, site, setSite,
}: {
  datos: Product[];
  cambiar: (f: (prev: Product[]) => Product[]) => void;
  site: Site | null;
  setSite: (f: (s: Site) => Site) => void;
}) {
  return (
    <>
      {site && <BloqueEncabezado site={site} set={setSite} seccion="catalogo" />}

      {datos.map((p, i) => (
        <Ficha
          key={p.slug}
          producto={p}
          indice={i}
          total={datos.length}
          onChange={(nuevo) => cambiar((prev) => prev.map((x, j) => (j === i ? nuevo : x)))}
          onDelete={() => cambiar((prev) => prev.filter((_, j) => j !== i))}
          onMover={(destino) => cambiar((prev) => moverEnLista(prev, i, destino))}
        />
      ))}
      <button
        type="button"
        onClick={() => cambiar((prev) => [...prev, productoNuevo(prev.map((x) => x.slug))])}
        style={{
          width: "100%", padding: 15, borderRadius: radio.grande,
          border: `1.5px dashed ${C.accionApagada}`, background: "transparent",
          color: C.marron, fontSize: 14.5, cursor: "pointer", marginTop: esp.xs,
          fontFamily: "inherit",
        }}
      >
        + Agregar producto
      </button>
    </>
  );
}
