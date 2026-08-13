import { createApp } from "./server/app";
import { config } from "./server/config";

async function startServer() {
  const app = await createApp();

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${config.port}\n`);
  });
}

startServer().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
});
