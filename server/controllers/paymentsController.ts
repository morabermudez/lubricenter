import type { Request, Response } from "express";
import { createPreference, fetchPayment, isPaymentApproved } from "../services/paymentService";
import { registerApprovedAppointment } from "../services/appointmentStore";

export async function createPreferenceHandler(req: Request, res: Response): Promise<void> {
  try {
    const result = await createPreference({
      title: req.body?.title,
      price: req.body?.price,
      email: req.body?.email,
      booking: req.body?.booking,
    });
    res.json(result);
  } catch (error) {
    console.error("Error al generar la preferencia en Mercado Pago:", error);
    res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
  }
}

/**
 * Verifica el estado de un pago (usado al volver de Mercado Pago) y, si fue
 * aprobado, se asegura de que el turno quede registrado aunque el webhook
 * todavía no haya llegado. Es idempotente vía paymentId.
 */
export async function verifyPaymentHandler(req: Request, res: Response): Promise<void> {
  const paymentId = req.query.payment_id || req.query.id;
  if (!paymentId) {
    res.status(400).json({ error: "payment_id es requerido" });
    return;
  }

  try {
    const payment = await fetchPayment(String(paymentId));
    if (!isPaymentApproved(payment)) {
      res.json({ status: payment?.status ?? "unknown", appointment: null });
      return;
    }

    const appointment = await registerApprovedAppointment(
      String(payment.id),
      payment.external_reference,
      payment
    );
    res.json({ status: payment.status, appointment });
  } catch (error) {
    console.error("Error al verificar el pago:", error);
    res.status(500).json({ error: "No se pudo verificar el pago" });
  }
}
