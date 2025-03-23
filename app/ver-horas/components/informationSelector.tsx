"use client";

import { useDateStore } from "@/app/store/useDateStore";
import React, { useState } from "react";

export default function InformationSelector() {
  const { setPatientInfo, resetHour, setVisitType, visitType } = useDateStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientInfo({ fullName, email, phone });
    console.log("Cita confirmada");
    console.log({ fullName, email, phone, reason, visitType });
  };

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Información del Visitado
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-white">
            Nombre Completo
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-md text-white bg-[#27272a] border border-gray-600"
            placeholder="Escribe tu nombre completo"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-white">
            Correo
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md text-white bg-[#27272a] border border-gray-600"
            placeholder="Escribe tu correo electrónico"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-white">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-md text-white bg-[#27272a] border border-gray-600"
            placeholder="Escribe tu número de teléfono"
            required
          />
        </div>

        <div>
          <label htmlFor="visitType" className="block text-white">
            Tipo de Visita
          </label>
          <select
            id="visitType"
            value={visitType}
            onChange={(e) =>
              setVisitType(
                e.target.value as
                  | "En Domicilio"
                  | "En Iglesia"
                  | "Punto de encuentro"
                  | "Online"
              )
            }
            className="w-full p-3 rounded-md text-white bg-[#27272a] border border-gray-600"
            required
          >
            <option value="En Domicilio">En Domicilio</option>
            <option value="En Iglesia">En Iglesia</option>
            <option value="Punto de encuentro">Punto de encuentro</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div className="text-center">
          <button
            onClick={resetHour}
            className="p-3 bg-[#27272a] rounded-md text-white mt-5 cursor-pointer"
            type="button"
          >
            {"< "}Volver a seleccionar fecha
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition ml-2"
          >
            Confirmar Información
          </button>
        </div>
      </form>
    </div>
  );
}
