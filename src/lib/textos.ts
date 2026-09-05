import { L, type Lang, type Strings } from "./i18n";
import site from "@/content/site.json";

/**
 * Los textos del sitio, con lo que el cliente haya escrito en el panel
 * puesto por encima de los valores de i18n.ts.
 *
 * Por qué existe: los encabezados de cada sección — "02 · Catálogo", "Lo que
 * sale del molino" y su descripción, "Cómo se usa bien nuestro maíz", el aviso
 * de derechos del pie… — vivían sólo en i18n.ts. i18n.ts es el archivo de
 * etiquetas de interfaz y NO se puede editar desde el panel, así que el
 * cliente veía las tarjetas de producto editables pero no el título que va
 * encima de ellas.
 *
 * Ahora esos textos viven en site.json → labels. Los de i18n.ts se quedan
 * como valor por omisión: si un campo se deja vacío en el panel, la página
 * sigue mostrando el texto de siempre en lugar de un hueco.
 *
 * Lo que NO se movió a propósito: los botones y etiquetas de interfaz
 * ("Pedir", "Anterior", "Siguiente", los nombres del menú). Son parte del
 * funcionamiento, no del contenido, y ponerlos a mano invita a romper el sitio.
 */

/** Los únicos textos que el panel puede sobrescribir. */
const EDITABLES = [
  "catalogoEyebrow",
  "catalogoTitle",
  "catalogoBody",
  "catalogoServicios",
  "catalogoServiciosBody",
  "catalogoPrecios",
  "productsEyebrow",
  "productsTitle",
  "productsBody",
  "historyEyebrow",
  "recipesEyebrow",
  "recipesTitle",
  "recipesKicker",
  "testimonialsEyebrow",
  "visitEyebrow",
  "footerTag",
  "footerRights",
] as const;

export type LabelEditable = (typeof EDITABLES)[number];

/** i18n.ts está declarado `as const`, así que sus tipos son literales. Al
 *  permitir que el cliente los cambie dejan de serlo: aquí se ensanchan. */
type Ancho<T> = T extends readonly string[] ? readonly string[] : string;
export type Textos = { [K in keyof Strings]: Ancho<Strings[K]> };

type Bilingue = { es?: string; en?: string };

export function textos(lang: Lang): Textos {
  const labels = (site as { labels?: Record<string, Bilingue> }).labels ?? {};
  const out: Record<string, unknown> = { ...L[lang] };

  for (const clave of EDITABLES) {
    const valor = labels[clave]?.[lang];
    // Un campo vacío no borra el texto: cae al valor de i18n.ts.
    if (typeof valor === "string" && valor.trim() !== "") out[clave] = valor;
  }

  return out as Textos;
}
