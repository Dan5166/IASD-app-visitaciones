"use client"

import React from "react";
import TabsTrigger from "./tabsTrigger";
import { useDateStore } from "@/store/useDateStore";

export default function TabsComponent() {
  const {activeTab} = useDateStore();

  return (
    <div className="grid w-full grid-cols-4 bg-[#27272a] p-1 rounded-md text-center shadow-lg">
      <TabsTrigger text="Fecha" link="fecha" activeTab={activeTab} />
      <TabsTrigger text="Hora" link="hora" activeTab={activeTab} />
      <TabsTrigger text="Información" link="informacion" activeTab={activeTab} />
      <TabsTrigger text="Confirmación" link="confirmacion" activeTab={activeTab} />
    </div>
  );
}
