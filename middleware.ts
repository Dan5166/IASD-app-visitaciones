import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas protegidas
const protectedRoutes = ["/dashboard", "/profile", "/protected", "/visitador"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

   // Verifica si la ruta solicitada es una subruta de las rutas protegidas
   const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token) {
      console.log("------------- Redirigiendo a LOGIN");
      return NextResponse.redirect(new URL("/login", req.url)); // 🔥 Redirige si no hay token
    }

    try {
      const res = await fetch(`${req.nextUrl.origin}/api/auth/user`, {
        headers: { cookie: `token=${token}` },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", req.url)); // 🔥 Redirige si el token no es válido
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
