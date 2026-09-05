import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { aplicarControl, ExcelInvalido, type Catalogo } from "@/lib/aplicarControl";

/**
 * Recibe el Catalogo_Control.xlsx y lo aplica al catálogo de la página.
 *
 * El archivo NO se guarda: de él sólo se sacan las decisiones — qué se enseña,
 * con qué nombre y cuántos por categoría — y se vuelcan sobre catalogo.json,
 * que es lo que la página lee. Guardarlo también dejaría dos verdades que
 * podrían separarse.
 *
 * Aquí sólo viven el permiso, la lectura y la escritura en GitHub. El volcado
 * está en lib/aplicarControl para poder probarlo sin levantar el servidor ni
 * entrar al panel.
 */

const OWNER = "loea-74";
const REPO = "Molino";
const FILE_PATH = "src/content/catalogo.json";
const BRANCH = "main";

/** Tope de peso. El archivo de control ronda los 60 KB; 5 MB es de sobra y
 *  evita que un archivo enorme tumbe la función. */
const MAX_BYTES = 5 * 1024 * 1024;

function isAuthed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = password + (process.env.ADMIN_SECRET ?? "molino-secret");
  return !!password && token === createHash("sha256").update(secret).digest("hex");
}

async function leerDeGitHub() {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("GitHub rechazó las credenciales. Revisa el GITHUB_TOKEN en Vercel.");
    }
    throw new Error(`GitHub respondió ${res.status} al leer el catálogo.`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const archivo = form.get("archivo");
    if (!(archivo instanceof File)) {
      return NextResponse.json({ error: "No llegó ningún archivo." }, { status: 400 });
    }
    if (archivo.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `El archivo pesa ${(archivo.size / 1048576).toFixed(1)} MB. El tope son 5 MB.` },
        { status: 400 }
      );
    }
    const datos = Buffer.from(await archivo.arrayBuffer());

    const file = await leerDeGitHub();
    const catalogo: Catalogo = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8")
    );

    let cuenta;
    try {
      cuenta = aplicarControl(datos, catalogo);
    } catch (e) {
      // Un archivo equivocado es culpa de quien lo sube, no del servidor: se
      // responde 400 con el porqué, para que el panel lo pueda enseñar tal cual.
      if (e instanceof ExcelInvalido) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
      throw e;
    }

    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "admin: aplicar el archivo de control al catálogo",
          content: Buffer.from(JSON.stringify(catalogo, null, 2)).toString("base64"),
          sha: file.sha,
          branch: BRANCH,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message ?? "Error al guardar el catálogo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, ...cuenta });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error inesperado en el servidor.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
