/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchAppointments } from "../services/bookingService";

interface MyBookingsProps {
  onNavigate: (view: string) => void;
  userEmail: string;
}

export default function MyBookings({ onNavigate, userEmail }: MyBookingsProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        const mine = (data || []).filter((apt: any) => {
          const emailMatch = String(apt.email || "").toLowerCase() === String(userEmail || "").toLowerCase();
          return emailMatch;
        });
        setAppointments(mine);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('back')}
              className="p-1 hover:bg-stone-100 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-rose-900">arrow_back</span>
            </button>
            <h1
              onClick={() => onNavigate('login')}
              className="text-xl font-black text-rose-900 uppercase tracking-tighter cursor-pointer hover:opacity-80"
            >
              Lubricenter
            </h1>
          </div>
          <button
            onClick={() => onNavigate('booking')}
            className="text-rose-900 text-sm font-black uppercase tracking-wider flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Nuevo Turno
          </button>
        </div>
      </header>

      <main className="pt-24 pb-24 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-10">
          <span className="text-[10px] font-black tracking-[0.2em] text-[#584141] uppercase">Panel del Cliente</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-[#1a1c1c]">Mis Turnos</h2>
          <p className="text-[#584141] max-w-2xl">Tus reservas quedan guardadas y son visibles para el taller. Acá podés revisar fecha, hora y estado.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-stone-100 border-dashed">
            <div className="w-12 h-12 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-medium">Cargando tus turnos...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <motion.div
                key={apt.id || apt.id_reserva || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex flex-col min-w-[90px]">
                  <span className="text-lg font-black text-rose-900">{apt.time}</span>
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-tighter">
                    {apt.date || `${apt.day || ''} ${apt.month ? apt.month.substring(0, 3) : ''}`.trim()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-lg">{apt.name}</h4>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-[10px] font-black text-stone-600 border border-stone-200">{apt.plate}</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">settings_suggest</span>
                      {apt.service || apt.oilType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#1a1c1c]">
                    ${Number(apt.depositPrice || 0).toLocaleString('es-AR')}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    apt.status === 'Confirmado' ? 'bg-green-50 text-green-700' :
                    apt.status === 'Pendiente' ? 'bg-amber-50 text-amber-700' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {apt.status || 'Pendiente'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl border border-stone-100 border-dashed text-center">
            <span className="material-symbols-outlined text-5xl text-stone-300 mb-4 block">event_available</span>
            <p className="text-stone-500 font-medium">Todavía no tenés turnos registrados con tu cuenta.</p>
            <button
              onClick={() => onNavigate('booking')}
              className="mt-6 velocity-gradient text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 active:scale-95 transition-all mx-auto"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Reservar mi primer turno
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
