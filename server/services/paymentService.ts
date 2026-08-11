import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { config } from "../config";

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!config.mercadopagoAccessToken) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN no está configurado. Regenerá el token en el panel de Mercado Pago y cargalo en el archivo .env."
    );
  }
  return new MercadoPagoConfig({ accessToken: config.mercadopagoAccessToken });
}

export interface CreatePreferenceInput {
  title?: string;
  price?: string | number;
  email?: string;
  booking?: any;
}

export async function createPreference(input: CreatePreferenceInput) {
  const client = getMercadoPagoClient();
  const preference = new Preference(client);

  const rawPrice = input.price !== undefined && input.price !== null && input.price !== "" ? String(input.price) : "1500";
  const cleanPrice = rawPrice.replace(/\$/g, "").replace(/\./g, "").replace(/,/g, ".").trim();
  const parsedPrice = Math.round(Number(cleanPrice));

  const booking = input.booking || {};
  const externalReference = JSON.stringify({
    email: input.email || booking.email || "",
    booking,
  });

  const result = await preference.create({
    body: {
      items: [
        {
          id: "sena-lubricenter",
          title: input.title || "Seña de Servicio - Lubricenter",
          quantity: 1,
          unit_price: parsedPrice,
          currency_id: "ARS",
        },
      ],
      external_reference: externalReference,
      notification_url: `${config.appUrl}/webhook`,
      back_urls: {
        success: `${config.appUrl}/?payment=success`,
        failure: `${config.appUrl}/?payment=failure`,
        pending: `${config.appUrl}/?payment=pending`,
      },
      auto_return: "approved",
    },
  });

  return { id: result.id, init_point: result.init_point };
}

export async function fetchPayment(paymentId: string): Promise<any> {
  const client = getMercadoPagoClient();
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return result;
}

export function isPaymentApproved(payment: any): boolean {
  return Boolean(payment && payment.status === "approved");
}
