"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { format, addDays, parseISO } from "date-fns";

export default function WeekAdminPag() {
  const [weekData, setWeekData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd")); // Fecha inicial (hoy por defecto)

  // Función para guardar la semana completa en Firebase
  const saveFullWeek = async () => {
    const batch = writeBatch(db);
    const startDateObj = parseISO(startDate);
    const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    // Borrar datos antiguos de la coleccion
    const querySnapshot = await getDocs(collection(db, "horas-disponibles"));
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, "horas-disponibles", document.id));
    });

    // Crear y agregar nuevos datos a la coleccion
    // TODO: Agregar que del dia seleccionado se libere la semana desde el lunes correspondiente a esa semana
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDateObj, i);
      const date = format(currentDate, "yyyy-MM-dd");
      const dayName = weekDays[currentDate.getDay()];
      const dayNumber = currentDate.getDate();

      const hours: Record<string, "libre" | "tomada"> = {};
      for (let hour = 8; hour <= 21; hour++) {
        const formattedHour = `${hour.toString().padStart(2, "0")}:00`;
        hours[formattedHour] = "libre";
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

    // 3️⃣ Aplicar cambios
    await batch.commit();
    console.log("Semana guardada exitosamente en Firebase");

    // Recargar la lista de horarios
    fetchWeekData();
  };

  // Obtener la información desde Firebase
  const fetchWeekData = async () => {
    const querySnapshot = await getDocs(collection(db, "horas-disponibles"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setWeekData(data);
  };

  useEffect(() => {
    fetchWeekData();
  }, []);

  return (
    <div className="p-4">
      {/* Selector de fecha */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Selecciona la fecha de inicio:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* Botón para liberar la semana completa */}
      <button
        onClick={saveFullWeek}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Liberar semana completa
      </button>

      {/* Calendario de días */}
      <div className="grid grid-cols-7 gap-2">
        {weekData.map((day) => (
          <div
            key={day.id}
            className={`p-4 border rounded-lg text-center cursor-pointer 
              ${selectedDay === day.id ? "bg-blue-300" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setSelectedDay(day.id)}
          >
            <p className="font-bold">{day.nombre_dia}</p>
            <p className="text-sm">{day.fecha}</p>
          </div>
        ))}
      </div>

      {/* Detalles de las horas disponibles */}
      {selectedDay && (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Horas disponibles para {selectedDay}</h2>
          <div className="grid grid-cols-2 gap-2">  {/* ⬅️ Grid con 2 columnas */}
            {Object.entries(weekData.find((day) => day.id === selectedDay)?.horas || {}).map(
              ([hour, status]: any) => (
                <div
                  key={hour}
                  className={`p-2 text-center border rounded-lg ${
                    status === "libre" ? "bg-white-300" : "bg-red-300"
                  }`}
                >
                  {hour}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
