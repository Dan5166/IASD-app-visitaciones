import React from "react";

interface TabsTriggerProps {
  text: string;
  link: string;
  activeTab: string; // Recibe el tab activo desde el navbar
}

export default function TabsTrigger({ text, link, activeTab }: TabsTriggerProps) {
  const isActive = activeTab === link;

  return (
    <div
      className={`cursor-default p-2 rounded-lg ${
        isActive ? "text-white font-bold" : "text-gray-500"
      }`}
    >
      {text}
    </div>
  );
}
