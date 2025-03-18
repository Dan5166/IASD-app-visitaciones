"use client";

import { useState } from "react";
import { useDateStore } from "@/app/store/useDateStore";

export default function HourSelector() {
  const { selectedDate, setSelectedTime, resetForm, selectedTime } = useDateStore(); // Obtener estado global
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);

  // Objeto de horas con estado
  const hours = {
    "00:00": "no-disponible",
    "01:00": "no-disponible",
    "02:00": "no-disponible",
    "03:00": "no-disponible",
    "04:00": "no-disponible",
    "05:00": "no-disponible",
    "06:00": "no-disponible",
    "07:00": "libre",
    "08:00": "reservada",
    "09:00": "libre",
    "10:00": "reservada",
    "11:00": "libre",
    "12:00": "libre",
    "13:00": "reservada",
    "14:00": "libre",
    "15:00": "libre",
    "16:00": "libre",
    "17:00": "libre",
    "18:00": "libre",
    "19:00": "libre",
    "20:00": "libre",
    "21:00": "libre",
    "22:00": "no-disponible",
    "23:00": "no-disponible",
  };

  const handleTimeSelect = (hour: string) => {
    // Solo pasa la hora como string, por ejemplo, "10:00", "14:30", etc.
    setSelectedTime(hour);
  };
  

  const renderTimeGrid = (startHour: string, endHour: string) => {
    const timeSlots = [];
    
    // Convierte las horas de string a número
    const start = parseInt(startHour.split(":")[0], 10);
    const end = parseInt(endHour.split(":")[0], 10);
    
    for (let hour = start; hour < end; hour++) {
      const hourString = `${hour < 10 ? '0' + hour : hour}:00`;
      
      // Verifica si la hora está reservada - TODO: Arreglar .. String no se puede usar como ID, alternativa, usar int y despues formatearlo como hora
      if (hours[hourString] !== "reservada" && hours[hourString] !== "no-disponible") {
        timeSlots.push(
          <button
            key={hourString}
            onClick={() => handleTimeSelect(hourString)} // Pasa solo la hora como string
            className={`p-4 rounded-md text-center transition-all ${
              selectedTime === hourString
                ? "bg-[#18181a] text-white"
                : "bg-[#27272a] text-white hover:bg-[#47474d] cursor-pointer"
            }`}
          >
            {hourString}
          </button>
        );
      }
    }
    return timeSlots;
  };
  
  
  

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-4">Seleccione una hora</h2>
      {selectedDate && (
        <p className="mb-6">
          Horarios disponibles para el {selectedDate?.format("DD")} de{" "}
          {selectedDate?.format("MMMM")}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {/* Mañana */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Mañana</h3>
          <div className="grid grid-cols-3 gap-2">
            {renderTimeGrid("00:00", "11:00")} {/* Horas de 00:00 a 11:00 */}
          </div>
        </div>

        {/* Tarde */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Tarde</h3>
          <div className="grid grid-cols-3 gap-2">
            {renderTimeGrid("12:00", "23:00")} {/* Horas de 12:00 a 23:00 */}
          </div>
        </div>
      </div>

      <button
        onClick={resetForm}
        className="p-3 bg-[#27272a] rounded-md text-white mt-5 cursor-pointer"
      >
        {"< "}Volver a seleccionar fecha
      </button>
    </div>
  );
}