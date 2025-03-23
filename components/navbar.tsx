import { Cog6ToothIcon, PowerIcon, UserIcon } from "@heroicons/react/24/outline";
import Dropdown from "./dropdown";
import Logo from "./logo";

const menuItems = [
    { label: "Perfil", icon: <UserIcon className="w-5 h-5 text-gray-600" />, onClick: () => console.log("Perfil"), category: "Cuenta" },
    { label: "Configuración", icon: <Cog6ToothIcon className="w-5 h-5 text-gray-600" />, onClick: () => console.log("Configuración"), category: "Cuenta" },
    { label: "Cerrar Sesión", icon: <PowerIcon className="h-6 w-6 text-red-500" />, onClick: () => console.log("Cerrar Sesión"), category: "Sesión" }
  ];

const Navbar = () => {
    return ( 
        <div className="flex justify-between py-6 px-10 border-b border-solid border-gray-200 w-full">
            <Logo/>
            <div>
                <Dropdown/>
            </div>
        </div>
     );
}

export default Navbar;