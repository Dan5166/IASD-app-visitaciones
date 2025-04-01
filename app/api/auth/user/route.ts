import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import { getDocument } from "@/lib/firebase";

export async function GET(req: Request) {
  // Obtener el token desde las cookies
  const token = req.headers.get("cookie")?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

  if (!token) {
    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }

  try {
    // Verificar el token con Firebase Admin (forzando la validación de expiración)
    const decodedToken = await admin.auth().verifyIdToken(token, true);

    // Obtener el usuario desde Firestore
    const path = `users/${decodedToken.uid}`;
    const userForClientUse = await getDocument(path);

    if (userForClientUse) {
      return NextResponse.json({ success: true, user: userForClientUse });
    } else {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error verificando el token:", error);

    if (error.code === "auth/id-token-expired") {
      console.log("El token ha expirado. Redirigiendo al login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
  }
}
