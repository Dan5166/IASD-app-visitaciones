"use client";

import { useDateStore } from "@/app/store/useDateStore";
import { setDocument, updateDocument } from "@/lib/firebase";
import { Dayjs } from "dayjs";
import React from "react";
import { Timestamp } from "firebase/firestore"; // Importa Timestamp de Firebase

interface Visitation {
  requestedDate: Timestamp; // De aca se pueden obtener todos los datos, como fecha y hora
  patientInfo: {
    // TODO: Guardar el patient info en otra coleccion - visitados, con el RUT como ID
    fullName: string;
    email: string;
    phone: string;
    reason: string;
  };
}

export default function Confirmation() {
  const { selectedDate, selectedTime, patientInfo, setActiveTab, resetForm } =
    useDateStore();

  // Función para actualizar el estado de una hora específica
  const updateHourStatus = async (date: string, hour: string, status: string) => {
    try {
      const path = `horas-disponibles/${date}`;
      
      // Crea el objeto de actualización para la hora específica
      const updateData = {
        [`horas.${hour}`]: status,  // Se accede a la clave 'horas' y se actualiza la hora específica
      };
      
      // Realiza la actualización en Firebase
      await updateDocument(path, updateData);
      console.log(`La hora ${hour} fue actualizada con éxito en ${path}`);
    } catch (error) {
      console.error("Error al actualizar la hora:", error);
    }
  };

  // Función para confirmar la reserva
  const handleConfirm = async () => {
    console.log(selectedDate);

    let fechaYHoraReserva = null;
    let requestedDate = null;
    if (selectedDate && selectedTime) {
      // const fechaSinHoraCorrecta = Timestamp.fromDate(selectedDate.toDate());
      // Transformo la hora que estaba en string a entero
      const horaEntero = parseInt(selectedTime.split(":")[0], 10);
      fechaYHoraReserva = selectedDate
        .hour(horaEntero)
        .minute(0)
        .second(0)
        .millisecond(0);
      requestedDate = Timestamp.fromDate(fechaYHoraReserva.toDate());
      console.log("TIMESTAMP CORRECTO:    ", requestedDate);
    }

    let visitation: Visitation | null = null;

    if (fechaYHoraReserva && requestedDate) {
      visitation = {
        requestedDate: requestedDate,
        patientInfo: patientInfo,
      };

      const id = `${fechaYHoraReserva.format("YYYY-MM-DDTHH:mm")}`;
      const path = `reservas-activas/${id}`;

      try {
        await setDocument(path, visitation);
        await updateHourStatus(fechaYHoraReserva.format("YYYY-MM-DD"), fechaYHoraReserva.format("HH:mm"), "reservada");
      } catch (error) {
        console.error(error);
      }

      alert("Reserva confirmada");
    } else {
      alert("No se pudo completar tu reserva");
    }

    // Limpiar el estado o redirigir al usuario según sea necesario
    resetForm();
  };

  // Función para cancelar la reserva
  const handleCancel = () => {
    // Limpiar el estado y redirigir al primer tab
    resetForm();
  };

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-2">Confirmación de Visita</h2>

      {/* Detalles de la cita */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Detalles de la Cita</h3>
        <p>
          <strong>Fecha:</strong> {selectedDate?.format("DD MMMM YYYY")}
        </p>
        <p>
          <strong>Hora:</strong>{" "}
          {selectedTime ? `${selectedTime}` : "No definida"}
        </p>
      </div>

      {/* Información del paciente */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Información del Visitante</h3>
        <p>
          <strong>Nombre:</strong> {patientInfo?.fullName}
        </p>
        <p>
          <strong>Correo:</strong> {patientInfo?.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {patientInfo?.phone}
        </p>
      </div>

      {/* Motivo de la consulta */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Tipo de Visita</h3>
        <p>{patientInfo?.reason}</p>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
        >
          Cancelar Reserva
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
        >
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
}
