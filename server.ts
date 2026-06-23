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

const normalizeClient = (client: any) => ({
  ...client,
  id: client.id_cliente,
  name: client.nombre_cliente,
  lastName: client.apellido_cliente,
  phone: client.telefono,
});

const normalizeVehicle = (vehicle: any) => ({
  ...vehicle,
  plate: vehicle.patente,
  clientId: vehicle.id_cli,
  brand: vehicle.marca,
  model: vehicle.modelo,
});

const normalizeAppointment = (appointment: any) => ({
  ...appointment,
  id: appointment.id_reserva,
  phone: appointment.telefono,
  oilType: appointment.tipo_aceite,
  date: appointment.fec_res,
  time: appointment.hora,
  clientId: appointment.id_cli,
  paymentId: appointment.id_pago,
  stockId: appointment.id_stock,
  status: "Pendiente",
  color: "rose-900",
});

const normalizePayment = (payment: any) => ({
  ...payment,
  id: payment.id_pago,
  method: payment.metodo_pago,
  total: payment.monto_total,
  reservationId: payment.id_reserva,
});

const normalizePaymentDetail = (detail: any) => ({
  ...detail,
  id: detail.id_detalle,
  paymentId: detail.id_pago,
  card: detail.tarjeta,
  holder: detail.titular,
});

const normalizeEmployee = (employee: any) => ({
  ...employee,
  id: employee.id_empleado,
  name: employee.nombre_empleado,
  lastName: employee.apellido_empleado,
  phone: employee.telefono,
});

const appointmentPayload = (appointment: any) => ({
  ...appointment,
  status: appointment.status ?? appointment.estado ?? "Pendiente",
  service: appointment.service ?? appointment.oilType,
});

const normalizeProduct = (product: any) => ({
  ...product,
  id: product.id_stock,
  name: product.tipo_aceite,
  sku: `ACE-${product.id_stock}`,
  category: "Aceites",
  stock: product.cant_stock,
  critical: product.cant_stock < 10,
  icon: "inventory_2",
  description: product.tipo_aceite,
  price: product.precio,
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
        .from("aceites")
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
        .from("aceites")
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
