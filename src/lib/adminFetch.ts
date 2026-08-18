// Helpers compartidos del panel de administración.
//
// Antes, si la API devolvía un error (por ejemplo con el GITHUB_TOKEN caducado),
// los editores hacían `.then(({ recipes }) => setRecipes(recipes))` sobre una
// respuesta que no traía ese campo. El estado quedaba en undefined y el render
// siguiente tronaba con "client-side exception", dejando el panel en blanco sin
// decir qué pasaba.

/** Lee un endpoint del admin y lanza un Error con mensaje entendible si falla. */
export async function cargarDelAdmin<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisa tu internet.");
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`El servidor respondió de forma inesperada (${res.status}).`);
  }

  if (!res.ok) {
    const detalle = (data as { error?: string })?.error;
    if (res.status === 401) {
      throw new Error("Tu sesión caducó. Vuelve a entrar con tu contraseña.");
    }
    throw new Error(detalle || `Error ${res.status} al cargar los datos.`);
  }

  return data as T;
}

/** Convierte cualquier fallo en un texto que el cliente pueda entender. */
export function mensajeDeError(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado.";
}
