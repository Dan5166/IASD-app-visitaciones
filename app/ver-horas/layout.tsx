import NavbarVerHoras from "@/components/navbar_ver_horas";
import React, { useEffect } from "react";
import { useDateStore } from "../store/useDateStore";

export default function SolicitarHoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-[#0f0f10] text-white w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Agenda tu Visita
      </h1>
      <div className="max-w-3xl w-full">
        <NavbarVerHoras />
        {children}
      </div>
    </main>
  );
}
