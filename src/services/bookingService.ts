import { BookingData } from "../App";

export const fetchAppointments = async () => {
  const response = await fetch("/api/appointments");
  if (!response.ok) throw new Error("Error fetching appointments");
  return response.json();
};

export const saveAppointment = async (appointment: BookingData) => {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...appointment,
      date: `${appointment.day} ${appointment.month.substring(0, 3)}`
    }),
  });
  if (!response.ok) throw new Error("Error saving appointment");
  return response.json();
};

export const deleteAppointment = async (id: string) => {
  const response = await fetch(`/api/appointments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error deleting appointment");
  return response.json();
};

export const updateAppointment = async (id: string, updates: any) => {
  const response = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Error updating appointment");
  return response.json();
};
