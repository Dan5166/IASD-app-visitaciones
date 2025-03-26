import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Obtener token de sesión

  // Si intenta acceder a una ruta protegida sin token, redirigir a /login
  if (!token && req.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Aplicar middleware solo en rutas protegidas
export const config = {
  matcher: ["/visitador", "/admin", "/protected"],
};
