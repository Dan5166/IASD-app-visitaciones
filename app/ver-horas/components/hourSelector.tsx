"use client";

import { useEffect, useState } from "react";
import { useDateStore } from "@/app/store/useDateStore";
import { getDocument } from "@/lib/firebase";

type HourStatus = "no-disponible" | "reservada" | "libre";
type HoursState = Record<string, HourStatus>;

export default function HourSelector() {
  const { selectedDate, setSelectedTime, resetForm, selectedTime } = useDateStore(); // Obtener estado global
  const [hours, setHours] = useState<HoursState>({})

  const handleTimeSelect = (hour: string) => {
    // Solo pasa la hora como string, por ejemplo, "10:00", "14:30", etc.
    setSelectedTime(hour);
  };
  

  const renderTimeGrid = (startHour: string, endHour: string) => {
    const timeSlots = [];
    
    // Convierte las horas de string a número
    const start = parseInt(startHour.split(":")[0], 10);
    const end = parseInt(endHour.split(":")[0], 10);
    console.log(hours)
    for (let hour = start; hour < end; hour++) {
      const hourString = `${hour < 10 ? '0' + hour : hour}:00`;
      console.log('Hora revisada: ', hourString);
      console.log('Existe en dict?:   ', hours.hasOwnProperty(hourString))
      // Verifica si la hora está reservada - TODO: Arreglar .. String no se puede usar como ID, alternativa, usar int y despues formatearlo como hora
      if (hours.hasOwnProperty(hourString) && hours[hourString] !== "reservada" && hours[hourString] !== "no-disponible") {
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

  const getHoursFromDB = async () => {
    const path = `horas-disponibles/${selectedDate?.format("YYYY-MM-DD")}`
      console.log(path)
      try {
        let res = await getDocument(path);
        console.log(res);
        setHours(res.horas);
      } catch (error: any) {
        console.error(error.message)
      }
  }

  // Revisamos si existe una fecha seleccionada, que este en Firebase
  useEffect(() => {
    if(selectedDate){
      console.log(selectedDate?.format("YYYY-MM-DD"));
      // Buscamos esta fecha en el Firebase
      getHoursFromDB();
    }
  }, [selectedDate?.format("YYYY-MM-DD")])

  // Revisamos si existe una fecha seleccionada, que este en Firebase
  useEffect(() => {
    if(hours){
      console.log(hours)
    }
  }, [hours]) 
  
  
  

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
            {hours && renderTimeGrid("00:00", "12:00")} {/* Horas de 00:00 a 11:00 */}
          </div>
        </div>

        {/* Tarde */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Tarde</h3>
          <div className="grid grid-cols-3 gap-2">
            {hours && renderTimeGrid("12:00", "23:00")} {/* Horas de 12:00 a 23:00 */}
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