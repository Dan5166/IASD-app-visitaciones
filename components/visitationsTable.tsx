"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, updateDocument } from "@/lib/firebase";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useVisitationStore } from "@/store/useVisitationsStore";

// Define la estructura de los datos para la semana disponible
interface Visitation {
  id: string;
  requestedDate: Timestamp;
  createdAt: Timestamp;
  visitType: "En Domicilio" | "En Iglesia" | "Punto de encuentro" | "Online";
  visitatorId: string | null;
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface VisitadorData {
  [key: string]: string; // Las claves son strings (ID del usuario) y los valores son strings (nombre del visitador)
}

export default function VisitationsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Hook para manejar la navegación

  const { fetchUser, user } = useUserStore();
  const { fetchVisitations, visitations, claimVisit, visitators } = useVisitationStore();

  const awaitVisitations = async () => {
    setIsLoading(true);
    try {
      await fetchVisitations();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga las visitaciones desde la API llamanda en Zustand
  useEffect(() => {
    awaitVisitations();
  }, [router]);

  // Busca el usuario en la API, esto para saber si el usuario esta guardado en las cookies desde el servidor
  useEffect(() => {
    fetchUser();
  }, [router]);

  // TODO: Hacer que el nombre del visitador sea un link a su perfil
  const handleClaimVisit = async(visitId: string, visitatorId: string) => {
    try {
      setIsLoading(true);
      await claimVisit(visitId, visitatorId);
    } catch (error) {
      console.error(error);
    }
    await awaitVisitations();
  };

  const handleEditVisit = (visitId: string) => {
    // Lógica para editar visita (navegar a una página de edición o mostrar un formulario)
    console.log(`Editando visita ${visitId}`);
    // Puedes agregar una navegación a una página de edición, por ejemplo:
    // router.push(`/edit-visit/${visitId}`);
  };

  const handleDeleteVisit = (visitId: string) => {
    // Lógica para eliminar la visita
    console.log(`Eliminando visita ${visitId}`);
    // Aquí puedes hacer una llamada a la API para eliminar la visita
  };

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-4">Lista de Visitaciones</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-[#27272a]">
            <thead>
              <tr className="bg-[#18181a] text-white">
                <th className="p-3 border border-[#27272a]">Fecha</th>
                <th className="p-3 border border-[#27272a]">Hora</th>
                <th className="p-3 border border-[#27272a]">Nombre</th>
                <th className="p-3 border border-[#27272a]">Tipo de Visita</th>
                <th className="p-3 border border-[#27272a]">Visitador</th>
                <th className="p-3 border border-[#27272a]">Acciones</th>
              </tr>
            </thead>
            <tbody>
  {user && visitations && visitations.length > 0 ? (
    visitations.map((visita) => (
      <tr key={visita.id} className="text-center hover:bg-[#27272a] text-white">
        <td className="p-3 border border-[#27272a]">
          {dayjs
            .unix(visita.requestedDate.seconds)
            .format("DD/MM/YYYY")}
        </td>
        <td className="p-3 border border-[#27272a]">
          {dayjs(visita.id).format("HH:mm")}
        </td>
        <td className="p-3 border border-[#27272a]">
          {visita.patientInfo.fullName}
        </td>
        <td className="p-3 border border-[#27272a]">
          {visita.visitType}
        </td>
        <td className="p-3 border border-[#27272a]">
          {visita.visitatorId ? (
            visitators[visita.visitatorId] || "Cargando..."
          ) : (
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleClaimVisit(visita.id, user.uid)}
            >
              Reclamar
            </button>
          )}
        </td>
        {/* Columna de Acciones */}
        <td className="p-3 border border-[#27272a]">
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleEditVisit(visita.id)}
          >
            Editar
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
            onClick={() => handleDeleteVisit(visita.id)}
          >
            Eliminar
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="p-3 text-center text-gray-400">
        No hay visitaciones registradas
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
