"use client";

import { useDateStore } from "@/store/useDateStore";
import React, { useState } from "react";

export default function InformationSelector() {
  const { setPatientInfo, resetHour, setVisitType, visitType } = useDateStore(); // Obtenemos los valores necesarios del store
  const [fullName, setFullName] = useState(""); // Nombre completo de la persona
  const [email, setEmail] = useState(""); // Email de la persona
  const [phone, setPhone] = useState(""); // Telefono de la persona
  const [age, setAge] = useState(""); // Edad de la persona - TODO: Agregar guardado en BBDD de la edad de la persona
  const [ageError, setAgeError] = useState<string | null>(null); // Estado para el error de edad

  // Función para validar la edad
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const ageNumber = parseInt(value, 10);

    if (isNaN(ageNumber) || ageNumber < 15 || ageNumber > 120) {
      setAgeError("La edad debe estar entre 15 y 120 años.");
    } else {
      setAgeError(null);
    }

    setAge(value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientInfo({ fullName, email, phone }); // En el store se guarda la info del paciente y se cambia el Tab a confirmation
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
          <label htmlFor="age" className="block text-white">
            Edad
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={handleAgeChange}
            className={`w-full p-3 rounded-md text-white bg-[#27272a] border ${
              ageError ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Escribe tu edad"
            required
          />
          {ageError && <p className="text-red-500 text-sm mt-1">{ageError}</p>}
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
