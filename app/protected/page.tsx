"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Obtener token desde la cookie
    const storedToken = Cookies.get("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    console.log("Hay Token!");
    // Escuchar cambios en la autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser); // Guardar usuario en el estado
    });

    return () => unsubscribe();
  }, [token])
  

  return (
    <div>
      <h1>Página Protegida</h1>
      {user ? (
        <div>
          <p>Nombre: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <p>UID: {user.uid}</p>
        </div>
      ) : (
        <p>No tienes acceso</p>
      )}
    </div>
  );
}
