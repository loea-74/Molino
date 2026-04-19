import { NextRequest, NextResponse } from "next/server";

// Solo bloquea acceso directo a la API de recetas sin cookie
// La página /admin se protege en el servidor (muestra login si no hay sesión)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bloquear rutas admin sin cookie de sesión (excepto el login)
  if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth") {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/admin/auth"],
};
