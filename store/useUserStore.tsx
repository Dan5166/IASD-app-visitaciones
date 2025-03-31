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
  searchedUser: User | null;
  fetchUser: () => Promise<void>;
  fetchSearchedUser: (uid: string) => Promise<void>;
  isLoadingUser: boolean;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoadingUser: false,
  searchedUser: null,
  fetchUser: async () => {
    set({isLoadingUser: true});
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
      set({ user: null });
    } finally {
      set({ isLoadingUser: false });
    }
  },
  fetchSearchedUser: async (uid: string) => {
    set({ isLoadingUser: true });
    try {
      const res = await fetch(`/api/visits/visitator?uid=${uid}`, { // Como es GET, lo mejor es pasar los parametros en la URL
        method: "GET",
        credentials: "include",
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("------------- ZUSTAND ENVIA EL USUARIO:   ", data.user);
        set({ searchedUser: data.user });
      } else {
        console.error("Error al obtener usuario:", data.message);
      }
    } catch (error) {
      console.error("Error de red:", error);
      set({ searchedUser: null });
    } finally {
      set({ isLoadingUser: false });
    }
  },
}));
