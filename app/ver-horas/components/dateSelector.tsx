import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import dayjs, { Dayjs } from "dayjs";
import { useDateStore } from "@/app/store/useDateStore";


// Define la estructura de los datos
interface AvailableHour {
  id: string;
  fecha: string; // Ajusta según tu estructura en Firebase
  horas: Record<string, string>; // Ejemplo: { "08:00": "libre", "10:00": "reservada" }
  nombre_dia: string;
  numero_dia: number;
}

export default function DateSelector() {
  const [weekData, setWeekData] = useState<AvailableHour[]>([]); // Ahora sí tiene un tipo
  const [availableDates, setAvailableDates] = useState<Dayjs[]>([]); // Ahora se llena con weekData
  const { selectedDate, setSelectedDate, setActiveTab } = useDateStore(); // Obtener el estado global
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => startOfMonth.add(i, "day"));

  const fetchWeekData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "horas-disponibles"));
      const data: AvailableHour[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AvailableHour[]; // Asegura que el tipo coincida
      setWeekData(data);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  useEffect(() => {
    fetchWeekData(); // Llama a la función correctamente dentro de useEffect
  }, []);

  useEffect(() => {
    if (weekData.length>0) {
      console.log(weekData); // Ahora sí se imprimirá correctamente cuando los datos se actualicen
    }
  }, [weekData]);

  const isAvailable = (day: Dayjs) => {
    return availableDates.some((availableDate) => availableDate.isSame(day, "day"));
  };

  const goToNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));
  const goToPreviousMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));

  useEffect(() => {
    if (weekData.length > 0) {
      console.log("WEEKDATA:  ",weekData)
      const dates = weekData.map((entry) => dayjs(entry.fecha)); // Convierte las fechas de string a dayjs
      setAvailableDates(dates);
    }
  }, [weekData]);

  useEffect(() => {
    if (availableDates.length > 0) {
      console.log(availableDates)
    }
  }, [availableDates]);



  return (
    <div className="bg-[#09090b] p-6 border border-[#27272a] rounded-md">
      <h2 className="text-3xl font-bold mb-2">Seleccione una fecha</h2>
      <p className="mb-6">Semana disponible: 24 de marzo - 30 de marzo de 2025</p>

      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="text-xl font-bold text-white hover:bg-[#27272a] p-2 rounded-md">
          {"<"}
        </button>
        <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>
        <button onClick={goToNextMonth} className="text-xl font-bold text-white hover:bg-[#27272a] p-2 rounded-md">
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day.format("YYYY-MM-DD")}
            onClick={() => isAvailable(day) && setSelectedDate(day)} // Cambia la fecha en Zustand
            disabled={!isAvailable(day)}
            className={`p-4 rounded-md text-center transition-all ${
              selectedDate?.isSame(day, "day") ? "bg-[#18181a] text-white font-black" :
              isAvailable(day) ? "text-[#ededee] hover:bg-[#27272a] cursor-pointer" :
              "text-[#47474d] cursor-default"
            }`}
          >
            {day.format("D")}
          </button>
        ))}
      </div>

      {selectedDate && (
        <p className="mt-4 text-center">
          Día seleccionado: <strong>{selectedDate.format("DD MMMM YYYY")}</strong>
        </p>
      )}
    </div>
  );
}