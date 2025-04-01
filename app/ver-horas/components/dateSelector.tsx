import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import dayjs, { Dayjs } from "dayjs";
import { useDateStore } from "@/store/useDateStore";

// Define la estructura de los datos para la semana disponible
interface AvailableDate {
  id: string;
  fecha: string;
  horas: Record<string, string>;
  nombre_dia: string;
  numero_dia: number;
}

export default function DateSelector() {
  const [weekData, setWeekData] = useState<AvailableDate[]>([]); // Semana obtenida de la BBDD
  const [availableDates, setAvailableDates] = useState<Dayjs[]>([]); // Revisa si un dia esta disponible para eleccion (dentro de la semana liberada)
  const {selectedDate, setSelectedDate} = useDateStore(); // Storage para almacenar el dia seleccionado
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs()); // Mes actual para renderizar en el calendario
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para mostrar el loader

  // Controles del calendario
  const goToNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));
  const goToPreviousMonth = () =>
    setCurrentMonth((prev) => prev.subtract(1, "month"));

  // Datos del calendario
  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );

  // Funcion para obtener la semana liberada de la base de datos, de la coleccion horas-disponibles
  const getWeekFromDB = async () => {
    setIsLoading(true); // La pagina esta cargando, Loader activo
    try {
      const querySnapshot = await getDocs(collection(db, "horas-disponibles")); // Obtenemos la coleccion entera de horas disponibles
      const data: AvailableDate[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AvailableDate[];
      if (data) setWeekData(data); // Solo si hay respuesta de la BBD guardamos en la weekData
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setIsLoading(false); // Detiene el loader al terminar de cargar la semana liberada
    }
  };

  const isAvailable = (day: Dayjs) => {
    // Revisa si un dia esta disponible (dentro de la semana liberada)
    return availableDates.some((availableDate) =>
      availableDate.isSame(day, "day")
    );
  };

  // Al renderizar la pagina carga las horas disponibles (gatillando la funcion getWeekFromDB())
  useEffect(() => {
    getWeekFromDB();
  }, []);

  // Se obtienen las fechas disponibles convirtiendo cada fecha de string (llegada de firebase) a dayjs
  useEffect(() => {
    if (weekData.length > 0) {
      const dates = weekData.map((entry) => dayjs(entry.fecha));
      setAvailableDates(dates);
    }
  }, [weekData]);

  return (
    <div className="bg-[#f3f4f6] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-2">Seleccione una fecha</h2>
      <p className="mb-6">
        Semana disponible: 24 de marzo - 30 de marzo de 2025
      </p>

      {isLoading ? (
        // Loader mientras carga
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-black border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousMonth}
              className="text-xl font-bold text-black hover:bg-[#313131] hover:text-white p-2 rounded-md"
            >
              {"<"}
            </button>
            <h2 className="text-xl font-bold">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button
              onClick={goToNextMonth}
              className="text-xl font-bold text-black hover:bg-[#313131] hover:text-white p-2 rounded-md"
            >
              {">"}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((day) => (
              <div key={day} className="text-center text-black p-2">
                {day}
              </div>
            ))}

            {days.map((day) => (
              <button
                key={day.format("YYYY-MM-DD")}
                onClick={() => isAvailable(day) && setSelectedDate(day)}
                disabled={!isAvailable(day)}
                className={`p-4 rounded-md text-center transition-all ${
                  selectedDate?.isSame(day, "day")
                    ? "bg-[#18181a] text-black font-black"
                    : isAvailable(day)
                    ? "text-black hover:bg-[#313131] hover:text-white cursor-pointer"
                    : "text-[#c7c6c6] cursor-default"
                }`}
              >
                {day.format("D")}
              </button>
            ))}
          </div>

          {selectedDate && (
            <p className="mt-4 text-center">
              Día seleccionado:{" "}
              <strong>{selectedDate.format("DD MMMM YYYY")}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
}
