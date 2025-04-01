import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number; // Expiración del token en segundos
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Decodificar el token
    const decodedToken = jwtDecode<DecodedToken>(token);

    // Obtener la fecha de expiración en milisegundos
    const expirationDate = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 60 * 60 * 1000); // Si no hay exp, usa 1 hora por defecto

    console.log("Token expira en:", expirationDate.toLocaleString("es-ES", { timeZone: "America/New_York" }));
    console.log("Token expira en (hora local):", expirationDate.toLocaleString());

    const response = NextResponse.json({ success: true, token });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expirationDate, // Se usa expires en vez de maxAge
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
  }
}
