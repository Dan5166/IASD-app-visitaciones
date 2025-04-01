"use client";

import {
  Cog6ToothIcon,
  PowerIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Dropdown from "./dropdown";
import Logo from "./logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    label: "Perfil",
    icon: <UserIcon className="w-5 h-5 text-gray-600" />,
    onClick: () => console.log("Perfil"),
    category: "Cuenta",
  },
  {
    label: "Configuración",
    icon: <Cog6ToothIcon className="w-5 h-5 text-gray-600" />,
    onClick: () => console.log("Configuración"),
    category: "Cuenta",
  },
  {
    label: "Ver Visitadores",
    icon: <UserGroupIcon className="h-6 w-6 text-red-500" />,
    onClick: () => console.log("Cerrar Sesión"),
    category: "Visitadores",
  },
  {
    label: "Cerrar Sesión",
    icon: <PowerIcon className="h-6 w-6 text-red-500" />,
    onClick: () => console.log("Cerrar Sesión"),
    category: "Sesión",
  }
];

const Navbar = () => {
  const [user, setUser] = useState<any>();
  const router = useRouter(); // Hook para manejar la navegación

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between py-4 px-10 border-b border-solid border-gray-200 bg-white shadow-md z-50">
      <Logo />
      <div>
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
