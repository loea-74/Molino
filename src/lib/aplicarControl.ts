import { leerExcel, type Hoja } from "./leerExcel";

/**
 * Vuelca las decisiones del Catalogo_Control.xlsx sobre el catálogo.
 *
 * Vive aparte de la ruta que lo recibe para poder probarlo sin levantar el
 * servidor ni entrar al panel: es la parte que decide qué se enseña, y
 * equivocarse aquí se ve en la página de mil productos.
 *
 * Se cruza por clave y nunca por nombre, precisamente porque el nombre es lo
 * que el archivo viene a cambiar. Una celda en blanco no significa "quítalo":
 * significa "esto no lo toco".
 */

export type Producto = { clave: string; nombre: string; oculto?: boolean; destacado?: boolean };
export type Categoria = { clave: string; nombre: string; cuantos: number; productos: Producto[]; oculto?: boolean };
export type Departamento = { clave: string; nombre: string; categorias: Categoria[]; oculto?: boolean };
export type Catalogo = { servicios: unknown[]; departamentos: Departamento[] };

export type Resumen = {
  renombrados: number;
  ocultados: number;
  mostrados: number;
  /** Claves del archivo que ya no existen en el catálogo: bajas de la caja. */
  sinCruzar: number;
  leidos: number;
};

/** Una hoja como lista de registros, con la cabecera de llaves. */
function registros(hoja: Hoja | undefined): Record<string, string>[] {
  if (!hoja || hoja.length < 2) return [];
  const cab = hoja[0];
  return hoja.slice(1).map((fila) => {
    const r: Record<string, string> = {};
    cab.forEach((c, i) => {
      if (c) r[c] = fila[i] ?? "";
    });
    return r;
  });
}

/** Un SI/NO del archivo. En blanco = lo que ya estuviera. */
function siNo(v: string | undefined, actual: boolean): boolean {
  const t = (v ?? "").trim().toUpperCase();
  if (!t) return actual;
  return t.charAt(0) === "S";
}

function texto(v: string | undefined): string {
  return (v ?? "").trim();
}

export class ExcelInvalido extends Error {}

/**
 * Aplica el archivo sobre el catálogo, en su sitio.
 * Devuelve el resumen de lo que cambió, para poder contárselo a quien lo subió.
 */
export function aplicarControl(excel: Buffer, catalogo: Catalogo): Resumen {
  let hojas;
  try {
    hojas = leerExcel(excel);
  } catch {
    throw new ExcelInvalido("No se pudo abrir el archivo. ¿Es un Excel (.xlsx)?");
  }

  if (!hojas.has("Productos") && !hojas.has("Categorias") && !hojas.has("Menu")) {
    throw new ExcelInvalido(
      "El archivo no trae las hojas Menu, Categorias ni Productos. " +
        "Parece otro Excel, no el de control del catálogo."
    );
  }

  const porClave = new Map<string, Record<string, string>>();
  for (const r of registros(hojas.get("Productos"))) {
    if (r["Clave"]) porClave.set(r["Clave"], r);
  }
  const porCategoria = new Map<string, Record<string, string>>();
  for (const r of registros(hojas.get("Categorias"))) {
    porCategoria.set(`${r["Clave del departamento"]}|${r["Clave de la categoria"]}`, r);
  }
  const porDepartamento = new Map<string, Record<string, string>>();
  for (const r of registros(hojas.get("Menu"))) {
    if (r["Clave del departamento"]) porDepartamento.set(r["Clave del departamento"], r);
  }

  const n: Resumen = { renombrados: 0, ocultados: 0, mostrados: 0, sinCruzar: 0, leidos: porClave.size };

  const marcar = (antes: boolean, ahora: boolean) => {
    if (ahora !== antes) ahora ? n.ocultados++ : n.mostrados++;
  };

  for (const dep of catalogo.departamentos) {
    const rd = porDepartamento.get(dep.clave);
    if (rd) {
      const nombre = texto(rd["Nombre en la web"]);
      if (nombre && nombre !== dep.nombre) {
        dep.nombre = nombre;
        n.renombrados++;
      }
      const antes = !!dep.oculto;
      dep.oculto = !siNo(rd["Mostrar"], !antes);
      marcar(antes, !!dep.oculto);
    }

    for (const cat of dep.categorias) {
      const rc = porCategoria.get(`${dep.clave}|${cat.clave}`);
      if (rc) {
        const nombre = texto(rc["Nombre en la web"]);
        if (nombre && nombre !== cat.nombre) {
          cat.nombre = nombre;
          n.renombrados++;
        }
        const antes = !!cat.oculto;
        cat.oculto = !siNo(rc["Mostrar"], !antes);
        marcar(antes, !!cat.oculto);

        const cuantos = parseInt(texto(rc["Cuantos productos enseñar"]), 10);
        if (Number.isFinite(cuantos) && cuantos > 0) cat.cuantos = cuantos;
      }

      for (const p of cat.productos) {
        const rp = porClave.get(p.clave);
        if (!rp) continue;
        const nombre = texto(rp["Nombre en la web"]);
        if (nombre && nombre !== p.nombre) {
          p.nombre = nombre;
          n.renombrados++;
        }
        const antes = !!p.oculto;
        p.oculto = !siNo(rp["Mostrar"], !antes);
        marcar(antes, !!p.oculto);
        p.destacado = siNo(rp["Destacar"], !!p.destacado);
      }
    }
  }

  // Claves del archivo que ya no están en el catálogo: normalmente productos
  // dados de baja en la caja. No es un error, pero conviene decirlo.
  const enCatalogo = new Set<string>();
  for (const d of catalogo.departamentos)
    for (const c of d.categorias) for (const p of c.productos) enCatalogo.add(p.clave);
  porClave.forEach((_, clave) => {
    if (!enCatalogo.has(clave)) n.sinCruzar++;
  });

  return n;
}
