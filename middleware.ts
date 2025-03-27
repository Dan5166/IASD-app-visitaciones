import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas protegidas
const protectedRoutes = ["/dashboard", "/profile", "/protected", "/visitador"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) {
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
