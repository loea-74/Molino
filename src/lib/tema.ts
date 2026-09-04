/**
 * Colores y tipografía del sitio, editables desde el panel.
 *
 * Funciona porque los componentes ya pintaban con `var(--color)` en lugar de
 * colores escritos a mano: hay unas 180 llamadas a esas variables y sólo dos
 * clases de color de Tailwind en todo el sitio. Basta con volver a declarar las
 * variables en un <style> dentro de layout.tsx para repintar la página entera.
 *
 * Lo que el cliente NO puede tocar: tamaños de letra, espaciados y radios.
 * Esos también son variables, pero moverlos descuadra la maquetación y no hay
 * forma de que se note el error antes de publicar.
 */

export type Tema = {
  colores?: Record<string, string>;
  /** Clave de PAREJAS. */
  fuente?: string;
};

/* ───────────────────────── COLORES ───────────────────────── */

export type DefColor = {
  clave: string;
  /** La variable CSS que se vuelve a declarar. */
  css: string;
  nombre: string;
  donde: string;
  omision: string;
};

/** Agrupados por para qué sirven, no por su nombre en el código. */
export const GRUPOS_COLOR: { titulo: string; nota: string; colores: DefColor[] }[] = [
  {
    titulo: "Fondos",
    nota: "El papel sobre el que va todo",
    colores: [
      { clave: "cremaLight", css: "--crema-light", nombre: "Fondo de la página", donde: "El color general del sitio", omision: "#FBF6ED" },
      { clave: "crema", css: "--crema", nombre: "Fondo de tarjetas", donde: "Recuadros y franjas sobre el fondo", omision: "#F5EDE0" },
    ],
  },
  {
    titulo: "Texto",
    nota: "Cuanto más contraste con el fondo, más fácil de leer",
    colores: [
      { clave: "grano", css: "--grano", nombre: "Títulos", donde: "Los encabezados grandes", omision: "#2A1D14" },
      { clave: "granoSoft", css: "--grano-soft", nombre: "Texto normal", donde: "Los párrafos", omision: "#4A3728" },
    ],
  },
  {
    titulo: "Acento",
    nota: "Lo que llama la atención: botones, ligas, precios",
    colores: [
      { clave: "terracota", css: "--terracota", nombre: "Color principal", donde: "Botones y ligas", omision: "#B8542E" },
      { clave: "terracotaDark", css: "--terracota-dark", nombre: "Principal oscuro", donde: "Al pasar el ratón por encima", omision: "#8B3E1F" },
      { clave: "maiz", css: "--maiz", nombre: "Amarillo maíz", donde: "Las etiquetas sobre las tarjetas", omision: "#E8B858" },
      { clave: "maizLight", css: "--maiz-light", nombre: "Amarillo claro", donde: "Realces suaves", omision: "#F2D58A" },
      { clave: "nopal", css: "--nopal", nombre: "Verde nopal", donde: "Detalles sueltos", omision: "#556B3A" },
    ],
  },
  {
    titulo: "Líneas",
    nota: "",
    colores: [
      { clave: "linea", css: "--linea", nombre: "Bordes y separadores", donde: "Las rayas finas entre bloques", omision: "#D9C8A8" },
    ],
  },
];

export const COLORES: DefColor[] = GRUPOS_COLOR.flatMap((g) => g.colores);

/* ───────────────────────── TIPOGRAFÍA ───────────────────────── */

export type Pareja = {
  nombre: string;
  nota: string;
  /** Familias CSS. Las var(--tf-*) las define next/font en <html>. */
  display: string;
  body: string;
};

/**
 * El sitio venía pidiendo `'Fraunces'` e `'Inter'` por su nombre normal, pero
 * next/font las auto-hospeda bajo un nombre con hash (`__Fraunces_54d641`), así
 * que nunca coincidían: las descargaba en cada visita y pintaba con Georgia y
 * la fuente del sistema. Por eso la opción por omisión es "actual" — deja el
 * sitio EXACTAMENTE como se ve hoy — y Fraunces + Inter es una opción aparte.
 *
 * Todas las parejas se eligieron por legibilidad primero.
 */
export const PAREJAS: Record<string, Pareja> = {
  actual: {
    nombre: "Como está ahora",
    nota: "Serif clásica del sistema. Es lo que el sitio muestra hoy.",
    display: "Georgia, 'Times New Roman', serif",
    body: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  fraunces: {
    nombre: "Fraunces + Inter",
    nota: "La pareja que el diseño original pedía y nunca llegó a aplicarse.",
    display: "var(--tf-fraunces), Georgia, serif",
    body: "var(--tf-inter), system-ui, sans-serif",
  },
  bitter: {
    nombre: "Bitter + Inter",
    nota: "Serif de trazo parejo, pensada para leerse en pantalla.",
    display: "var(--tf-bitter), Georgia, serif",
    body: "var(--tf-inter), system-ui, sans-serif",
  },
  playfair: {
    nombre: "Playfair + Source Sans",
    nota: "Más elegante y de más contraste. Luce en títulos grandes.",
    display: "var(--tf-playfair), Georgia, serif",
    body: "var(--tf-source), system-ui, sans-serif",
  },
  inter: {
    nombre: "Inter en todo",
    nota: "Sin remates, la más neutra. La más fácil de leer en celular.",
    display: "var(--tf-inter), system-ui, sans-serif",
    body: "var(--tf-inter), system-ui, sans-serif",
  },
};

export const PAREJA_OMISION = "actual";

/* ───────────────────────── GENERADOR ───────────────────────── */

const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * El bloque `:root { … }` que redefine los tokens. Se inyecta en layout.tsx.
 *
 * Sólo deja pasar colores en formato #rrggbb: lo que se guarda viene de un
 * archivo JSON en GitHub, y no conviene que un valor raro acabe dentro de una
 * etiqueta <style>.
 */
export function cssDelTema(tema: Tema | undefined): string {
  const reglas: string[] = [];

  const colores = tema?.colores ?? {};
  for (const c of COLORES) {
    const valor = colores[c.clave];
    if (typeof valor === "string" && HEX.test(valor.trim())) {
      reglas.push(`${c.css}:${valor.trim()}`);
    }
  }

  const pareja = PAREJAS[tema?.fuente ?? PAREJA_OMISION] ?? PAREJAS[PAREJA_OMISION];
  reglas.push(`--font-display:${pareja.display}`);
  reglas.push(`--font-body:${pareja.body}`);

  return `:root{${reglas.join(";")}}`;
}

/** El tema con todos los huecos rellenos. Lo usa la vista previa del panel. */
export function temaCompleto(tema: Tema | undefined) {
  const colores: Record<string, string> = {};
  for (const c of COLORES) {
    const v = tema?.colores?.[c.clave];
    colores[c.clave] = typeof v === "string" && HEX.test(v.trim()) ? v.trim() : c.omision;
  }
  return { colores, fuente: tema?.fuente ?? PAREJA_OMISION };
}
