import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin"; // Importa Firebase Admin
import { getDocument } from "@/lib/firebase";

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
    if (decodedToken) {
      try {
        const path = `users/${decodedToken.uid}`;
        const userForClientUse = await getDocument(path);
        if(userForClientUse) {
          return NextResponse.json({ success: true, user: userForClientUse });
        }
      } catch (error) {
        console.error("Error verificando el token:", error);
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      console.log("NO DECODED TOKEN");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error("Error verificando el token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
