"use client";

import { useState, useRef, useEffect } from "react";
import { UserIcon, Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/solid";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useUsers } from "../hooks/useUsers";
import fileToBase64 from "@/actions/convert-file-to-base64";
import { signOutAccount, updateDocument, uploadBase64 } from "@/lib/firebase";
import toast from "react-hot-toast";
import Image from "next/image";
import { setInLocalStorage } from "@/actions/set-in-localstorage";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let user = useUsers();
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chooseImage = async (event: any) => {
    const file = event.target.files[0];
    console.log(file);
    try {
      setIsLoading(true);
      const base64 = await fileToBase64(file);
      console.log(base64);
      const imagePath = `${user?.uid}/profile`;

      const imageUrl = await uploadBase64(imagePath, base64);
      console.log(imageUrl);
      await updateDocument(`users/${user?.uid}`, { image: imageUrl });

      setImage(imageUrl);

      if(user){
        user.image = imageUrl;
        setInLocalStorage('user', user)
      }

      toast.success("Subido Correctamente");
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if(user?.image){
      setImage(user.image)
    }
  }, [user])
  

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center"
      >
        <span className="mr-2">Cuenta</span>
        {image ? 
                <Image className="object-cover w-6 h-6 rounded-full m-auto" src={image} width={1000} height={1000} alt="user-img"></Image>
                : (<UserCircleIcon className="m-auto w-6 h-6" />)
                }
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden px-2">
          <div className="px-4 py-2 font-semibold text-gray-700 border-b border-gray-300 text-center h-[150px]">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-[20px] h-[20px] border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {image ? 
                <Image className="object-cover w-20 h-20 rounded-full m-auto" src={image} width={1000} height={1000} alt="user-img"></Image>
                : (<UserCircleIcon className="m-auto w-20 h-20" />)
                }
                <input
                  id="files"
                  type="file"
                  accept="image/png, image/webp, image/jpeg"
                  className="hidden"
                  onChange={(event) => chooseImage(event)}
                />
                <div className="flex justify-center relative bottom-2">
                  <label htmlFor="files">
                    <div className="w-[40px] h-[28px] bg-slate-950 rounded-lg hover:bg-slate-700 cursor-pointer flex justify-center items-center">
                      <PhotoIcon className="w-[18px] h-[18px] text-white"></PhotoIcon>
                    </div>
                  </label>
                </div>
                {user?.name}
              </>
            )}
          </div>
          <ul className="p-2">
            <li className="text-gray-500 text-xs uppercase px-2 py-1">
              Cuenta
            </li>
            <li className="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" /> Perfil
            </li>
            <li className="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" /> Configuración
            </li>
            <li className="text-gray-500 text-xs uppercase px-2 py-1 mt-2">
              Sesión
            </li>
            <li
              className="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={signOutAccount}
            >
              <PowerIcon className="h-6 w-6 text-red-500" /> Cerrar Sesión
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
