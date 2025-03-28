"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export default function Visitator() {
  const { user, isLoadingUser, fetchUser } = useUserStore();

  // Carga el usuario desde la API llamada en Zustand
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-lg p-6 bg-white rounded-lg shadow-md w-full sm:w-auto">
        {user && (
          <div className="flex flex-col items-center">
            <img
              src={user.image || "/default-avatar.jpg"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-gray-600">Correo: {user.email}</p>
            <p className="text-gray-600">UID: {user.uid}</p>
            <p className="text-gray-600">
              Fecha de creación: a
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
