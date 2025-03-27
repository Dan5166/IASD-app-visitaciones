import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const response = NextResponse.json({ success: true, token });

    response.cookies.set("token", token, {
      httpOnly: true, // Seguridad: evita que JavaScript acceda a la cookie
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 });
  }
}
