import { create } from "zustand";
import { Timestamp } from "firebase/firestore";
import { useUserStore } from "./useUserStore";
import { getDocument } from "@/lib/firebase";

interface Visitation {
  id: string;
  requestedDate: Timestamp;
  createdAt: Timestamp;
  visitType: "En Domicilio" | "En Iglesia" | "Punto de encuentro" | "Online";
  visitatorId: string | null;
  visitatorName: string | null;
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface VisitationStore {
  visitations: Visitation[] | null;
  visitators: Record<string, string>; // Clave: ID del visitador, Valor: Nombre del visitador
  isLoadingVisitations: boolean;
  isLoadingVisitators: boolean;
  fetchVisitations: () => Promise<void>;
  claimVisit: (visitId: string, visitatorId: string) => Promise<void>;
  fetchVisitators: (visitations: Visitation[]) => Promise<void>;
}

export const useVisitationStore = create<VisitationStore>((set, get) => ({
  visitations: null,
  visitators: {},
  isLoadingVisitations: false,
  isLoadingVisitators: false,
  fetchVisitations: async () => {
    set({ isLoadingVisitations: true });
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

        // Llamamos a fetchVisitadores para obtener los nombres de los visitadores
        await get().fetchVisitators(data.visits);
      } else {
        console.error("Error al obtener visitaciones:", data);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      set({ isLoadingVisitations: false });
    }
  },

  fetchVisitators: async (visitations: Visitation[]) => {
    set({ isLoadingVisitators: true });

    try {
      const visitadoresData: Record<string, string> = {};

      for (const visita of visitations) {
        if (visita.visitatorId && !visitadoresData[visita.visitatorId]) {
          try {
            const userData = await getDocument(`users/${visita.visitatorId}`);
            visitadoresData[visita.visitatorId] =
              userData?.name || "Sin Nombre";
          } catch (error) {
            console.error(
              `Error obteniendo visitador ${visita.visitatorId}:`,
              error
            );
            visitadoresData[visita.visitatorId] = "No Identificado";
          } finally {
            console.log("################# visitadoresData:   ", visitadoresData);
          }
        }
      }

      set({ visitators: visitadoresData });
    } catch (error) {
      console.error("Error general en fetchVisitators:", error);
    } finally {
      set({ isLoadingVisitators: false });
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
