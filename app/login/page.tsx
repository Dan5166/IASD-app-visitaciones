"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        throw new Error("Credenciales incorrectas");
      }
  
      const data = await res.json();
  
      router.push("/visitador"); // Redirección condicional dependiendo del rol mayor del usuario
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al iniciar sesión", error);
        alert(error.message);
      } else {
        console.error("Error desconocido", error);
        alert("Ocurrió un error inesperado.");
      }
    }
  };
  

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}
