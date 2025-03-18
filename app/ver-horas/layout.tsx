import NavbarVerHoras from '@/components/navbar_ver_horas';
import React from 'react'

export default function SolicitarHoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='container mx-auto py-10 px-4 bg-[#0f0f10] text-white'>
        <h1 className="text-3xl font-bold text-center mb-8">Sistema de Reserva de Citas Médicas</h1>
        <div className="max-w-3xl mx-auto">
          <div className='p-6 w-full'>
            <NavbarVerHoras/>
            {children}
          </div>
        </div>
    </main>
  )
}
