"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/visitador"); // TODO: Hacer que redirija condicionalmente si es visitador, admin o visitado
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Registrarse</button>
    </div>
  );
}
