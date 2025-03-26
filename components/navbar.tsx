"use client"

import { Cog6ToothIcon, PowerIcon, UserIcon } from "@heroicons/react/24/outline";
import Dropdown from "./dropdown";
import Logo from "./logo";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@/actions/get-from-localstorage";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menuItems = [
  { label: "Perfil", icon: <UserIcon className="w-5 h-5 text-gray-600" />, onClick: () => console.log("Perfil"), category: "Cuenta" },
  { label: "Configuración", icon: <Cog6ToothIcon className="w-5 h-5 text-gray-600" />, onClick: () => console.log("Configuración"), category: "Cuenta" },
  { label: "Cerrar Sesión", icon: <PowerIcon className="h-6 w-6 text-red-500" />, onClick: () => console.log("Cerrar Sesión"), category: "Sesión" }
];

const Navbar = () => {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    // Este efecto se ejecuta solo una vez al montar el componente
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userInLocal = getFromLocalStorage('user');
        if (userInLocal) {
          setUser(true);
        } else {
          setUser(false);
        }
      } else {
        setUser(false);
      }
    });

    // Cleanup del efecto
    return () => unsubscribe();
  }, []); // Pasamos un arreglo vacío para que solo se ejecute al montar el componente

  return ( 
    <div className="flex justify-between py-6 px-10 border-b border-solid border-gray-200 w-full">
      <Logo />
      <div>
        {user && (
          <Dropdown />
        )}
        {!user && (
          <Link href="/login" className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
