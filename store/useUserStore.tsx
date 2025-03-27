import { Timestamp } from "firebase/firestore";
import { create } from "zustand";

interface User {
  createdAt: Timestamp | null;
  email: string;
  image: string;
  name: string;
  uid: string;
}

interface UserStore {
  user: User | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        console.log("------------- ZUSTAND ENVIA EL USUARIO:   ", data.user);
        set({ user: data.user });
      } else {
        console.error("Error al obtener usuario:", data.message);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  },
}));
