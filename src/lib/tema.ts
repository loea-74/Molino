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
 *                  →  se separó el fondo de esa franja
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
        nombre: "Fondo de las franjas",
        donde: "Las tres franjas grandes — historia, recetas y «Ven al molino» — y el botón oscuro de la barra",
        zonas: ["historia", "recetas", "visita", "botonNav"],
      },
      {
        // El pie tiene su propia variable para poder pintarlo distinto del
        // resto. Antes compartía color con las franjas y no había manera.
        clave: "pieFondo", css: "--pie-fondo", omision: "#2A1D14",
        nombre: "Fondo del pie",
        donde: "La franja de abajo del todo, la de los datos de contacto",
        zonas: ["pie"],
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
        donde: "Los encabezados de cada sección, sobre fondo claro",
        zonas: ["tituloCatalogo", "navTexto"],
      },
      {
        // El nombre del molino tiene control propio: es la marca, y no debe
        // moverse cuando se cambia el color de los demás encabezados.
        clave: "tituloPortada", css: "--titulo-portada", omision: "#9B0808",
        nombre: "El nombre grande de la portada",
        donde: "Sólo «La Gran Jalisciense», lo primero que se ve",
        zonas: ["tituloPortada"],
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
        zonas: ["textoRecetas", "textoHistoria", "textoVisita", "textoPie", "textoBotonNav"],
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
        donde: "El botón naranja de la portada, el «Pedir» de cada producto y la raya de la cita",
        zonas: ["botonPortada", "pedir", "citaHistoria"],
      },
      {
        clave: "maiz", css: "--maiz", omision: "#E8B858",
        nombre: "Amarillo maíz",
        donde: "Las etiquetas de las tarjetas, las estrellas y los avisos",
        zonas: ["etiquetaProducto", "kickerRecetas", "kickerHistoria", "avisoVisita", "estrellas"],
      },
      {
        clave: "linea", css: "--linea", omision: "#D9C8A8",
        nombre: "Líneas finas",
        // También pinta los párrafos de Historia: ahí hace de gris cálido sobre
        // el fondo oscuro. Cambiarlo a --texto-claro alteraría cómo se ve hoy,
        // así que se deja y se avisa en vez de esconderlo.
        donde: "Los bordes y rayas que separan bloques · y los párrafos de Historia",
        zonas: ["bordes", "parrafoHistoria"],
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

/* ───────────────────────── CONTRASTE ───────────────────────── */

/**
 * Qué color tiene que leerse encima de cuál.
 *
 * Existe porque pasó: se puso #D9C8A8 como fondo de las franjas y el texto
 * claro quedó en 1.53:1 de contraste — ilegible — mientras que los párrafos de
 * Historia, que usan ese MISMO color, desaparecieron del fondo por completo.
 * Nada en el panel avisaba, y el sitio estuvo así publicado.
 */
export const PARES_CONTRASTE: { fondo: string; texto: string; que: string }[] = [
  { fondo: "franjaOscura", texto: "textoClaro", que: "el texto sobre las franjas" },
  { fondo: "franjaOscura", texto: "linea", que: "los párrafos de Historia" },
  { fondo: "franjaOscura", texto: "maiz", que: "las etiquetas amarillas" },
  { fondo: "pieFondo", texto: "textoClaro", que: "el texto del pie" },
  { fondo: "cremaLight", texto: "grano", que: "los títulos" },
  { fondo: "cremaLight", texto: "tituloPortada", que: "el nombre de la portada" },
  { fondo: "cremaLight", texto: "granoSoft", que: "los párrafos" },
  { fondo: "crema", texto: "granoSoft", que: "el texto de las tarjetas" },
  { fondo: "crema", texto: "grano", que: "los nombres de producto" },
  { fondo: "terracota", texto: "cremaLight", que: "el texto de los botones" },
];

/** Luminancia relativa según la fórmula de accesibilidad de la W3C. */
function luminancia(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const l = c.map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}

/** Razón de contraste entre dos colores: de 1 (invisible) a 21 (negro sobre blanco). */
export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Los problemas de lectura que provoca el color de una clave, mirando todos los
 * pares en los que participa. 4.5 es el mínimo que la norma pide para texto
 * normal; por debajo de 3 ya no se distingue nada.
 *
 * Sólo avisa si el color elegido empeora lo que venía de fábrica. La paleta
 * original deja el texto de los botones en 4.49 — un pelo bajo el umbral — y
 * un aviso permanente sobre algo que nadie tocó enseña a ignorar los avisos,
 * que es justo lo contrario de lo que se busca.
 */
export function avisosDeContraste(
  clave: string,
  colores: Record<string, string>
): { que: string; razon: number; grave: boolean }[] {
  const avisos = [];
  for (const par of PARES_CONTRASTE) {
    if (par.fondo !== clave && par.texto !== clave) continue;
    const f = colores[par.fondo], t = colores[par.texto];
    if (!f || !t) continue;

    const razon = contraste(f, t);
    if (razon >= 4.5) continue;

    const deFabrica = contraste(
      COLORES.find((c) => c.clave === par.fondo)?.omision ?? f,
      COLORES.find((c) => c.clave === par.texto)?.omision ?? t
    );
    if (razon >= deFabrica - 0.01) continue; // ya venía así, no es culpa del cambio

    avisos.push({ que: par.que, razon, grave: razon < 3 });
  }
  return avisos;
}
