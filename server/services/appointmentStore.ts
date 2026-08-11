import { readFile, writeFile } from "fs/promises";
import path from "path";

export const APPOINTMENTS_FILE = path.join(process.cwd(), "data", "appointments.json");

// Turnos de ejemplo para que el dashboard del jefe y la agenda muestren datos
// cuando la base (appointments.json) esté vacía o no esté disponible.
const DEMO_APPOINTMENTS = [
  {
    id: "demo-1",
    name: "Carlos Gómez",
    email: "carlos.gomez@example.com",
    phone: "54 351 555-0100",
    plate: "AB 123 CD",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 3,
    month: "Agosto",
    time: "09:00 AM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "3 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
  {
    id: "demo-2",
    name: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    phone: "54 351 555-0101",
    plate: "BC 456 EF",
    oilType: "Semi-sintético (10W-40)",
    service: "Semi-sintético (10W-40)",
    day: 6,
    month: "Agosto",
    time: "10:30 AM",
    totalPrice: 37500,
    depositPrice: 18750,
    date: "6 Ago",
    status: "Confirmado",
    color: "amber-400",
  },
  {
    id: "demo-3",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "54 351 555-0102",
    plate: "CD 789 GH",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 10,
    month: "Agosto",
    time: "11:00 AM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "10 Ago",
    status: "Pendiente",
    color: "amber-400",
  },
  {
    id: "demo-4",
    name: "Marta Rodríguez",
    email: "marta.rodriguez@example.com",
    phone: "54 351 555-0103",
    plate: "DE 012 IJ",
    oilType: "Mineral de Alto Rendimiento (15W-40)",
    service: "Mineral de Alto Rendimiento (15W-40)",
    day: 12,
    month: "Agosto",
    time: "02:30 PM",
    totalPrice: 31500,
    depositPrice: 15750,
    date: "12 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
  {
    id: "demo-5",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@example.com",
    phone: "54 351 555-0104",
    plate: "EF 345 KL",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 15,
    month: "Agosto",
    time: "04:00 PM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "15 Ago",
    status: "Pendiente",
    color: "amber-400",
  },
  {
    id: "demo-6",
    name: "Ana López",
    email: "ana.lopez@example.com",
    phone: "54 351 555-0105",
    plate: "FG 678 MN",
    oilType: "Semi-sintético (10W-40)",
    service: "Semi-sintético (10W-40)",
    day: 18,
    month: "Agosto",
    time: "05:30 PM",
    totalPrice: 37500,
    depositPrice: 18750,
    date: "18 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
];

export async function readAppointments(): Promise<any[]> {
  try {
    const raw = await readFile(APPOINTMENTS_FILE, "utf-8");
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map((a: any) => ({
      ...a,
      id: a.id ?? a.id_reserva,
      service: a.service ?? a.oilType ?? a.servicio,
      status: a.status ?? a.estado ?? "Pendiente",
      color: a.color ?? "rose-900",
    }));
  } catch {
    return [];
  }
}

export async function writeAppointments(list: any[]): Promise<void> {
  await writeFile(APPOINTMENTS_FILE, JSON.stringify(list, null, 2), "utf-8");
}

export const appointmentPayload = (appointment: any) => ({
  ...appointment,
  status: appointment.status ?? appointment.estado ?? "Pendiente",
  service: appointment.service ?? appointment.oilType,
});

export async function listAppointments(): Promise<any[]> {
  const list = await readAppointments();
  return list.length > 0 ? list : DEMO_APPOINTMENTS;
}

export async function createAppointment(payload: any): Promise<any> {
  const list = await readAppointments();
  const record = {
    ...appointmentPayload(payload),
    id: String(Date.now()),
    date: payload.date || `${payload.day} ${String(payload.month || "").substring(0, 3)}`,
    service: payload.service ?? payload.oilType,
    status: payload.status ?? payload.estado ?? "Pendiente",
    color: "rose-900",
    createdAt: new Date().toISOString(),
  };
  list.push(record);
  await writeAppointments(list);
  return record;
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const list = await readAppointments();
  const filtered = list.filter(
    (a: any) => String(a.id) !== id && String(a.id_reserva) !== id
  );
  await writeAppointments(filtered);
  return filtered.length !== list.length;
}

export async function updateAppointment(id: string, updates: any): Promise<any | null> {
  const list = await readAppointments();
  const index = list.findIndex(
    (a: any) => String(a.id) === id || String(a.id_reserva) === id
  );
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  await writeAppointments(list);
  return list[index];
}

function parseExternalReference(reference: string | undefined): any {
  if (!reference) return null;
  try {
    const parsed = JSON.parse(reference);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Registra (o actualiza) el turno correspondiente a un pago aprobado.
 * Es idempotente: si ya existe un turno con ese paymentId no lo duplica.
 * Devuelve el turno asociado.
 */
export async function registerApprovedAppointment(
  paymentId: string,
  externalReference: string | undefined,
  payment: any
): Promise<any | null> {
  const reference = parseExternalReference(externalReference);
  const booking = reference?.booking || reference;
  if (!booking || typeof booking !== "object") {
    console.warn(`[webhook] Pago ${paymentId} aprobado sin external_reference válida; no se registra turno.`);
    return null;
  }

  const list = await readAppointments();
  const existingIndex = list.findIndex((a: any) => a.paymentId === String(paymentId));

  if (existingIndex !== -1) {
    if (list[existingIndex].status !== "Confirmado") {
      list[existingIndex].status = "Confirmado";
      list[existingIndex].paymentStatus = payment.status ?? "approved";
      await writeAppointments(list);
    }
    return list[existingIndex];
  }

  const record = {
    ...appointmentPayload(booking),
    id: String(Date.now()),
    name: booking.name || "Cliente",
    email: reference?.email || booking.email || "",
    phone: booking.phone || "",
    plate: booking.plate || "",
    oilType: booking.oilType || "",
    service: booking.service ?? booking.oilType ?? "Servicio",
    day: booking.day,
    month: booking.month,
    time: booking.time || "",
    date: booking.date || `${booking.day} ${String(booking.month || "").substring(0, 3)}`,
    totalPrice: Number(booking.totalPrice || 0),
    depositPrice: Number(booking.depositPrice || 0),
    status: "Confirmado",
    color: "emerald-500",
    paymentId: String(paymentId),
    paymentStatus: payment.status ?? "approved",
    paymentMethod: payment.payment_method_id,
    approvedAt: payment.date_approved || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  list.push(record);
  await writeAppointments(list);
  return record;
}
