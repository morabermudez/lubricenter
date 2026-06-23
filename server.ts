import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DATA_PATH = path.join(__dirname, "data", "appointments.json");

  app.use(express.json());

  // =========================================================================
  // 1. CONFIGURACIÓN DE MERCADO PAGO (CON TU TOKEN COMPLETO DE PRUEBA)
  // =========================================================================
  const MERCADO_PAGO_ACCESS_TOKEN = "TEST-748337118059184-061714-78012f824f2e29f7927fc9dee43c626e-2520047460";

  // =========================================================================
  // 2. RUTA PARA RECIBIR LA SOLICITUD DEL FRONTEND (MODIFICADA CON INIT_POINT)
  // =========================================================================
  app.post("/api/create_preference", async (req, res) => {
    try {
      // Limpiamos el precio: quitamos "$", espacios y puntos de miles para evitar romper la API
      let rawPrice = req.body.price ? String(req.body.price) : "1500";
      let cleanPrice = rawPrice.replace(/\$/g, "").replace(/\./g, "").replace(/,/g, ".").trim();
      
      const parsedPrice = Math.round(Number(cleanPrice)); // Lo redondeamos a entero por seguridad

      console.log("-> Procesando preferencia para Mercado Pago:", {
        title: req.body.title || "Seña de Servicio",
        unit_price: parsedPrice
      });

      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: "sena-lubricenter",
              title: req.body.title || "Sena de Servicio - Lubricenter", 
              quantity: 1,
              unit_price: parsedPrice, // Pasamos el número 100% limpio
              currency_id: "ARS" 
            }
          ],
          backUrls: {
            success: "http://localhost:3000/",
            failure: "http://localhost:3000/",
            pending: "http://localhost:3000/"
          },
          autoReturn: "approved",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Mercado Pago respondió ${response.status}: ${errorBody}`);
      }

      const result = await response.json();

      console.log("-> Preferencia creada con ID exitoso:", result.id);
      
      // DEVOLVEMOS EL ID Y EL LINK DIRECTO DE PAGO
      res.json({ 
        id: result.id,
        init_point: result.init_point 
      });
    } catch (error) {
      console.error("Error crítico al generar la preferencia en Mercado Pago:", error);
      res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
    }
  });

  // =========================================================================
  // 3. RUTAS DE LAS CITAS (Tu lógica original de appointments)
  // =========================================================================
  app.get("/api/appointments", (req, res) => {
    try {
      if (!fs.existsSync(DATA_PATH)) {
        return res.json([]);
      }
      const data = fs.readFileSync(DATA_PATH, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "No se pudieron cargar las citas" });
    }
  });

  app.post("/api/appointments", (req, res) => {
    try {
      const newAppointment = req.body;
      let appointments = [];
      
      if (fs.existsSync(DATA_PATH)) {
        const data = fs.readFileSync(DATA_PATH, "utf-8");
        appointments = JSON.parse(data);
      } else {
        const dir = path.dirname(DATA_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }

      appointments.push({
        id: Date.now().toString(),
        ...newAppointment,
        status: newAppointment.status || "Pendiente",
        color: newAppointment.color || "amber-400"
      });

      fs.writeFileSync(DATA_PATH, JSON.stringify(appointments, null, 2));
      res.status(201).json(appointments[appointments.length - 1]);
    } catch (error) {
      res.status(500).json({ error: "No se pudo guardar la cita" });
    }
  });

  app.delete("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      if (!fs.existsSync(DATA_PATH)) {
        return res.status(404).json({ error: "No hay citas registradas" });
      }

      const data = fs.readFileSync(DATA_PATH, "utf-8");
      let appointments = JSON.parse(data);
      
      const initialLength = appointments.length;
      appointments = appointments.filter((apt: any) => apt.id !== id);

      if (appointments.length === initialLength) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }

      fs.writeFileSync(DATA_PATH, JSON.stringify(appointments, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "No se pudo eliminar la cita" });
    }
  });

  app.patch("/api/appointments/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      if (!fs.existsSync(DATA_PATH)) {
        return res.status(404).json({ error: "No hay citas registradas" });
      }

      const data = fs.readFileSync(DATA_PATH, "utf-8");
      let appointments = JSON.parse(data);
      
      const index = appointments.findIndex((apt: any) => apt.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }

      appointments[index] = { ...appointments[index], ...updates };

      fs.writeFileSync(DATA_PATH, JSON.stringify(appointments, null, 2));
      res.json(appointments[index]);
    } catch (error) {
      res.status(500).json({ error: "No se pudo actualizar la cita" });
    }
  });

  // =========================================================================
  // 4. CONFIGURACIÓN DE VITE
  // =========================================================================
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
