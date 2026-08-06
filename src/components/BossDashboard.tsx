import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchAppointments } from "../services/bookingService";

interface BossDashboardProps {
  onNavigate: (view: string) => void;
}

const inventoryProducts = [
  { id: 1, name: "Royal Purple High Mileage 5W-30", category: "Aceite de Motor", stock: 4, critical: true, price: 32000 },
  { id: 2, name: "Bosch Premium Oil Filter 3330", category: "Filtros", stock: 42, critical: false, price: 8500 },
  { id: 3, name: "Prestone All-Season Coolant", category: "Refrigerantes", stock: 18, critical: false, price: 12400 },
  { id: 4, name: "NGK Iridium Spark Plug Set", category: "Encendido", stock: 2, critical: true, price: 15600 },
];

export default function BossDashboard({ onNavigate }: BossDashboardProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"ventas" | "stock">("ventas");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalIncome = appointments.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  const totalDeposits = appointments.reduce((sum, a) => sum + (a.depositPrice || 0), 0);
  const pendingCount = appointments.filter(a => a.status === "Pendiente").length;
  const confirmedCount = appointments.filter(a => a.status === "Confirmado").length;
  const totalProducts = inventoryProducts.length;
  const criticalStock = inventoryProducts.filter(p => p.critical).length;
  const totalStockValue = inventoryProducts.reduce((sum, p) => sum + p.stock * p.price, 0);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("back")}
              className="p-1 hover:bg-stone-100 rounded-full"
            >
              <span className="material-symbols-outlined text-rose-900">arrow_back</span>
            </button>
            <h1 className="text-lg font-black text-rose-900 uppercase tracking-tighter">
              Lubricenter
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Panel del Jefe
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-900 text-white flex items-center justify-center font-bold text-xs shadow-lg">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-black tracking-tighter text-[#1a1c1c]">
            Dashboard Ejecutivo
          </h2>
          <p className="text-stone-500 text-sm font-medium mt-1">
            Estadísticas generales de ventas y stock
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSelectedTab("ventas")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedTab === "ventas"
                ? "bg-rose-900 text-white shadow-lg shadow-rose-900/20"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <span className="material-symbols-outlined text-base align-middle mr-1">trending_up</span>
            Ventas
          </button>
          <button
            onClick={() => setSelectedTab("stock")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedTab === "stock"
                ? "bg-rose-900 text-white shadow-lg shadow-rose-900/20"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            <span className="material-symbols-outlined text-base align-middle mr-1">inventory_2</span>
            Stock
          </button>
        </div>

        {selectedTab === "ventas" && (
          <motion.div
            key="ventas"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Ingresos Totales
                </span>
                <p className="text-3xl font-black text-[#1a1c1c] mt-2">
                  ${totalIncome.toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {appointments.length} turnos registrados
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Señas Cobradas
                </span>
                <p className="text-3xl font-black text-[#1a1c1c] mt-2">
                  ${totalDeposits.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Turnos Pendientes
                </span>
                <p className="text-3xl font-black text-amber-600 mt-2">
                  {pendingCount.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Turnos Confirmados
                </span>
                <p className="text-3xl font-black text-green-600 mt-2">
                  {confirmedCount.toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <h3 className="text-sm font-black text-[#1a1c1c] mb-4">Historial de Turnos</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin"></div>
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-6">No hay turnos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-100">
                        <th className="text-left py-3 pr-4">Cliente</th>
                        <th className="text-left py-3 pr-4">Servicio</th>
                        <th className="text-left py-3 pr-4">Fecha</th>
                        <th className="text-right py-3 pr-4">Total</th>
                        <th className="text-right py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="border-b border-stone-50 hover:bg-stone-50">
                          <td className="py-3 pr-4 font-bold text-[#1a1c1c]">{apt.name}</td>
                          <td className="py-3 pr-4 text-stone-500">{apt.oilType || apt.service || "-"}</td>
                          <td className="py-3 pr-4 text-stone-500">{apt.date || `${apt.day} ${apt.month}`}</td>
                          <td className="py-3 pr-4 text-right font-bold">${(apt.totalPrice || 0).toLocaleString("es-AR")}</td>
                          <td className="py-3 text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              apt.status === "Confirmado"
                                ? "bg-green-50 text-green-700"
                                : apt.status === "Pendiente"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-stone-100 text-stone-500"
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {selectedTab === "stock" && (
          <motion.div
            key="stock"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Productos Totales
                </span>
                <p className="text-3xl font-black text-[#1a1c1c] mt-2">
                  {totalProducts.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Stock Crítico
                </span>
                <p className="text-3xl font-black text-rose-600 mt-2">
                  {criticalStock.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Valor del Inventario
                </span>
                <p className="text-3xl font-black text-[#1a1c1c] mt-2">
                  ${totalStockValue.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <h3 className="text-sm font-black text-[#1a1c1c] mb-4">Productos en Inventario</h3>
              <div className="space-y-3">
                {inventoryProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100"
                  >
                    <div>
                      <p className="font-bold text-[#1a1c1c]">{p.name}</p>
                      <span className="text-[10px] font-bold uppercase text-stone-400">{p.category}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${p.critical ? "text-rose-600" : "text-[#1a1c1c]"}`}>
                        {p.stock < 10 ? `0${p.stock}` : p.stock}
                      </p>
                      <p className={`text-[10px] font-bold uppercase ${p.critical ? "text-rose-600" : "text-stone-400"}`}>
                        {p.critical ? "Stock Bajo" : "En Stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
