import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import { useUserStore } from "./useUserStore";

interface Visitation {
  id: string;
  requestedDate: Timestamp;
  createdAt: Timestamp;
  visitType: "En Domicilio" | "En Iglesia" | "Punto de encuentro" | "Online";
  visitatorId: string | null;
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface VisitationStore {
  visitations: Visitation[] | null;
  fetchVisitations: () => Promise<void>;
  claimVisit: (visitId: string, visitatorId: string) => Promise<void>;
}

export const useVisitationStore = create<VisitationStore>((set) => ({
  // Store en la APP para revisar desde cualquier lado esta constante
  visitations: null,
  fetchVisitations: async () => {
    try {
      const res = await fetch("/api/visits", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(
          "------------- ZUSTAND ENVIA LAS VISITACIONES:   ",
          data.visits
        );
        set({ visitations: data.visits });
      } else {
        console.error("Error al obtener visitaciones:", data);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  },
  claimVisit: async (visitId: string, visitatorId: string) => {
    console.log(`SE RECLAMO LA VISITA: ${visitId} POR: ${visitatorId}`);

    try {
      const res = await fetch("/api/visits/visitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, visitatorId }),
      });

      if (res.ok) {
        console.log("------------- ACTUALIZADO EL VISITADOR:   ");
      } else {
        console.error("Error al actualizar el visitador");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  },
}));
