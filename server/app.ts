import express, { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { config } from "./config";
import appointmentsRouter from "./routes/appointments";
import paymentsRouter from "./routes/payments";
import webhookRouter from "./routes/webhook";
import bossRouter from "./routes/boss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp(): Promise<Express> {
  const app = express();
  app.use(express.json());

  app.use("/api/appointments", appointmentsRouter);
  app.use("/api", paymentsRouter);
  app.use("/webhook", webhookRouter);
  app.use("/api", bossRouter);

  // Integración de Vite: en producción sirve el build estático, en desarrollo
  // corre Vite en modo middleware con HMR.
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  return app;
}
