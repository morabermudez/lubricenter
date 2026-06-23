import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las variables SUPABASE_URL/SUPABASE_KEY o VITE_SUPABASE_URL/VITE_SUPABASE_KEY");
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

const normalizeAppointment = (appointment: any) => ({
  ...appointment,
  id: appointment.id ?? appointment.id_reserva,
  name: appointment.name ?? appointment.nombre ?? "",
  email: appointment.email ?? appointment.correo ?? "",
  phone: appointment.phone ?? appointment.telefono ?? "",
  plate: appointment.plate ?? appointment.patente ?? "",
  service: appointment.service ?? appointment.oilType ?? appointment.oil_type ?? appointment.tipo_aceite ?? "",
  oilType: appointment.oilType ?? appointment.oil_type ?? appointment.tipo_aceite ?? appointment.service ?? "",
  date: appointment.date ?? appointment.fecha ?? "",
  time: appointment.time ?? appointment.hora ?? "",
  status: appointment.status ?? appointment.estado ?? "Pendiente",
  color: appointment.color ?? "rose-900",
});

const appointmentPayload = (appointment: any) => ({
  ...appointment,
  status: appointment.status ?? appointment.estado ?? "Pendiente",
  service: appointment.service ?? appointment.oilType,
});

const normalizeProduct = (product: any) => ({
  ...product,
  id: product.id ?? product.id_producto,
  name: product.name ?? product.nombre ?? "",
  sku: product.sku ?? product.codigo ?? "",
  category: product.category ?? product.categoria ?? "Todos",
  stock: product.stock ?? product.cantidad ?? 0,
  critical: product.critical ?? product.critico ?? (product.stock ?? product.cantidad ?? 0) < 10,
  icon: product.icon ?? product.icono ?? "inventory_2",
  description: product.description ?? product.descripcion ?? "",
  price: product.price ?? product.precio ?? 0,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/appointments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select("*");

    if (error) throw error;

    res.json((data ?? []).map(normalizeAppointment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudieron cargar las citas",
    });
  }
});

  app.post("/api/appointments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .insert([appointmentPayload(req.body)])
      .select();

    if (error) throw error;

    res.status(201).json(normalizeAppointment(data?.[0] ?? req.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo guardar la reserva"
    });
  }
});

  app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("reservas")
      .delete()
      .or(`id.eq.${req.params.id},id_reserva.eq.${req.params.id}`);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo eliminar"
    });
  }
});

  app.patch("/api/appointments/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .update(req.body)
      .or(`id.eq.${req.params.id},id_reserva.eq.${req.params.id}`)
      .select();

    if (error) throw error;

    res.json(normalizeAppointment(data?.[0] ?? { ...req.body, id: req.params.id }));
  } catch (error) {
    res.status(500).json({
      error: "No se pudo actualizar"
    });
  }
});

  app.get("/api/inventory", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("inventario")
        .select("*");

      if (error) throw error;

      res.json((data ?? []).map(normalizeProduct));
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "No se pudo cargar el inventario",
      });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("inventario")
        .update(req.body)
        .or(`id.eq.${req.params.id},id_producto.eq.${req.params.id}`)
        .select();

      if (error) throw error;

      res.json(normalizeProduct(data?.[0] ?? { ...req.body, id: req.params.id }));
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "No se pudo actualizar el producto",
      });
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
