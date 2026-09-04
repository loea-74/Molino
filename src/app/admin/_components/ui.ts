// Paleta y estilos compartidos del panel.
//
// Antes estos valores estaban escritos a mano 146 veces repartidos por los
// cuatro editores. Cambiar un tono obligaba a buscar y reemplazar, y era fácil
// que un archivo se quedara atrás. Son EXACTAMENTE los mismos tonos de siempre:
// esto no cambia el aspecto, solo lo centraliza.

export const C = {
  tinta: "#3a2010", // texto principal y barra superior
  tintaHonda: "#1a1205", // fondo de la pantalla de acceso
  marron: "#9a6040", // etiquetas y texto secundario
  marronClaro: "#b08060", // texto de ayuda
  gris: "#9a8570", // rutas de archivo, texto apagado
  accion: "#8b3e1f", // botones principales
  accionApagada: "#c4a87a", // botón deshabilitado
  papel: "#f5ede0", // fondo del panel
  papelClaro: "#faf6f0", // fondo de campos
  papelHueso: "#f0e6d8", // realces y estados activos
  papelTenue: "#efe4d2", // marcadores de posición
  linea: "#d4c4b0", // bordes de campo
  lineaSuave: "#e0d4c0", // separadores
  error: "#c0392b",
  exito: "#2d7a3a",
  borde: "#6a4030", // bordes sobre fondo oscuro
  dorado: "#c4a07a", // texto sobre la barra oscura
} as const;

export const radio = { chico: 7, medio: 10, grande: 14, pastilla: 999 } as const;

/** Escala de espaciado. Antes había gaps de 8/12/14/16/20/22/24/26/28 sin criterio. */
export const esp = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36 } as const;

export const campo: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: radio.chico,
  border: `1.5px solid ${C.linea}`,
  fontSize: 16,
  outline: "none",
  background: C.papelClaro,
  color: C.tinta,
  fontFamily: "inherit",
};

export const etiqueta: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.marron,
  marginBottom: esp.xs,
  display: "block",
};

export const ayuda: React.CSSProperties = {
  fontSize: 13.5,
  color: C.marronClaro,
  marginTop: 5,
  lineHeight: 1.45,
};

export function botonPrincipal(inactivo = false): React.CSSProperties {
  return {
    padding: "12px 26px",
    borderRadius: radio.pastilla,
    border: "none",
    background: inactivo ? C.accionApagada : C.accion,
    color: C.papel,
    fontSize: 15,
    fontWeight: 500,
    cursor: inactivo ? "default" : "pointer",
    fontFamily: "inherit",
  };
}

export const botonSuave: React.CSSProperties = {
  padding: "9px 18px",
  borderRadius: radio.pastilla,
  border: `1.5px solid ${C.linea}`,
  background: "transparent",
  color: C.marron,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

export const tarjeta: React.CSSProperties = {
  border: `1.5px solid ${C.lineaSuave}`,
  borderRadius: radio.grande,
  background: "#fff",
  overflow: "hidden",
};
