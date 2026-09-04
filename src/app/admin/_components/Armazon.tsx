"use client";

import { C, esp, radio, botonPrincipal } from "./ui";

export type Seccion = {
  id: string;
  nombre: string;
  donde: string; // dónde se ve en el sitio — la pista más útil para quien edita
};

/* ───────────────────────── BARRA SUPERIOR ───────────────────────── */

export function BarraSuperior({
  onSalir, onMenu, seccionActiva,
}: {
  onSalir: () => void;
  onMenu: () => void;
  seccionActiva: string;
}) {
  return (
    <header className="admin-barra-superior">
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "Georgia, serif", fontSize: 17, color: C.papel,
            lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          Molino la Gran Jalisciense
        </div>
        <div
          style={{
            fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            color: C.dorado, marginTop: 2,
          }}
        >
          Panel de administración
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Ver el sitio: hasta ahora no había forma de llegar a la página desde
            el panel, y es lo primero que uno quiere hacer tras publicar. */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-oculto-movil"
          style={{
            fontSize: 12, color: C.dorado, textDecoration: "none",
            border: `1px solid ${C.borde}`, padding: "7px 15px",
            borderRadius: radio.pastilla, whiteSpace: "nowrap",
          }}
        >
          Ver el sitio ↗
        </a>
        <button onClick={onSalir} className="admin-oculto-movil" style={botonBarra}>
          Cerrar sesión
        </button>

        {/* En celular, todo lo anterior vive dentro del cajón del menú. */}
        <button
          onClick={onMenu}
          className="admin-solo-movil"
          aria-label="Abrir el menú de secciones"
          style={{
            alignItems: "center", gap: 9,
            background: "none", border: `1px solid ${C.borde}`,
            borderRadius: radio.pastilla, padding: "8px 14px",
            color: C.dorado, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap", maxWidth: "48vw",
          }}
        >
          <span style={{ display: "grid", gap: 3.5, flexShrink: 0 }} aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: 16, height: 1.5, background: C.dorado }} />
            ))}
          </span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{seccionActiva}</span>
        </button>
      </div>
    </header>
  );
}

const botonBarra: React.CSSProperties = {
  fontSize: 12, color: C.dorado, background: "none",
  border: `1px solid ${C.borde}`, padding: "7px 15px",
  borderRadius: radio.pastilla, cursor: "pointer", whiteSpace: "nowrap",
  fontFamily: "inherit",
};

/* ───────────────────────── MENÚ ───────────────────────── */

/**
 * Menú plano, en columna. El orden es el mismo que el de la página y cada
 * entrada dice dónde se ve.
 *
 * En celular ya no es una tira horizontal que se desliza: ahí sólo cabían tres
 * entradas y no había forma de saber que existían las otras cinco. Ahora es un
 * cajón que se abre encima y las muestra todas de una vez.
 */
export function Menu({
  secciones, activa, onCambiar, sucios, abierto, onCerrar, onSalir,
}: {
  secciones: Seccion[];
  activa: string;
  onCambiar: (id: string) => void;
  sucios: Record<string, boolean>;
  abierto: boolean;
  onCerrar: () => void;
  onSalir: () => void;
}) {
  return (
    <>
      {abierto && <div className="admin-velo" onClick={onCerrar} aria-hidden />}

      <nav
        className={"admin-menu" + (abierto ? " admin-menu-abierto" : "")}
        aria-label="Secciones del sitio"
      >
        <div className="admin-solo-movil admin-menu-encabezado">
          <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.marron }}>
            Secciones
          </span>
          <button onClick={onCerrar} aria-label="Cerrar el menú" style={cerrarCajon}>
            &#10005;
          </button>
        </div>

        {secciones.map((s, i) => {
          const on = s.id === activa;
          return (
            <button
              key={s.id}
              onClick={() => {
                onCambiar(s.id);
                onCerrar();
              }}
              aria-current={on ? "page" : undefined}
              className="admin-menu-item"
              style={{
                background: on ? C.papelHueso : "transparent",
                borderInlineStartColor: on ? C.accion : "transparent",
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

        {/* En celular "Ver el sitio" y "Cerrar sesión" no caben en la barra. */}
        <div className="admin-solo-movil admin-menu-pie">
          <a href="/" target="_blank" rel="noopener noreferrer" style={pieCajon}>
            Ver el sitio ↗
          </a>
          <button
            onClick={onSalir}
            style={{ ...pieCajon, background: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );
}

const cerrarCajon: React.CSSProperties = {
  background: "none", border: "none", fontSize: 19, lineHeight: 1,
  color: C.marron, cursor: "pointer", padding: "2px 6px", fontFamily: "inherit",
};

const pieCajon: React.CSSProperties = {
  display: "block", padding: "12px 18px", fontSize: 13.5,
  color: C.marron, textDecoration: "none", border: "none",
  textAlign: "left", width: "100%", boxSizing: "border-box",
};

/* ───────────────────────── CABECERA DE SECCIÓN ───────────────────────── */

/** Título y explicación de la sección abierta. Publicar vive en la barra de abajo. */
export function CabeceraSeccion({ titulo, explicacion }: { titulo: string; explicacion: string }) {
  return (
    <div style={{ marginBottom: esp.lg }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, color: C.tinta, margin: 0 }}>
        {titulo}
      </h1>
      <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.marronClaro, maxWidth: "56ch", lineHeight: 1.5 }}>
        {explicacion}
      </p>
    </div>
  );
}

/* ───────────────────────── BARRA DE GUARDAR ───────────────────────── */

/**
 * Fija abajo, siempre a la vista.
 *
 * Antes el botón de publicar estaba en la cabecera de la sección: en Inicio,
 * que tiene cuatro bloques de campos, había que subir hasta arriba para
 * guardar, y era fácil creer que ya se había guardado sin haberlo hecho.
 *
 * Publica de una vez todos los archivos con cambios, no sólo el de la sección
 * abierta: así es imposible dejarse algo pendiente en otra sección.
 */
export function BarraGuardar({
  pendientes, guardando, cargando, msg, error, onGuardar,
}: {
  pendientes: string[];
  guardando: boolean;
  cargando: boolean;
  msg: string;
  error: boolean;
  onGuardar: () => void;
}) {
  const hay = pendientes.length > 0;
  const inactivo = guardando || cargando || !hay;

  return (
    <div className="admin-barra-guardar">
      {msg && (
        <div
          role="status"
          style={{
            fontSize: 13.5, lineHeight: 1.5,
            color: error ? C.error : C.exito,
            background: error ? "#fdf0ee" : "#eef6ef",
            borderBottom: `1px solid ${error ? C.error : C.exito}33`,
            padding: "10px 20px",
          }}
        >
          {msg}
        </div>
      )}

      <div className="admin-barra-guardar-fila">
        <span style={{ fontSize: 13.5, color: hay ? C.tinta : C.marronClaro, minWidth: 0 }}>
          {cargando ? (
            "Cargando el contenido…"
          ) : hay ? (
            <>
              Sin publicar en:{" "}
              <strong style={{ fontWeight: 600 }}>{pendientes.join(", ")}</strong>
            </>
          ) : (
            "Todo publicado."
          )}
        </span>
        <button onClick={onGuardar} disabled={inactivo} style={botonPrincipal(inactivo)}>
          {guardando ? "Publicando…" : hay ? "Guardar y publicar" : "Sin cambios"}
        </button>
      </div>
    </div>
  );
}
