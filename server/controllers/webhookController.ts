import type { Request, Response } from "express";
import { fetchPayment, isPaymentApproved } from "../services/paymentService";
import { registerApprovedAppointment } from "../services/appointmentStore";

/**
 * Recibe las notificaciones asincrónicas de Mercado Pago.
 * Siempre responde 200 a MP para confirmar la recepción y evitar reintentos
 * innecesarios. Si el pago está aprobado, registra el turno (idempotente).
 */
export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body || {};
    const type = body.type || body.topic;
    const dataId = body.data?.id;

    if (type === "payment" && dataId) {
      const payment = await fetchPayment(String(dataId));
      if (isPaymentApproved(payment)) {
        await registerApprovedAppointment(
          String(payment.id),
          payment.external_reference,
          payment
        );
        console.log(`[webhook] Pago ${payment.id} aprobado → turno registrado.`);
      } else {
        console.log(`[webhook] Pago ${dataId} con estado: ${payment?.status ?? "desconocido"}.`);
      }
    } else {
      console.log(`[webhook] Notificación recibida (type=${type || "desconocido"}).`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("[webhook] Error procesando la notificación:", error);
    res.status(200).json({ received: true });
  }
}
