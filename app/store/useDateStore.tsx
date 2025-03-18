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
    reason: string;
  };
  setSelectedDate: (date: Dayjs | null) => void;
  setSelectedTime: ( time: string | null) => void;
  setActiveTab: (tab: "fecha" | "hora" | "informacion" | "confirmacion") => void;
  setPatientInfo: (info: { fullName: string; email: string; phone: string; reason: string }) => void;
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
    phone: '',
    reason: ''
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date, activeTab: "hora" });
  },  // Cambiar a tab de hora
  setSelectedTime: (time) => set({ selectedTime: time, activeTab: "informacion" }),  // Guardar hora y minuto
  setActiveTab: (tab) => set({ activeTab: tab }),  // Cambiar el tab activo
  setPatientInfo: (info) => set({ patientInfo: info, activeTab: "confirmacion" }), // Guardar la info del paciente

  // Función para resetear todos los datos y poner el tab en "fecha"
  resetForm: () => set({
    selectedDate: null,
    selectedTime: null,
    activeTab: "fecha", // Volver al tab de fecha
    patientInfo: {
      fullName: '',
      email: '',
      phone: '',
      reason: ''
    }
  }),
  // Funcion para resetear la hora y poner el tab en hora
  resetHour: () => set({
    selectedTime: null,
    activeTab: "hora", // Volver al tab de hora
  })

}));
