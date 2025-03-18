"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDateStore } from "@/app/store/useDateStore";

export default function Calendar() {
  const { selectedDate, setSelectedDate, setActiveTab } = useDateStore(); // Obtener el estado global
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  // Lista de fechas disponibles con mes y año
  const availableDates = [
    dayjs("2025-03-05"),
    dayjs("2025-03-10"),
    dayjs("2025-04-15"),
    dayjs("2025-03-18"),
  ];

  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => startOfMonth.add(i, "day"));

  const isAvailable = (day: Dayjs) => {
    return availableDates.some((availableDate) => availableDate.isSame(day, "day"));
  };

  const goToNextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));
  const goToPreviousMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));

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
              selectedDate?.isSame(day, "day") ? "bg-[#18181a] text-white" :
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
