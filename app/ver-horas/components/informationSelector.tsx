"use client"

import { useDateStore } from '@/app/store/useDateStore';
import React, { useState } from 'react';

export default function InformationSelector() {
  const { setPatientInfo, resetHour } = useDateStore(); // Accede a la función para actualizar la info del paciente
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientInfo({ fullName, email, phone, reason }); // Guardar la información en Zustand
    console.log('Cita confirmada');
    console.log({ fullName, email, phone, reason });
  };

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Información del Paciente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-white">Nombre Completo</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-md text-white"
            placeholder="Escribe tu nombre completo"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-white">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md text-white"
            placeholder="Escribe tu correo electrónico"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-white">Teléfono</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-md text-white"
            placeholder="Escribe tu número de teléfono"
            required
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-white">Motivo de la Consulta</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 rounded-md text-white"
            placeholder="Escribe el motivo de tu consulta"
            rows={4}
            required
          />
        </div>

        <div className="text-center">
        <button
        onClick={resetHour}
        className="p-3 bg-[#27272a] rounded-md text-white mt-5 cursor-pointer"
      >
        {"< "}Volver a seleccionar fecha
      </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
          >
            Confirmar Informacion
          </button>
        </div>
      </form>
    </div>
  );
}
