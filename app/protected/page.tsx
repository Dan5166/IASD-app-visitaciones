"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter

export default function ProtectedPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Hook para manejar la navegación

  const handleLogout = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include", // Importante para enviar cookies
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      router.push("/login"); // Redirige al login
    } else {
      console.error("Error al cerrar sesión:", data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include",
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setUser(data.user);
        } else {
          console.error("Error al obtener usuario:", data.message);
          router.push("/login"); // 🔥 Redirige al login si la autenticación falla
        }
      } catch (error) {
        console.error("Error de red:", error);
        router.push("/login"); // 🔥 También redirige en caso de error de conexión
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [router]); 

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Página Protegida</h1>
      {user ? (
        <div>
          <p><strong>Nombre:</strong> {user.name || "No disponible"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
          <button onClick={handleLogout} disabled={loading}>
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      ) : (
        <p>No tienes acceso</p>
      )}
    </div>
  );
}
