"use client"

import { useDateStore } from "@/app/store/useDateStore";
import { setDocument } from "@/lib/firebase";
import { Dayjs } from "dayjs";
import React from "react";
import { Timestamp } from "firebase/firestore"; // Importa Timestamp de Firebase

interface Visitation {
  timeStampSelected: Timestamp; // De aca se pueden obtener todos los datos, como fecha y hora
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
    reason: string;
  };
}

export default function Confirmation() {
    const { selectedDate, selectedTime, patientInfo, setActiveTab, resetForm } = useDateStore();
  
    // Función para confirmar la reserva
    const handleConfirm = async () => {
      console.log(selectedDate);

      let timestampConHoraCorrecta = null;
      let fechaConHoraCorrecta = null;
      if(selectedDate && selectedTime) {
        // const fechaSinHoraCorrecta = Timestamp.fromDate(selectedDate.toDate());
        // Transformo la hora que estaba en string a entero
        const horaEntero = parseInt(selectedTime.split(":")[0], 10);
        fechaConHoraCorrecta = selectedDate.hour(horaEntero).minute(0).second(0).millisecond(0);
        timestampConHoraCorrecta = Timestamp.fromDate(fechaConHoraCorrecta.toDate())
        console.log("TIMESTAMP CORRECTO:    ", fechaConHoraCorrecta)
      }
    
      if(!fechaConHoraCorrecta){
        // Limpiar el estado o redirigir al usuario según sea necesario
        resetForm();
        return false;
      }

     const visitation = {
      timestampConHoraCorrecta,
      patientInfo
     }
    
      const id = `${fechaConHoraCorrecta.format('YYYY-MM-DDTHH:mm')}`;
      const path = `reservas/${id}`;
      
      try {
        await setDocument(path, visitation);
      } catch (error) {
        console.error(error);
      }
    
      alert("Reserva confirmada");
    
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
          <p><strong>Fecha:</strong> {selectedDate?.format("DD MMMM YYYY")}</p>
          <p><strong>Hora:</strong> {selectedTime ? `${selectedTime}` : 'No definida'}</p>
        </div>
  
        {/* Información del paciente */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Información del Visitante</h3>
          <p><strong>Nombre:</strong> {patientInfo?.fullName}</p>
          <p><strong>Correo:</strong> {patientInfo?.email}</p>
          <p><strong>Teléfono:</strong> {patientInfo?.phone}</p>
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
