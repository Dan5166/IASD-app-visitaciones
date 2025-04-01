"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useVisitationStore } from "@/store/useVisitationsStore";
import Link from "next/link";
import Breadcrumbs from "@/components/breadCrumbs";

export default function VisitationsTable() {
  //const router = useRouter(); // Hook para manejar la navegación
  const { fetchUser, user } = useUserStore();
  const {
    fetchVisitations,
    visitations,
    claimVisit,
    visitators,
    isLoadingVisitations,
    isLoadingVisitators,
  } = useVisitationStore();
  
  const breadcrumbPath = [
    { label: "Inicio", href: "/" },
    { label: "Visitador" },
  ];

  // Carga las visitaciones y los usuarios desde la API llamanda en Zustand
  useEffect(() => {
    fetchVisitations();
    fetchUser();
  }, []);

  useEffect(() => {
    if (visitations) console.log('VISITATIONS',visitations);
    else console.log('YIAASTEEEEEE');
  }, [visitations]);

  useEffect(() => {
    if (user) console.log('USER',user);
    else console.log('USEREERENOONNOOOOOOOOO');
  }, [user]);

  // TODO: Hacer que el nombre del visitador sea un link a su perfil
  const handleClaimVisit = async (visitId: string, visitatorId: string) => {
    try {
      await claimVisit(visitId, visitatorId);
    } catch (error) {
      console.error(error);
    }
    fetchVisitations();
  };

  const handleEditVisit = (visitId: string) => {
    // Lógica para editar visita (navegar a una página de edición o mostrar un formulario)
    console.log(`Editando visita ${visitId}`);
    // router.push(`/edit-visit/${visitId}`);
  };

  const handleDeleteVisit = (visitId: string) => {
    // Lógica para eliminar la visita
    console.log(`Eliminando visita ${visitId}`);
    // Aquí puedes hacer una llamada a la API para eliminar la visita
  };

  return (
    <div className="bg-[#f3f4f6] p-6 border border-[#27272a]">
      <h2 className="text-3xl font-bold mb-4">Lista de Visitaciones</h2>
      {isLoadingVisitations ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-black border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Breadcrumbs path={breadcrumbPath}/>
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
                  <tr
                    key={visita.id}
                    className="text-center hover:bg-[#d2dff1] text-black"
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
                      {!isLoadingVisitators && visita.visitatorId ? (
                        <Link
                        href={`/visitador/${visita.visitatorId}`}
                        className="text-blue-500 underline cursor-pointer"
                      >
                        {visitators[visita.visitatorId]} {/* Muestra el nombre como link */}
                      </Link>
                      ) : (
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                          onClick={() => handleClaimVisit(visita.id, user.uid)}
                        >
                          Reclamar
                        </button>
                      )}
                    </td>
                    {/* Columna de Acciones */}
                    <td className="p-3 border border-[#27272a]">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                        onClick={() => handleEditVisit(visita.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 ml-2 cursor-pointer"
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
