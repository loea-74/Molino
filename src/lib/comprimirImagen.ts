// Comprime una imagen en el navegador ANTES de subirla.
//
// Por qué es imprescindible y no un lujo:
//  1. Vercel corta el cuerpo de una petición serverless en 4.5 MB. Una foto de
//     celular pesa 3-8 MB y en base64 crece un 33% más: sin comprimir, falla.
//  2. El repo ya arrastra imágenes de 10 MB. Sin un tope, cada subida lo empeora.

export type ImagenLista = { blob: Blob; nombre: string; ancho: number; alto: number };

const LADO_MAX = 1600;
const CALIDAD = 0.82;
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp"];

/** Quita acentos, espacios y símbolos para que el nombre sirva como URL. */
export function limpiarNombre(nombre: string): string {
  const base = nombre.replace(/\.[^.]+$/, "");
  return (
    base
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "foto"
  );
}

export async function comprimirImagen(file: File): Promise<ImagenLista> {
  if (/\.hei[cf]$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif") {
    throw new Error(
      "Las fotos HEIC de iPhone no se pueden procesar aquí. Guárdala como JPG y vuelve a intentar."
    );
  }
  if (!TIPOS_OK.includes(file.type)) {
    throw new Error("Formato no soportado. Usa JPG, PNG o WebP.");
  }

  // imageOrientation respeta el EXIF: sin esto las fotos de celular salen giradas.
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("No se pudo leer la imagen. ¿Está dañada?");
  }

  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no permite procesar imágenes.");
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", CALIDAD));
  if (!blob) throw new Error("No se pudo comprimir la imagen.");

  return { blob, nombre: `${limpiarNombre(file.name)}.webp`, ancho, alto };
}
