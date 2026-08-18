import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const OWNER = "loea-74";
const REPO = "Molino";
const CARPETA = "public/fotos";
const BRANCH = "main";

// Tope del cuerpo de una función serverless en Vercel: 4.5 MB. El cliente ya
// comprime, así que 3 MB deja margen de sobra y corta cualquier abuso.
const MAX_BYTES = 3 * 1024 * 1024;

const TIPOS: Record<string, { ext: string; magia: number[][] }> = {
  "image/webp": { ext: "webp", magia: [[0x52, 0x49, 0x46, 0x46]] },
  "image/jpeg": { ext: "jpg", magia: [[0xff, 0xd8, 0xff]] },
  "image/png": { ext: "png", magia: [[0x89, 0x50, 0x4e, 0x47]] },
};

function autorizado(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password || !token) return false;
  const esperado = createHash("sha256")
    .update(password + (process.env.ADMIN_SECRET ?? "molino-secret"))
    .digest("hex");
  return token === esperado;
}

/** Verifica que los primeros bytes correspondan al tipo declarado. */
function magiaOk(buf: Buffer, tipo: string) {
  return TIPOS[tipo].magia.some((m) => m.every((b, i) => buf[i] === b));
}

function nombreLimpio(nombre: string) {
  const base = nombre
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "foto";
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Tu sesión caducó. Vuelve a entrar." }, { status: 401 });
  }
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "Falta el GITHUB_TOKEN en Vercel. Sin él no se pueden subir archivos." },
      { status: 500 }
    );
  }

  let archivo: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("archivo");
    if (f instanceof File) archivo = f;
  } catch {
    return NextResponse.json({ error: "No se recibió el archivo." }, { status: 400 });
  }
  if (!archivo) {
    return NextResponse.json({ error: "No se recibió el archivo." }, { status: 400 });
  }
  if (!TIPOS[archivo.type]) {
    return NextResponse.json(
      { error: "Solo se aceptan imágenes JPG, PNG o WebP." },
      { status: 400 }
    );
  }
  if (archivo.size > MAX_BYTES) {
    const mb = (archivo.size / 1048576).toFixed(1);
    return NextResponse.json(
      { error: `La imagen pesa ${mb} MB y el máximo es 3 MB.` },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await archivo.arrayBuffer());
  // No confiar en el Content-Type que manda el cliente: puede mentir.
  if (!magiaOk(buf, archivo.type)) {
    return NextResponse.json(
      { error: "El archivo no parece ser una imagen válida." },
      { status: 400 }
    );
  }

  const ext = TIPOS[archivo.type].ext;
  const sufijo = createHash("sha256").update(buf).digest("hex").slice(0, 6);
  // Nombre único: nunca sobrescribimos, porque otro campo podría apuntar al
  // archivo viejo y se quedaría sin imagen.
  const nombre = `${nombreLimpio(archivo.name)}-${sufijo}.${ext}`;
  const ruta = `${CARPETA}/${nombre}`;

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${ruta}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `admin: subir ${nombre}`,
      content: buf.toString("base64"),
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json(
        {
          error:
            "GitHub rechazó las credenciales. El GITHUB_TOKEN está caducado o le faltan permisos — revísalo en Vercel.",
        },
        { status: 500 }
      );
    }
    if (res.status === 422) {
      // Ya existe un archivo con ese nombre y ese contenido: reusarlo es correcto.
      return NextResponse.json({ ok: true, url: `/fotos/${nombre}`, yaExistia: true });
    }
    const detalle = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: (detalle as { message?: string }).message ?? `GitHub respondió ${res.status}.` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, url: `/fotos/${nombre}` });
}
