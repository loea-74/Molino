"use client";

import { useMemo, useRef, useState } from "react";
import { C, esp, radio, campo } from "./ui";
import { Bloque } from "./campos";
import { BloqueEncabezado, type Site } from "./PanelesSitio";

/**
 * El catálogo por categorías.
 *
 * Los productos salen del export del punto de venta, pero aquí se pueden
 * corregir uno a uno: el export los trae TODO EN MAYUSCULAS y sin acentos, y
 * la limpieza automática, por buena que sea, no acierta siempre — "PIÑON"
 * salía como "Piñon" hasta que alguien lo vio en la página.
 *
 * Se busca por nombre o por clave, porque son mil productos y bajar hasta el
 * que interesa no es una opción. Debajo de cada campo se enseña el nombre tal
 * como está en la caja, para no perder de vista de qué renglón se trata.
 */

export type Producto = { clave: string; nombre: string; oculto?: boolean; destacado?: boolean };
export type CategoriaCat = { clave: string; nombre: string; cuantos: number; productos: Producto[]; oculto?: boolean };
export type DepartamentoCat = { clave: string; nombre: string; categorias: CategoriaCat[]; oculto?: boolean };
export type Catalogo = {
  servicios: { nombre: string; nota: string }[];
  departamentos: DepartamentoCat[];
};

/** Sin acentos y en minúscula, para que "piñon" encuentre "Piñón". */
const plano = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const MAX_RESULTADOS = 40;

export default function PanelCatalogoCategorias({
  site, set, datos, cambiar,
}: {
  site: Site | null;
  set: (f: (s: Site) => Site) => void;
  datos: Catalogo | null;
  cambiar: (f: (prev: Catalogo) => Catalogo) => void;
}) {
  const [busca, setBusca] = useState("");

  // useMemo y no "?? []" a secas: ese array se crearía nuevo en cada render y
  // haría que la búsqueda entre mil productos se recalculara al teclear cada
  // letra, aunque el catálogo no hubiera cambiado.
  const deps = useMemo(() => datos?.departamentos ?? [], [datos]);
  const totales = useMemo(() => {
    let prod = 0, cats = 0, ocultos = 0;
    for (const d of deps)
      for (const c of d.categorias) {
        cats++;
        for (const p of c.productos) {
          prod++;
          if (p.oculto) ocultos++;
        }
      }
    return { prod, cats, ocultos, deps: deps.length };
  }, [deps]);

  /** Los productos que casan con la búsqueda, con su sitio en el árbol. */
  const encontrados = useMemo(() => {
    const q = plano(busca.trim());
    if (q.length < 2) return null;
    const out: { d: number; c: number; p: number; prod: Producto; donde: string }[] = [];
    deps.forEach((d, di) =>
      d.categorias.forEach((c, ci) =>
        c.productos.forEach((prod, pi) => {
          if (out.length >= MAX_RESULTADOS) return;
          if (plano(prod.nombre).includes(q) || prod.clave.includes(q)) {
            out.push({ d: di, c: ci, p: pi, prod, donde: `${d.nombre} · ${c.nombre}` });
          }
        })
      )
    );
    return out;
  }, [busca, deps]);

  function editarProducto(d: number, c: number, p: number, cambio: Partial<Producto>) {
    cambiar((prev) => {
      const copia = structuredClone(prev);
      Object.assign(copia.departamentos[d].categorias[c].productos[p], cambio);
      return copia;
    });
  }

  return (
    <>
      {site && <BloqueEncabezado site={site} set={set} seccion="catalogo" />}

      <Bloque titulo="Corregir un producto" nota="Busca por nombre o por clave">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Por ejemplo: piñon, aceite, 11012…"
          style={{ ...campo, fontSize: 16 }}
          aria-label="Buscar en el catálogo"
        />

        {busca.trim().length > 0 && busca.trim().length < 2 && (
          <div style={{ fontSize: 13, color: C.marronClaro, marginTop: esp.sm }}>
            Escribe al menos dos letras.
          </div>
        )}

        {encontrados && (
          <div style={{ marginTop: esp.md }}>
            <div style={{ fontSize: 13, color: C.marron, marginBottom: esp.sm }}>
              {encontrados.length === 0
                ? "Nada con ese nombre."
                : `${encontrados.length}${encontrados.length === MAX_RESULTADOS ? "+" : ""} resultado${encontrados.length === 1 ? "" : "s"}`}
            </div>

            {encontrados.map(({ d, c, p, prod, donde }) => (
              <div
                key={prod.clave + "-" + d + "-" + c + "-" + p}
                style={{
                  border: `1.5px solid ${prod.oculto ? C.lineaSuave : C.linea}`,
                  borderRadius: radio.medio, padding: "13px 15px", marginBottom: esp.sm,
                  background: prod.oculto ? C.papelTenue : "#fff",
                  opacity: prod.oculto ? 0.75 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: C.marron }}>{donde}</span>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: C.gris }}>
                    {prod.clave}
                  </span>
                </div>

                <input
                  value={prod.nombre}
                  onChange={(e) => editarProducto(d, c, p, { nombre: e.target.value })}
                  style={{ ...campo, fontSize: 15.5 }}
                  aria-label={`Nombre de ${prod.nombre}`}
                />

                <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 9, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: C.marron, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={!prod.oculto}
                      onChange={(e) => editarProducto(d, c, p, { oculto: !e.target.checked })}
                      style={{ width: 17, height: 17, accentColor: C.accion }}
                    />
                    Se ve en la página
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: C.marron, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={!!prod.destacado}
                      onChange={(e) => editarProducto(d, c, p, { destacado: e.target.checked })}
                      style={{ width: 17, height: 17, accentColor: C.accion }}
                    />
                    Sale de los primeros
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </Bloque>

      <Bloque titulo="Departamentos y categorías" nota="Lo que se enseña de cada uno">
        {deps.map((d, di) => (
          <div key={d.clave} style={{ marginBottom: esp.md }}>
            <label
              style={{
                display: "flex", alignItems: "center", gap: 9,
                paddingBottom: 7, borderBottom: `1px solid ${C.lineaSuave}`,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={!d.oculto}
                onChange={(e) =>
                  cambiar((prev) => {
                    const c = structuredClone(prev);
                    c.departamentos[di].oculto = !e.target.checked;
                    return c;
                  })
                }
                style={{ width: 18, height: 18, accentColor: C.accion }}
              />
              <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: d.oculto ? C.marronClaro : C.tinta }}>
                {d.nombre}
              </span>
              <span style={{ fontSize: 12.5, color: C.gris }}>
                {d.categorias.reduce((n, c) => n + c.productos.length, 0)} productos
              </span>
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
              {d.categorias.map((c, ci) => (
                <button
                  key={c.clave}
                  type="button"
                  onClick={() =>
                    cambiar((prev) => {
                      const copia = structuredClone(prev);
                      const cat = copia.departamentos[di].categorias[ci];
                      cat.oculto = !cat.oculto;
                      return copia;
                    })
                  }
                  aria-pressed={!c.oculto}
                  title={c.oculto ? "Oculta — pulsa para mostrarla" : "Se ve — pulsa para ocultarla"}
                  style={{
                    fontSize: 13, padding: "6px 12px", borderRadius: radio.pastilla,
                    border: `1.5px solid ${c.oculto ? C.lineaSuave : C.linea}`,
                    background: c.oculto ? "transparent" : C.papelHueso,
                    color: c.oculto ? C.marronClaro : C.tinta,
                    textDecoration: c.oculto ? "line-through" : "none",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {c.nombre}
                  <span style={{ color: C.gris, marginLeft: 6, fontSize: 11.5 }}>{c.productos.length}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </Bloque>

      <SubirExcel />

      <Bloque titulo="De dónde salen" nota="">
        <div
          style={{
            border: `1.5px solid ${C.lineaSuave}`, borderRadius: radio.medio,
            background: "#fff", padding: "16px 18px",
          }}
        >
          <div style={{ display: "flex", gap: esp.lg, flexWrap: "wrap", marginBottom: esp.sm }}>
            {[
              [totales.prod.toLocaleString("es-MX"), "productos"],
              [String(totales.cats), "categorías"],
              [String(totales.deps), "departamentos"],
              [String(totales.ocultos), "ocultos"],
            ].map(([n, q]) => (
              <div key={q}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: C.tinta, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: C.marronClaro, marginTop: 3 }}>{q}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: C.marron, margin: 0 }}>
            La lista sale del archivo de productos del punto de venta. Lo que
            corrijas aquí se conserva cuando llegue un archivo nuevo: se cruza
            por clave, no por nombre. De cada categoría se enseñan los primeros
            cinco y se cuenta el resto.
          </p>
        </div>
      </Bloque>
    </>
  );
}


/* ───────────────────── SUBIR EL ARCHIVO DE CONTROL ───────────────────── */

/**
 * Carga Catalogo_Control.xlsx y aplica de golpe lo que diga.
 *
 * Es el camino para cambios grandes — esconder una categoría entera, renombrar
 * cincuenta productos. Para arreglar una palabra suelta, el buscador de arriba
 * es más rápido que bajar el archivo, abrirlo y volver a subirlo.
 */
function SubirExcel() {
  const entrada = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<string>("");
  const [error, setError] = useState(false);

  async function enviar(file: File) {
    setSubiendo(true);
    setResultado("");
    setError(false);
    try {
      const body = new FormData();
      body.append("archivo", file);
      const res = await fetch("/api/admin/catalogo-excel", { method: "POST", body });
      const r = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(r.error ?? `Error ${res.status} al aplicar el archivo.`);

      const partes = [];
      if (r.renombrados) partes.push(`${r.renombrados} renombrados`);
      if (r.ocultados) partes.push(`${r.ocultados} ocultados`);
      if (r.mostrados) partes.push(`${r.mostrados} vueltos a mostrar`);
      setResultado(
        (partes.length ? `Aplicado: ${partes.join(", ")}.` : "El archivo no traía cambios.") +
        (r.sinCruzar ? ` ${r.sinCruzar} claves del archivo ya no existen en el catálogo y se ignoraron.` : "") +
        " Los cambios aparecerán en el sitio en aproximadamente un minuto."
      );
    } catch (e) {
      setError(true);
      setResultado(e instanceof Error ? e.message : "No se pudo aplicar el archivo.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <Bloque titulo="Cargar el archivo de control" nota="Para cambios grandes, de muchos productos a la vez">
      <div
        style={{
          border: `1.5px dashed ${C.accionApagada}`, borderRadius: radio.medio,
          background: C.papelClaro, padding: "18px 20px",
        }}
      >
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          disabled={subiendo}
          style={{
            padding: "11px 22px", borderRadius: radio.pastilla, border: "none",
            background: subiendo ? C.accionApagada : C.accion, color: C.papel,
            fontSize: 15, fontWeight: 500, cursor: subiendo ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {subiendo ? "Aplicando…" : "Elegir el archivo de Excel"}
        </button>

        <div style={{ fontSize: 13.5, color: C.marronClaro, marginTop: 10, lineHeight: 1.5 }}>
          El <strong style={{ fontWeight: 600 }}>Catalogo_Control.xlsx</strong> del
          proyecto. Se lee y se aplica; el archivo no se guarda. Los renglones se
          cruzan por su clave, así que renombrar un producto no lo despega de su
          sitio. Lo que dejes en blanco no cambia nada.
        </div>

        <input
          ref={entrada}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) enviar(f);
            e.target.value = "";
          }}
        />
      </div>

      {resultado && (
        <div
          role="status"
          style={{
            marginTop: esp.sm, padding: "11px 14px", borderRadius: radio.chico,
            fontSize: 13.5, lineHeight: 1.5,
            color: error ? C.error : C.exito,
            background: error ? "#fdf0ee" : "#eef6ef",
            border: `1px solid ${error ? C.error : C.exito}33`,
          }}
        >
          {resultado}
        </div>
      )}
    </Bloque>
  );
}
