import type { Request, Response } from "express";
import * as store from "../services/appointmentStore";

export async function listAppointments(_req: Request, res: Response): Promise<void> {
  try {
    const list = await store.listAppointments();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
}

export async function createAppointment(req: Request, res: Response): Promise<void> {
  try {
    const record = await store.createAppointment(req.body);
    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo guardar la reserva" });
  }
}

export async function deleteAppointment(req: Request, res: Response): Promise<void> {
  try {
    const removed = await store.deleteAppointment(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "No encontrado" });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar" });
  }
}

export async function updateAppointment(req: Request, res: Response): Promise<void> {
  try {
    const updated = await store.updateAppointment(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: "No encontrado" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar" });
  }
}
