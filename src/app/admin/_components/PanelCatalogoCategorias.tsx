"use client";

import { C, esp, radio } from "./ui";
import { Bloque } from "./campos";
import { BloqueEncabezado, type Site } from "./PanelesSitio";
import catalogo from "@/content/catalogo.json";

/**
 * El catálogo por categorías.
 *
 * Aquí sólo se editan los textos que lo rodean. Los productos NO se tocan desde
 * el panel: salen del export del punto de venta, que es la única fuente que
 * está al día. Editarlos aquí crearía dos verdades distintas.
 */
export default function PanelCatalogoCategorias({
  site, set,
}: {
  site: Site | null;
  set: (f: (s: Site) => Site) => void;
}) {
  const deps = catalogo.departamentos as { nombre: string; total: number; categorias: unknown[] }[];
  const total = deps.reduce((n, d) => n + d.total, 0);
  const cats = deps.reduce((n, d) => n + d.categorias.length, 0);

  return (
    <>
      {site && <BloqueEncabezado site={site} set={set} seccion="catalogo" />}

      <Bloque titulo="Los productos" nota="De dónde salen y cómo se actualizan">
        <div
          style={{
            border: `1.5px solid ${C.lineaSuave}`, borderRadius: radio.medio,
            background: "#fff", padding: "16px 18px", marginBottom: esp.md,
          }}
        >
          <div style={{ display: "flex", gap: esp.lg, flexWrap: "wrap", marginBottom: esp.sm }}>
            {[
              [total.toLocaleString("es-MX"), "productos"],
              [String(cats), "categorías"],
              [String(deps.length), "departamentos"],
            ].map(([n, q]) => (
              <div key={q}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 26, color: C.tinta, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: C.marronClaro, marginTop: 3 }}>{q}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: C.marron, margin: 0 }}>
            Esta lista sale del archivo de productos del punto de venta, no se
            escribe a mano. Cuando cambie el catálogo, manda el archivo nuevo y
            se vuelve a generar: así la página y la caja dicen lo mismo.
          </p>
        </div>

        <div style={{ fontSize: 13.5, color: C.marronClaro, lineHeight: 1.5 }}>
          De cada categoría se enseñan cinco productos y se cuenta el resto.
          No se muestran precios: los del punto de venta envejecen, y una página
          con precios viejos hace más daño que una sin ellos.
        </div>
      </Bloque>
    </>
  );
}
