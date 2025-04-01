import Navbar from '@/components/navbar';
import React from 'react'

export default function Home() {
  return (
    <>
    <Navbar/>
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl text-center">
        {/* Título Principal */}
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Recibe una visita donde y cuando la necesites
        </h1>

        {/* Descripción */}
        <p className="text-lg text-gray-700 mb-6">
          Ofrecemos visitas presenciales en casa o iglesia, así como reuniones online o llamadas para brindarte apoyo espiritual y orientación.
        </p>

        {/* Tipos de visitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-500">🏠 En Casa</h3>
            <p className="text-gray-600">Recibe una visita en la comodidad de tu hogar.</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-500">⛪ En Iglesia</h3>
            <p className="text-gray-600">Agenda una reunión en tu iglesia.</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-500">💻 Online</h3>
            <p className="text-gray-600">Conéctate con nosotros por videollamada.</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-500">📞 Llamada</h3>
            <p className="text-gray-600">Recibe apoyo y consejería por teléfono.</p>
          </div>
        </div>

        {/* Botón para agendar cita */}
        <a
          href="/ver-horas"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Agendar una cita
        </a>
      </div>
    </main>
    </>
  );
}
