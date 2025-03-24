import NavbarVerHoras from "@/components/navbar_ver_horas";
import React from "react";
import Navbar from "@/components/navbar";

export default function SolicitarHoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-[#0f0f10] w-screen h-screen flex flex-col gap-10">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-10 text-center text-white">
          Agenda tu Visita
        </h1>
        <div className="max-w-3xl w-full text-white">
          <NavbarVerHoras />
          {children}
        </div>
      </div>
    </main>
  );
}
