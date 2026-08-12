import { config } from "../config";

export interface ExpirationItem {
  key: string;
  label: string;
  description: string;
  expiresAt: string;
  daysLeft: number;
  expiring: boolean;
  url?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function computeItem(key: string, label: string, description: string, expiresAt: string, url?: string): ExpirationItem | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;

  const daysLeft = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  return {
    key,
    label,
    description,
    expiresAt: date.toISOString(),
    daysLeft,
    expiring: daysLeft <= 30,
    ...(url ? { url } : {}),
  };
}

export function getExpirations(): ExpirationItem[] {
  return [
    computeItem(
      "mercadopago",
      "Credenciales de Mercado Pago",
      "El access token usado para cobrar las señas vence pronto. Regeneralo en el panel de Mercado Pago y actualizá el .env.",
      config.mercadopagoTokenExpires
    ),
    computeItem(
      "deploy",
      "Despliegue / Hosting",
      "El plan o dominio del hosting vence pronto. Renová el deploy para no perder el servicio.",
      config.deployExpires,
      config.deployUrl || undefined
    ),
  ].filter(Boolean) as ExpirationItem[];
}
