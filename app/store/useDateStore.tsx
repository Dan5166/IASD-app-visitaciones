import { create } from "zustand";
import { Dayjs } from "dayjs";

interface DateStore {
  selectedDate: Dayjs | null;
  selectedTime: string | null;
  activeTab: "fecha" | "hora" | "informacion" | "confirmacion"; // Para manejar los tabs
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  visitType: "En Domicilio" | "En Iglesia" | "Punto de encuentro" | "Online";
  setSelectedDate: (date: Dayjs | null) => void;
  setSelectedTime: (time: string | null) => void;
  setActiveTab: (tab: "fecha" | "hora" | "informacion" | "confirmacion") => void;
  setPatientInfo: (info: { fullName: string; email: string; phone: string; }) => void;
  setVisitType: (visitType: "En Domicilio" | "En Iglesia" | "Punto de encuentro" | "Online") => void;
  resetForm: () => void; // Función para resetear todos los datos;
  resetHour: () => void;
}

export const useDateStore = create<DateStore>((set) => ({
  selectedDate: null,
  selectedTime: null,
  activeTab: "fecha", // Tab predeterminado es "fecha",
  patientInfo: {
    fullName: '',
    email: '',
    phone: ''
  },
  visitType: "En Domicilio", // Valor predeterminado agregado

  setSelectedDate: (date) => {
    set({ selectedDate: date, activeTab: "hora" });
  },  
  setSelectedTime: (time) => set({ selectedTime: time, activeTab: "informacion" }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPatientInfo: (info) => set({ patientInfo: info, activeTab: "confirmacion" }),
  
  resetForm: () => set({
    selectedDate: null,
    selectedTime: null,
    activeTab: "fecha",
    patientInfo: {
      fullName: '',
      email: '',
      phone: ''
    },
    visitType: "En Domicilio", // También restablecer el visitType
  }),
  
  resetHour: () => set({
    selectedTime: null,
    activeTab: "hora",
  }),
  
  setVisitType: (visitType) => set({ visitType })
}));
