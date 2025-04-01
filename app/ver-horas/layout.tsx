import Breadcrumbs from "@/components/breadCrumbs";
import Navbar from "@/components/navbar";
import TabsComponent from "@/components/tabsComponent";
import React from "react";

export default function SolicitarHoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const breadcrumbPath = [
      { label: "Inicio", href: "/" },
      { label: "Ver Horas Disponibles" },
    ];
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Navbar />
      <Breadcrumbs path={breadcrumbPath}/>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-10 text-center text-black">
          Agenda tu Visita
        </h1>
        <div className="w-full text-black bg-[#eef1f7] rounded-md">
          <TabsComponent />
          {children}
        </div>
      </div>
    </main>
  );
}
