import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const OWNER = "loea-74";
const REPO = "Molino";
const FILE_PATH = "src/content/site.json";
const BRANCH = "main";

function isAuthed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = password + (process.env.ADMIN_SECRET ?? "molino-secret");
  const valid = createHash("sha256").update(secret).digest("hex");
  return token === valid;
}

async function getFileFromGitHub() {
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
    // Causa mas comun: el GITHUB_TOKEN caduco. Decirlo explicitamente evita
    // que el panel se quede en blanco sin explicacion.
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "GitHub rechazó las credenciales. El GITHUB_TOKEN está caducado o le faltan permisos — revísalo en Vercel."
      );
    }
    if (res.status === 404) {
      throw new Error(`No se encontró ${FILE_PATH} en el repositorio.`);
    }
    throw new Error(`GitHub respondió ${res.status} al leer ${FILE_PATH}.`);
  }
  return res.json();
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const file = await getFileFromGitHub();
    const content = Buffer.from(file.content, "base64").toString("utf-8");
    return NextResponse.json({ site: JSON.parse(content), sha: file.sha });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error inesperado en el servidor.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { site } = await req.json();
    const current = await getFileFromGitHub();
    const sha = current.sha;

    // Fusión de primer nivel en vez de reemplazo.
    //
    // El panel manda el archivo ENTERO tal como lo cargó al abrirse. Si entre
    // medias se despliega una versión que añade una llave nueva, la pestaña
    // vieja no la conoce y al publicar la borraba sin avisar: así desapareció
    // `theme` en el commit 3ad8cdb. Lo que manda el panel sigue ganando, pero
    // las llaves que no conoce sobreviven.
    //
    // Sólo vale para site.json, que tiene una forma fija. Recetas, catálogo y
    // testimonios son listas: ahí fusionar impediría borrar elementos.
    const enGitHub = JSON.parse(
      Buffer.from(current.content, "base64").toString("utf-8")
    );
    const fusionado = { ...enGitHub, ...site };
    const content = Buffer.from(JSON.stringify(fusionado, null, 2)).toString("base64");

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
          message: "admin: actualizar contenido del sitio",
          content,
          sha,
          branch: BRANCH,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message ?? "Error al guardar" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error inesperado en el servidor.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
