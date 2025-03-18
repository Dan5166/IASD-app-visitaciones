"use client";

import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, setDocument, updateUser } from "@/lib/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.iterface";

export default function Register() {
  const [isLoading, setisLoading] = useState<boolean>(false);

  const formSchema = z.object({
    uid: z.string(),
    name: z.string().min(1, { message: "El nombre es requerido" }),
    email: z
      .string()
      .email("El formato del email no es valido. Ejemplo: user@email.com")
      .min(1, { message: "El email es requerido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  // Create User
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setisLoading(true);
    try {
      let res = await createUser(user);
      await updateUser({ displayName: user.name });

      user.uid = res.user.uid;
      await createUserInDB(user as User);

    } catch (error: any) {
      toast.error(error.message, {
        duration: 2500,
      });
    } finally {
      setisLoading(false);
    }
  };

  const createUserInDB = async (user: User) => {
    // Create User
    const path = `users/${user.uid}`;
    setisLoading(true);
    try {
      delete user.password;
      await setDocument(path, user);
      // toast with literal string
        toast(`Bienvenido, ${user.name}`, {
            duration: 2500,
            icon: '👋'
        });
    } catch (error: any) {
        toast.error(error.message, {
            duration: 2500,
        });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-auth">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Registrarse
        </h2>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              {...register("name")}
              type="text"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Correo Electrónico</label>
            <input
              {...register("email")}
              type="email"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@correo.com"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4a4 4 0 00-4-4H4z"
                ></path>
              </svg>
            )}
            Iniciar Sesión
          </button>
        </form>
        {/* poner el texto de forgot password al medio*/}
        <Link
          href="/forgot-password"
          className="mt-4 text-blue-600 block text-center"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="mt-6 text-center">
          Ya tienes una cuenta{" "}
          <Link href="/" className="text-blue-600">
            Ingresa
          </Link>
        </p>
      </div>
    </div>
  );
}
