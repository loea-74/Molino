import { inflateRawSync } from "zlib";

/**
 * Lector mínimo de archivos .xlsx, para el que sube el cliente desde el panel.
 *
 * Un .xlsx es un ZIP con XML dentro, y Node ya trae lo que hace falta para
 * abrirlo. Se hace a mano en vez de añadir una librería porque sólo se
 * necesitan valores de celda: las librerías de Excel pesan de más para eso, y
 * cada dependencia en una función del servidor es superficie que hay que
 * mantener y vigilar.
 *
 * Lo que NO hace, porque no hace falta aquí: fórmulas (lee el último valor
 * calculado, que es lo que Excel guarda), formatos, fechas como fecha —
 * vuelven como número de serie — ni hojas protegidas.
 */

type Entradas = Map<string, Buffer>;

/* ───────────────────────── EL ZIP ───────────────────────── */

/**
 * Los archivos que hay dentro del ZIP.
 *
 * Se recorre el directorio central, que es el índice que el formato guarda al
 * final. Leer los encabezados locales de arriba abajo también funcionaría,
 * pero el directorio central es la fuente fiable: es lo que se actualiza
 * cuando Excel reescribe el archivo.
 */
function abrirZip(datos: Buffer): Entradas {
  // El final del directorio central. Se busca hacia atrás porque puede llevar
  // un comentario detrás, de hasta 64 KB.
  let fin = -1;
  for (let i = datos.length - 22; i >= Math.max(0, datos.length - 65558); i--) {
    if (datos.readUInt32LE(i) === 0x06054b50) {
      fin = i;
      break;
    }
  }
  if (fin < 0) throw new Error("El archivo no parece un Excel (.xlsx) válido.");

  const cuantos = datos.readUInt16LE(fin + 10);
  let p = datos.readUInt32LE(fin + 16);

  const entradas: Entradas = new Map();
  for (let n = 0; n < cuantos; n++) {
    if (datos.readUInt32LE(p) !== 0x02014b50) break;
    const metodo = datos.readUInt16LE(p + 10);
    const comprimido = datos.readUInt32LE(p + 20);
    const largoNombre = datos.readUInt16LE(p + 28);
    const largoExtra = datos.readUInt16LE(p + 30);
    const largoComentario = datos.readUInt16LE(p + 32);
    const inicioLocal = datos.readUInt32LE(p + 42);
    const nombre = datos.toString("utf8", p + 46, p + 46 + largoNombre);

    // El encabezado local repite el nombre y los extras, con longitudes que
    // pueden no coincidir con las del directorio: hay que releerlas de ahí.
    const nl = datos.readUInt16LE(inicioLocal + 26);
    const el = datos.readUInt16LE(inicioLocal + 28);
    const inicioDatos = inicioLocal + 30 + nl + el;
    const crudo = datos.subarray(inicioDatos, inicioDatos + comprimido);

    if (metodo === 0) entradas.set(nombre, Buffer.from(crudo));
    else if (metodo === 8) entradas.set(nombre, inflateRawSync(crudo));
    // otros métodos de compresión no los usa Excel; se ignoran

    p += 46 + largoNombre + largoExtra + largoComentario;
  }
  return entradas;
}

/* ───────────────────────── EL XML ───────────────────────── */

const ENTIDADES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
};

function desescapar(t: string): string {
  return t
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (m) => ENTIDADES[m]);
}

/** El texto de todas las etiquetas <t> de un trozo de XML, en orden. */
function textos(xml: string): string {
  let out = "";
  const re = /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>|<t\s*\/>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out += desescapar(m[1] ?? "");
  return out;
}

/** "BC" → 54. La letra de columna a su número, empezando en 1. */
function columna(ref: string): number {
  const letras = ref.replace(/\d+/g, "");
  let n = 0;
  for (const c of letras) n = n * 26 + (c.charCodeAt(0) - 64);
  return n;
}

/* ───────────────────────── LA HOJA ───────────────────────── */

export type Hoja = string[][];

/**
 * Las hojas del libro, cada una como una tabla de textos.
 *
 * Se devuelve todo como texto a propósito: las columnas que interesan son
 * nombres y SI/NO, y convertir a número por su cuenta convertiría una clave
 * como "00123" en 123, que ya no casaría con nada.
 */
export function leerExcel(datos: Buffer): Map<string, Hoja> {
  const zip = abrirZip(datos);

  const leer = (nombre: string) => zip.get(nombre)?.toString("utf8") ?? "";

  // Las cadenas compartidas: Excel guarda los textos repetidos una sola vez.
  const compartidas: string[] = [];
  const ss = leer("xl/sharedStrings.xml");
  if (ss) {
    const re = /<si>([\s\S]*?)<\/si>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(ss))) compartidas.push(textos(m[1]));
  }

  // Los nombres de hoja viven en workbook.xml, y a qué archivo corresponde
  // cada una, en sus relaciones.
  const rels = leer("xl/_rels/workbook.xml.rels");
  const destinoPorId = new Map<string, string>();
  // Los atributos vienen en el orden que quiera quien escribió el archivo:
  // openpyxl pone Type, Target e Id, en ese orden. Se captura la etiqueta
  // entera y se sacan por separado, para no depender de cómo estén puestos.
  const reRel = /<Relationship[^>]*>/g;
  let mr: RegExpExecArray | null;
  while ((mr = reRel.exec(rels))) {
    const id = /Id="([^"]+)"/.exec(mr[0]);
    const destino = /Target="([^"]+)"/.exec(mr[0]);
    if (!id || !destino) continue;
    destinoPorId.set(id[1], destino[1].replace(/^\/?xl\//, "").replace(/^\.\//, ""));
  }

  const libro = leer("xl/workbook.xml");
  const hojas = new Map<string, Hoja>();

  const reHoja = /<sheet\s[^>]*>/g;
  let mh: RegExpExecArray | null;
  while ((mh = reHoja.exec(libro))) {
    const etiqueta = mh[0];
    const nombreM = /name="([^"]*)"/.exec(etiqueta);
    const ridM = /r:id="([^"]*)"/.exec(etiqueta);
    const nombre = desescapar(nombreM ? nombreM[1] : "");
    const destino = destinoPorId.get(ridM ? ridM[1] : "");
    if (!nombre || !destino) continue;

    const xml = leer("xl/" + destino);
    if (!xml) continue;

    const tabla: Hoja = [];
    const reFila = /<row[^>]*>([\s\S]*?)<\/row>/g;
    let mf: RegExpExecArray | null;
    while ((mf = reFila.exec(xml))) {
      const celdas: string[] = [];
      // Primero la forma corta <c .../>, que es una celda sin contenido.
      const reCelda = /<c([^>]*?)\/>|<c([^>]*?)>([\s\S]*?)<\/c>/g;
      let c: RegExpExecArray | null;
      while ((c = reCelda.exec(mf[1]))) {
        const atributos = c[1] !== undefined ? c[1] : c[2] || "";
        const cuerpo = c[3] || "";
        const refM = /r="([A-Z]+\d+)"/.exec(atributos);
        const tipoM = /t="([^"]*)"/.exec(atributos);
        const tipo = tipoM ? tipoM[1] : "";

        let valor = "";
        if (tipo === "s") {
          const vM = /<v>([\s\S]*?)<\/v>/.exec(cuerpo);
          const i = parseInt(vM ? vM[1] : "", 10);
          valor = Number.isFinite(i) ? compartidas[i] || "" : "";
        } else if (tipo === "inlineStr") {
          valor = textos(cuerpo);
        } else {
          const vM = /<v>([\s\S]*?)<\/v>/.exec(cuerpo);
          valor = desescapar(vM ? vM[1] : "");
        }

        // Las celdas vacías no se escriben en el XML: se coloca cada valor en
        // su columna para no descuadrar la tabla.
        const i = refM ? columna(refM[1]) - 1 : celdas.length;
        while (celdas.length < i) celdas.push("");
        celdas[i] = valor.trim();
      }
      tabla.push(celdas);
    }
    hojas.set(nombre, tabla);
  }

  return hojas;
}
