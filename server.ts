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

  // API Routes
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
        // Create directory if it doesn't exist
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
