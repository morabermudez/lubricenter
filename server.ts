import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Faltan las variables SUPABASE_URL/SUPABASE_KEY en el archivo .env");
}

const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
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

// Turnos de ejemplo para que el dashboard del jefe y la agenda muestren datos
// cuando la base (Supabase) esté vacía o no esté disponible.
const DEMO_APPOINTMENTS = [
  {
    id: "demo-1",
    name: "Carlos Gómez",
    email: "carlos.gomez@example.com",
    phone: "54 351 555-0100",
    plate: "AB 123 CD",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 3,
    month: "Agosto",
    time: "09:00 AM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "3 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
  {
    id: "demo-2",
    name: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    phone: "54 351 555-0101",
    plate: "BC 456 EF",
    oilType: "Semi-sintético (10W-40)",
    service: "Semi-sintético (10W-40)",
    day: 6,
    month: "Agosto",
    time: "10:30 AM",
    totalPrice: 37500,
    depositPrice: 18750,
    date: "6 Ago",
    status: "Confirmado",
    color: "amber-400",
  },
  {
    id: "demo-3",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "54 351 555-0102",
    plate: "CD 789 GH",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 10,
    month: "Agosto",
    time: "11:00 AM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "10 Ago",
    status: "Pendiente",
    color: "amber-400",
  },
  {
    id: "demo-4",
    name: "Marta Rodríguez",
    email: "marta.rodriguez@example.com",
    phone: "54 351 555-0103",
    plate: "DE 012 IJ",
    oilType: "Mineral de Alto Rendimiento (15W-40)",
    service: "Mineral de Alto Rendimiento (15W-40)",
    day: 12,
    month: "Agosto",
    time: "02:30 PM",
    totalPrice: 31500,
    depositPrice: 15750,
    date: "12 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
  {
    id: "demo-5",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@example.com",
    phone: "54 351 555-0104",
    plate: "EF 345 KL",
    oilType: "Sintético Premium (5W-30 / 5W-40)",
    service: "Sintético Premium (5W-30 / 5W-40)",
    day: 15,
    month: "Agosto",
    time: "04:00 PM",
    totalPrice: 45500,
    depositPrice: 22750,
    date: "15 Ago",
    status: "Pendiente",
    color: "amber-400",
  },
  {
    id: "demo-6",
    name: "Ana López",
    email: "ana.lopez@example.com",
    phone: "54 351 555-0105",
    plate: "FG 678 MN",
    oilType: "Semi-sintético (10W-40)",
    service: "Semi-sintético (10W-40)",
    day: 18,
    month: "Agosto",
    time: "05:30 PM",
    totalPrice: 37500,
    depositPrice: 18750,
    date: "18 Ago",
    status: "Confirmado",
    color: "emerald-500",
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const client = new MercadoPagoConfig({
    accessToken: "TEST-748337118059184-061714-78012f824f2e29f7927fc9dee43c626e-2520047460",
  });

  app.post("/api/create_preference", async (req, res) => {
    try {
      const preference = new Preference(client);
      let rawPrice = req.body.price ? String(req.body.price) : "1500";
      let cleanPrice = rawPrice.replace(/\$/g, "").replace(/\./g, "").replace(/,/g, ".").trim();
      const parsedPrice = Math.round(Number(cleanPrice));

      const result = await preference.create({
        body: {
          items: [
            {
              id: "sena-lubricenter",
              title: req.body.title || "Sena de Servicio - Lubricenter",
              quantity: 1,
              unit_price: parsedPrice,
              currency_id: "ARS",
            },
          ],
          back_urls: {
            success: `http://localhost:${PORT}/`,
            failure: `http://localhost:${PORT}/`,
            pending: `http://localhost:${PORT}/`,
          },
          auto_return: "approved",
        },
      });

      res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } catch (error) {
      console.error("Error al generar la preferencia en Mercado Pago:", error);
      res.status(500).json({ error: "No se pudo crear la preferencia de pago" });
    }
  });

  app.get("/api/appointments", async (_req, res) => {
    try {
      const { data, error } = await supabase.from("reservas").select("*");
      if (error) throw error;
      const normalized = (data ?? []).map(normalizeAppointment);
      res.json(normalized.length > 0 ? normalized : DEMO_APPOINTMENTS);
    } catch (error) {
      console.error(error);
      res.json(DEMO_APPOINTMENTS);
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
      res.status(500).json({ error: "No se pudo guardar la reserva" });
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
      console.error(error);
      res.status(500).json({ error: "No se pudo eliminar" });
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
      console.error(error);
      res.status(500).json({ error: "No se pudo actualizar" });
    }
  });

  app.get("/api/inventory", async (_req, res) => {
    try {
      const { data, error } = await supabase.from("aceites").select("*");
      if (error) throw error;
      res.json((data ?? []).map(normalizeProduct));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo cargar el inventario" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("aceites")
        .update(req.body)
        .or(`id.eq.${req.params.id},id_stock.eq.${req.params.id},id_producto.eq.${req.params.id}`)
        .select();
      if (error) throw error;
      res.json(normalizeProduct(data?.[0] ?? { ...req.body, id: req.params.id }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo actualizar el producto" });
    }
  });

  // Integración de Vite para desarrollo
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}\n`);
  });
}

startServer().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
});