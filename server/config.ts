import "dotenv/config";

const port = Number(process.env.PORT || 3000);

export const config = {
  port,
  appUrl: process.env.APP_URL || `http://localhost:${port}`,
  mercadopagoAccessToken: (process.env.MERCADOPAGO_ACCESS_TOKEN || "").trim(),
  mercadopagoPublicKey: (process.env.VITE_MERCADOPAGO_PUBLIC_KEY || "").trim(),
  mercadopagoTokenExpires: (process.env.MERCADOPAGO_TOKEN_EXPIRES || "").trim(),
  deployExpires: (process.env.DEPLOY_EXPIRES || "").trim(),
  deployUrl: (process.env.DEPLOY_URL || "").trim(),
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || "",
};
