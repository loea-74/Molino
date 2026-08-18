// Plantillas para "agregar" en el panel. Se crean vacías a propósito: es más
// claro para quien edita ver los campos en blanco que borrar texto de ejemplo.

const vacio = { es: "", en: "" };

/** Slug único: si se repite, React monta mal la lista (usa slug como key). */
export function slugUnico(prefijo: string, existentes: string[]): string {
  let n = existentes.length + 1;
  while (existentes.includes(`${prefijo}-${n}`)) n++;
  return `${prefijo}-${n}`;
}

export function recetaNueva(slugsExistentes: string[]) {
  return {
    slug: slugUnico("receta", slugsExistentes),
    kicker: { ...vacio },
    title: { es: "Nueva entrada", en: "New entry" },
    body: { ...vacio },
    date: { ...vacio },
    cta: { es: "Leer receta", en: "Read recipe" },
    image: "",
    video: "",
    fullContent: {
      es: { intro: "", ingredients: [], steps: [], tip: "" },
      en: { intro: "", ingredients: [], steps: [], tip: "" },
    },
  };
}

export function productoNuevo(slugsExistentes: string[]) {
  return {
    slug: slugUnico("producto", slugsExistentes),
    name: { es: "Nuevo producto", en: "New product" },
    tag: { ...vacio },
    description: { ...vacio },
    unit: { es: "por kilo", en: "per kilo" },
    price: null as number | null,
    image: "",
    imageAlt: "",
    whatsappMessage: "Hola, me interesa comprar ",
  };
}
