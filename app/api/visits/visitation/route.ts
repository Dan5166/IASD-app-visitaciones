import { NextResponse } from "next/server";
import { db, updateDocument } from "@/lib/firebase"; // Firestore instance
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

export async function POST(req: Request) {
  const { visitId, visitatorId } = await req.json();
  try {
    await updateDocument(`reservas-activas/${visitId}`, {
      visitatorId: visitatorId,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al reclamar la visita:", error);
    return NextResponse.json(
      { success: false, message: "Error actualizando toma de visita" },
      { status: 500 }
    );
  }
}
