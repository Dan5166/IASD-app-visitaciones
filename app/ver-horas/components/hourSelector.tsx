"use client";

import { useEffect, useState } from "react";
import { useDateStore } from "@/app/store/useDateStore";
import { getDocument } from "@/lib/firebase";

type HourStatus = "no-disponible" | "reservada" | "libre";
type HoursState = Record<string, HourStatus>;

export default function HourSelector() {
  const { selectedDate, setSelectedTime, resetForm, selectedTime } =
    useDateStore(); // Obtener estado global
  const [hours, setHours] = useState<HoursState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para el loader

  // TODO: Hacer que funcionen las horas de manana y de tarde con un estado, para que no se renderice el titulo en caso de no haber
  const [morningHours, setMorningHours] = useState<HoursState>({}); // Estado para guardar las horas de la manana
  const [afternoonHours, setAfternoonHours] = useState<HoursState>({}); // Estado para guardar las horas de la tarde

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
      // Formatea los numeros menores que 10 para que tengan un 0 antes del numero, pej: 01, 02, 03, 04, etc
      const hourString = `${hour < 10 ? "0" + hour : hour}:00`;
      // Verifica si la hora está reservada
      if (
        hours.hasOwnProperty(hourString) &&
        hours[hourString] !== "reservada" &&
        hours[hourString] !== "no-disponible"
      ) {
        // Las horas libres las agrega como un boton en un grid
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

  // Funcion para obtener las horas del dia seleccionado de la base de datos, de la coleccion horas-disponibles
  // Con id selectedDate formateado como string
  const getHoursFromDB = async () => {
    const path = `horas-disponibles/${selectedDate?.format("YYYY-MM-DD")}`;
    console.log(path);
    try {
      setIsLoading(true);
      let res = await getDocument(path);
      console.log(res);
      if (res) setHours(res.horas); // Solo si hay respuesta de la BBDD guardamos las horas
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Si hay una fecha seleccionada, se hace la llamada de las horas para esa fecha en BBDD
  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate?.format("YYYY-MM-DD"));
      // Buscamos esta fecha en la BBDD
      getHoursFromDB();
    }
  }, [selectedDate?.format("YYYY-MM-DD")]);

  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-4">Seleccione una hora</h2>
      {selectedDate && (
        <p className="mb-6">
          Horarios disponibles para el {selectedDate?.format("DD")} de{" "}
          {selectedDate?.format("MMMM")}
        </p>
      )}

      {isLoading ? (
        // Loader mientras carga
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-white border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Mañana */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Mañana</h3>
            <div className="grid grid-cols-3 gap-2">
              {hours && renderTimeGrid("00:00", "12:00")}{" "}
              {/* Horas de 00:00 a 11:00 */}
            </div>
          </div>

          {/* Tarde */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Tarde</h3>
            <div className="grid grid-cols-3 gap-2">
              {hours && renderTimeGrid("12:00", "23:00")}{" "}
              {/* Horas de 12:00 a 23:00 */}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={resetForm}
        className="p-3 bg-[#27272a] rounded-md text-white mt-5 cursor-pointer"
      >
        {"< "}Volver a seleccionar fecha
      </button>
    </div>
  );
}
