import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { createHash } from "crypto";

// El video NO puede pasar por aquí: Vercel corta el cuerpo de una función
// serverless en 4.5 MB y TAMALES.mp4 ya pesa 4.46 MB. Esta ruta solo FIRMA el
// permiso; el archivo viaja del navegador directo a Vercel Blob.
//
// Tampoco van a GitHub a propósito: Vercel clona el repo en cada compilación,
// así que cada video metido en Git haría más lentos todos los builds futuros,
// para siempre, y Git nunca olvida.

const MAX_BYTES = 60 * 1024 * 1024; // 60 MB
const TIPOS = ["video/mp4", "video/webm", "video/quicktime"];

function autorizado(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password || !token) return false;
  const esperado = createHash("sha256")
    .update(password + (process.env.ADMIN_SECRET ?? "molino-secret"))
    .digest("hex");
  return token === esperado;
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Tu sesión caducó. Vuelve a entrar." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Falta BLOB_READ_WRITE_TOKEN en Vercel. Conecta el Blob store al proyecto marcando «Add a read-write token env var».",
      },
      { status: 500 }
    );
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const resultado = await handleUpload({
      body,
      request: req,
      // Se ejecuta ANTES de darle permiso al navegador: aquí se acotan tipo y
      // tamaño, porque después ya no pasa nada por nuestro servidor.
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: TIPOS,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // Vercel exige este callback. No hay nada que registrar: la ruta del
        // video se guarda en recipes.json cuando el usuario da a "Guardar".
      },
    });
    return NextResponse.json(resultado);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo preparar la subida.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
