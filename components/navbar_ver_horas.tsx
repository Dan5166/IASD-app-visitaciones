import React from "react";
import TabsTrigger from "./tabsTrigger";

export default function NavbarVerHoras() {
  const activeTab = "fecha"; // Aquí defines cuál tab está activo

  return (
    <div className="grid w-full grid-cols-4 bg-[#27272a] p-3 rounded-2xl text-center shadow-lg">
      <TabsTrigger text="Fecha" link="fecha" activeTab={activeTab} />
      <TabsTrigger text="Hora" link="hora" activeTab={activeTab} />
      <TabsTrigger text="Información" link="informacion" activeTab={activeTab} />
      <TabsTrigger text="Confirmación" link="confirmacion" activeTab={activeTab} />
    </div>
  );
}
