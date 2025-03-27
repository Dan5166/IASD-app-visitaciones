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
import { useUserStore } from "@/store/authStore";

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
  const [visitaciones, setVisitaciones] = useState<Visitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitadores, setVisitadores] = useState<VisitadorData>({});
  const router = useRouter(); // Hook para manejar la navegación

  const { fetchUser, user } = useUserStore();

  // Cargar visitaciones desde Firebase
  useEffect(() => {
    const fetchVisitaciones = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "reservas-activas"));
        const data: Visitation[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Visitation[];
        setVisitaciones(data);
      } catch (error) {
        console.error("Error obteniendo visitaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitaciones();
  }, []);

  // Busca el usuario en la API, esto para saber si el usuario esta guardado en las cookies desde el servidor
  useEffect(() => {
    fetchUser();
  }, [router]);

  // Cargar datos de visitadores desde la colección 'users' - TODO: Esto podria volverse un hook para no repetir tanto el codigo
  useEffect(() => {
    const fetchVisitadores = async () => {
        const visitadoresData: VisitadorData = {};
      for (const visita of visitaciones) {
        if (visita.visitatorId && !visitadoresData[visita.visitatorId]) {
          const userDoc = await getDoc(doc(db, `users/${visita.visitatorId}`));
          if (userDoc.exists()) {
            visitadoresData[visita.visitatorId] = userDoc.data().name;
          } else {
            visitadoresData[visita.visitatorId] = "No Identificado";
          }
        }
      }
      setVisitadores(visitadoresData);
    };

    if (visitaciones.length > 0) {
      fetchVisitadores();
    }
  }, [visitaciones]);

  // Reclamar visita asignando el ID del usuario autenticado - TODO: Esto igual podria volverse un Hook, para poder reutilizarlo en la pagina de Admin al asignar manualmente visitadores
  const handleClaimVisit = async (id:string) => {
    if (!user)
      return alert("Debes iniciar sesión para reclamar esta visita.");

    try {
      const userId = user.uid;
      await updateDocument(`reservas-activas/${id}`, { visitatorId: userId });

      setVisitaciones((prev) =>
        prev.map((visita) =>
          visita.id === id ? { ...visita, visitatorId: userId } : visita
        )
      );
    } catch (error) {
      console.error("Error al reclamar la visita:", error);
    }
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
              </tr>
            </thead>
            <tbody>
              {visitaciones.length > 0 ? (
                visitaciones.map((visita) => (
                  <tr
                    key={visita.id}
                    className="text-center hover:bg-[#27272a] text-white"
                  >
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
                        visitadores[visita.visitatorId] || "Cargando..."
                      ) : (
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => handleClaimVisit(visita.id)}
                        >
                          Reclamar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
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
