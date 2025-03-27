import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Firestore instance
import { collection, getDocs, Timestamp } from "firebase/firestore";

// Define la estructura de los datos para la semana disponible
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

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "reservas-activas"));
    const visits: Visitation[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Visitation[];
    return NextResponse.json({ success: true, visits });
  } catch (error) {
    console.error("Error obteniendo visitas:", error);
    return NextResponse.json({ success: false, message: "Error obteniendo visitas" }, { status: 500 });
  }
}