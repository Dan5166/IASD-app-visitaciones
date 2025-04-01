"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { format, addDays, parseISO } from "date-fns";
import Navbar from "@/components/navbar";

export default function WeekAdminPag() {
  const [weekData, setWeekData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const saveFullWeek = async () => {
    const batch = writeBatch(db);
    const startDateObj = parseISO(startDate);
    const weekDays = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const querySnapshot = await getDocs(collection(db, "horas-disponibles"));
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, "horas-disponibles", document.id));
    });

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDateObj, i);
      const date = format(currentDate, "yyyy-MM-dd");
      const dayName = weekDays[currentDate.getDay()];
      const dayNumber = currentDate.getDate();

      const hours: Record<string, "disponible" | "reservada"> = {};
      for (let hour = 8; hour <= 21; hour++) {
        const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
        hours[formattedHour] = "disponible";
      }

      const data = {
        fecha: date,
        nombre_dia: dayName,
        numero_dia: dayNumber,
        horas: hours,
      };

      const docRef = doc(db, "horas-disponibles", date);
      batch.set(docRef, data);
    }

    await batch.commit();
    console.log("Semana guardada exitosamente en Firebase");
    fetchWeekData();
  };

  const fetchWeekData = async () => {
    const querySnapshot = await getDocs(collection(db, "horas-disponibles"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setWeekData(data);
  };

  useEffect(() => {
    fetchWeekData();
  }, []);

  useEffect(() => {
    if(startDate) console.log("Startdate:   ",startDate);
  }, [startDate]);

  return (
    <>
      <Navbar />
      <div className="w-full p-6 bg-gray-50 min-h-screen flex flex-col align-middle">
        <div className="mt-20 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Administración de Horarios
          </h1>
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Selecciona la fecha de inicio:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const selectedDate = parseISO(e.target.value);

                // Si el día seleccionado no es lunes (1 en `getDay()`), ajustarlo
                if (selectedDate.getDay() !== 1) {
                  const nextMonday = addDays(
                    selectedDate,
                    (8 - selectedDate.getDay()) % 7
                  );
                  setStartDate(format(nextMonday, "yyyy-MM-dd"));
                } else {
                  setStartDate(e.target.value);
                }
              }}
              className="p-2 border rounded-lg w-full"
            />
          </div>

          <button
            onClick={saveFullWeek}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-all"
          >
            Liberar semana completa
          </button>
        </div>

        <div className="mt-6 max-w-4xl mx-auto grid grid-cols-7 gap-4">
          {weekData.map((day) => (
            <div
              key={day.id}
              className={`p-4 border rounded-lg text-center shadow-sm cursor-pointer transition-all 
              ${
                selectedDay === day.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setSelectedDay(day.id)}
            >
              <p className="font-bold">{day.nombre_dia}</p>
              <p className="text-sm text-gray-600">{day.fecha}</p>
            </div>
          ))}
        </div>

        {selectedDay && (
          <div className="mt-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Horas disponibles para {selectedDay}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(
                weekData.find((day) => day.id === selectedDay)?.horas || {}
              ).map(([hour, status]: any) => (
                <div
                  key={hour}
                  className={`p-2 text-center border rounded-lg 
                    ${
                      status === "disponible"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
