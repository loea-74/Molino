"use client";

import { C, esp, radio, botonPrincipal } from "./ui";

export type Seccion = {
  id: string;
  nombre: string;
  donde: string; // dónde se ve en el sitio — la pista más útil para quien edita
};

export function BarraSuperior({ onSalir }: { onSalir: () => void }) {
  return (
    <div
      style={{
        background: C.tinta,
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: C.papel, lineHeight: 1.2 }}>
          Molino la Gran Jalisciense
        </div>
        <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.dorado, marginTop: 2 }}>
          Panel de administración
        </div>
      </div>
      <button
        onClick={onSalir}
        style={{
          fontSize: 12, color: C.dorado, background: "none",
          border: `1px solid ${C.borde}`, padding: "7px 15px",
          borderRadius: radio.pastilla, cursor: "pointer", whiteSpace: "nowrap",
          fontFamily: "inherit",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

/**
 * Menú plano. Antes había cuatro pestañas y, dentro de una de ellas, otras
 * cinco: "Historia" quedaba enterrada bajo "Secciones" y había que saber que
 * Recetas era de primer nivel pero Historia no. Ahora el orden del menú es el
 * mismo que el de la página, y cada entrada dice dónde se ve.
 */
export function Menu({
  secciones, activa, onCambiar, sucios,
}: {
  secciones: Seccion[];
  activa: string;
  onCambiar: (id: string) => void;
  sucios: Record<string, boolean>;
}) {
  return (
    <nav className="admin-menu" aria-label="Secciones del sitio">
      {secciones.map((s, i) => {
        const on = s.id === activa;
        return (
          <button
            key={s.id}
            onClick={() => onCambiar(s.id)}
            aria-current={on ? "page" : undefined}
            className="admin-menu-item"
            style={{
              background: on ? C.papelHueso : "transparent",
              borderLeftColor: on ? C.accion : "transparent",
              color: on ? C.tinta : C.marron,
            }}
          >
            <span style={{ fontSize: 10, color: C.gris, fontVariantNumeric: "tabular-nums" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: on ? 600 : 400 }}>
                {s.nombre}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: C.marronClaro, marginTop: 1 }}>
                {s.donde}
              </span>
            </span>
            {sucios[s.id] && (
              <span
                title="Tiene cambios sin publicar"
                style={{ width: 7, height: 7, borderRadius: "50%", background: C.accion, flexShrink: 0 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/** Cabecera de la sección abierta, con el botón de publicar siempre a la vista. */
export function CabeceraSeccion({
  titulo, explicacion, sucio, guardando, cargando, msg, error, onGuardar,
}: {
  titulo: string; explicacion: string;
  sucio: boolean; guardando: boolean; cargando: boolean;
  msg: string; error: boolean; onGuardar: () => void;
}) {
  return (
    <div style={{ marginBottom: esp.lg }}>
      <div
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: esp.md, flexWrap: "wrap", marginBottom: esp.sm,
        }}
      >
        <div style={{ minWidth: 220, flex: 1 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, color: C.tinta, margin: 0 }}>
            {titulo}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.marronClaro, maxWidth: "56ch", lineHeight: 1.5 }}>
            {explicacion}
          </p>
        </div>
        <button
          onClick={onGuardar}
          disabled={guardando || cargando || !sucio}
          style={botonPrincipal(guardando || cargando || !sucio)}
        >
          {guardando ? "Publicando..." : sucio ? "Guardar y publicar" : "Sin cambios"}
        </button>
      </div>

      {msg && (
        <div
          role="status"
          style={{
            fontSize: 13.5, lineHeight: 1.5,
            color: error ? C.error : C.exito,
            background: error ? "#fdf0ee" : "#eef6ef",
            border: `1px solid ${error ? C.error : C.exito}33`,
            borderRadius: radio.chico, padding: "10px 13px", marginTop: esp.sm,
          }}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
