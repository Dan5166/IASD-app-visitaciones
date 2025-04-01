"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/breadCrumbs";

interface User {
  createdAt: Timestamp | null;
  email: string;
  image: string;
  name: string;
  uid: string;
}

export default function ProfileEditor() {
  const { user, searchedUser, fetchSearchedUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [searchedUserData, setSearchedUserData] = useState<User | null>();
  const { id } = useParams();

  const breadcrumbPath = [
    { label: "Inicio", href: "/" },
    { label: "Visitador", href: "/visitador" },
    { label: `Perfil de ${id}` }, // Último elemento sin enlace
  ];

  const handleCopyUserId = () => {
    if (searchedUser?.uid) {
      navigator.clipboard.writeText(searchedUser.uid);
      alert("User ID copiado al portapapeles!");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(searchedUserData)
    setSearchedUserData({ ...searchedUserData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí puedes enviar los datos al backend para actualizar el perfil
    console.log("Datos guardados:", searchedUserData);
  };

  useEffect(() => {
    if (!id) return;
    const userId = Array.isArray(id) ? id[0] : id; // Convierte a string si es un array
    console.log("REQ USER:  ", userId);
    fetchSearchedUser(userId);
  }, [id]);
  

  useEffect(() => {
    if(!searchedUser) return;
    setSearchedUserData(searchedUser);
    console.log("Usuario cargado correctamente:   ", searchedUser);
  }, [searchedUser]);

  useEffect(() => {
    if(!searchedUserData) return;
    console.log("Usuario SETEADO correctamente:   ", searchedUserData);
  }, [searchedUserData]);
  

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <Breadcrumbs path={breadcrumbPath}/>
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        {/* Lado Izquierdo */}
        <div className="md:w-1/3 flex flex-col items-center border-r p-4">
          <h2 className="text-xl font-semibold">{searchedUser?.name || "Sin Nombre"}</h2>
          
          {/* User ID con botón copiar */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-gray-600 text-sm">{searchedUser?.uid}</span>
            <button
              onClick={handleCopyUserId}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              📋 Copiar
            </button>
          </div>
  
          {/* Imagen de Perfil */}
          <div className="relative mt-4">
            <img
              src={searchedUser?.image || "/default-avatar.jpg"}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/*"
            />
          </div>
  
          {/* Botón para subir nueva foto */}
          <label
            htmlFor="fileUpload"
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300"
          >
            📷 Subir Foto
          </label>
        </div>
  
        {/* Lado Derecho */}
        <div className="md:w-2/3 p-4">
          <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
  
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input
                type="text"
                name="name"
                value={searchedUserData?.name || "Nombre"}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing ? "border-blue-500" : "border-gray-300 bg-gray-100"
                }`}
              />
            </div>
  
            <div>
              <label className="text-sm text-gray-600">Correo</label>
              <input
                type="email"
                name="email"
                value={searchedUserData?.email || "user@email.com"}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing ? "border-blue-500" : "border-gray-300 bg-gray-100"
                }`}
              />
            </div>
          </div>
  
          {/* Botón Editar / Guardar */}
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEditing ? "Guardar Cambios" : "Editar"}
          </button>
        </div>
      </div>
    </div>
  );
  
}
