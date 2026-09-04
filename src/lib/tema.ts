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
  /** Frase corta para la lista. */
  donde: string;
  /** Las zonas del mapa que este color pinta. Nombres de ZONAS. */
  zonas: string[];
  omision: string;
};

/**
 * Los colores que DE VERDAD pintan algo, y cada uno con UN SOLO trabajo.
 *
 * Se comprobó uno por uno contra los componentes. `--terracota-dark`,
 * `--maiz-light` y `--nopal` estaban en tokens.css pero no se usan en ninguna
 * parte: tenerlos aquí era prometer un cambio que nunca ocurre.
 *
 * Tres variables hacían dos trabajos a la vez y se partieron, porque no había
 * forma de tocar una sin arrastrar la otra:
 *   --grano        era el fondo de la franja de recetas Y el color de los
 *                  títulos  →  se separó --franja-oscura
 *   --terracota    era el fondo de "Ven al molino" Y los botones
 *                  →  se separó --franja-naranja
 *   --crema-light  era el fondo de la página Y el texto sobre las franjas
 *                  oscuras  →  se separó --texto-claro. Este era el peligroso:
 *                  oscurecer el fondo dejaba ese texto invisible.
 *
 * Los nombres dicen dónde se ve el color, no cómo se llama en el código.
 */
export const GRUPOS_COLOR: { titulo: string; nota: string; colores: DefColor[] }[] = [
  {
    titulo: "Las franjas de color",
    nota: "Los bloques que se ven de lejos al bajar por la página",
    colores: [
      {
        clave: "cremaLight", css: "--crema-light", omision: "#FBF6ED",
        nombre: "Fondo de la página",
        donde: "El papel sobre el que va todo",
        zonas: ["fondo", "tarjetaTestimonio"],
      },
      {
        clave: "franjaOscura", css: "--franja-oscura", omision: "#2A1D14",
        nombre: "Fondo de la franja oscura",
        donde: "La franja de recetas y el pie de página. Sólo el fondo.",
        zonas: ["recetas", "pie"],
      },
      {
        clave: "franjaNaranja", css: "--franja-naranja", omision: "#B8542E",
        nombre: "Fondo de la franja naranja",
        donde: "La franja de «Ven al molino». Sólo el fondo.",
        zonas: ["visita"],
      },
      {
        clave: "crema", css: "--crema", omision: "#F5EDE0",
        nombre: "Fondo de recuadros",
        donde: "La barra de arriba y las tarjetas de producto",
        zonas: ["nav", "tarjetaProducto", "franjaTestimonios"],
      },
    ],
  },
  {
    titulo: "Los textos",
    nota: "Cuanto más contraste con su fondo, más fácil de leer",
    colores: [
      {
        clave: "grano", css: "--grano", omision: "#2A1D14",
        nombre: "Títulos",
        donde: "Los encabezados grandes sobre fondo claro",
        zonas: ["tituloPortada", "tituloCatalogo", "navTexto"],
      },
      {
        clave: "granoSoft", css: "--grano-soft", omision: "#4A3728",
        nombre: "Párrafos",
        donde: "El texto normal, el que más se lee",
        zonas: ["parrafoPortada", "parrafoProducto"],
      },
      {
        clave: "textoClaro", css: "--texto-claro", omision: "#FBF6ED",
        nombre: "Texto sobre las franjas",
        donde: "Todo lo que se lee encima de la franja oscura y de la naranja",
        zonas: ["textoRecetas", "textoVisita", "textoPie"],
      },
    ],
  },
  {
    titulo: "Detalles",
    nota: "",
    colores: [
      {
        clave: "terracota", css: "--terracota", omision: "#B8542E",
        nombre: "Botones y ligas",
        donde: "El botón de WhatsApp, el «Pedir» de cada producto",
        zonas: ["botonPortada", "botonNav", "pedir"],
      },
      {
        clave: "maiz", css: "--maiz", omision: "#E8B858",
        nombre: "Amarillo maíz",
        donde: "Las etiquetas de las tarjetas, las estrellas y los avisos",
        zonas: ["etiquetaProducto", "kickerRecetas", "avisoVisita", "estrellas"],
      },
      {
        clave: "linea", css: "--linea", omision: "#D9C8A8",
        nombre: "Líneas finas",
        donde: "Los bordes y las rayas que separan bloques",
        zonas: ["bordes"],
      },
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
