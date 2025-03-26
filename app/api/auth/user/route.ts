import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin"; // Importa Firebase Admin

export async function GET(req: Request) {
  // Obtener el token desde las cookies
  const token = req.headers.get("cookie")?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    // Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Retornar los datos del usuario
    return NextResponse.json({ success: true, user: decodedToken });
  } catch (error) {
    console.error("Error verificando el token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
