/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { BookingData } from "../App";
import { saveAppointment } from "../services/bookingService";

interface ConfirmationProps {
  onNavigate: (view: string) => void;
  bookingData: BookingData | null;
}

export default function Confirmation({ onNavigate, bookingData }: ConfirmationProps) {
  const hasSaved = useRef(false);

  useEffect(() => {
    if (bookingData && !hasSaved.current) {
      saveAppointment(bookingData).catch(console.error);
      hasSaved.current = true;
    }
  }, [bookingData]);

  if (!bookingData) return null;

  const reservationId = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col font-manrope">
      <header className="bg-white flex justify-between items-center px-6 py-4 w-full h-16 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className="hover:bg-stone-100 transition-colors p-2 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined text-rose-900">arrow_back</span>
          </button>
          <h1 
            onClick={() => onNavigate('login')}
            className="text-lg font-black tracking-tighter text-rose-900 uppercase cursor-pointer hover:opacity-80"
          >
            LUBRICENTER
          </h1>
        </div>
        <button onClick={() => onNavigate('login')} className="p-2 rounded-full hover:bg-stone-50 transition-colors">
          <span className="material-symbols-outlined text-rose-900">account_circle</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 mb-8 shadow-green-100 shadow-xl"
          >
            <span className="material-symbols-outlined text-green-600 text-6xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.02em] mb-4">¡Pago realizado con éxito!</h2>
          <p className="text-[#584141] text-lg font-medium">Tu turno ha sido confirmado</p>
        </div>

        <div className="w-full grid md:grid-cols-12 gap-8 items-start">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 bg-white p-8 rounded-xl shadow-lg relative overflow-hidden border border-stone-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 velocity-gradient opacity-5 rounded-bl-full -mr-16 -mt-16"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#584141] block mb-1">ID DE RESERVA</span>
                <p className="text-xl font-bold text-rose-900">#LC-{reservationId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#584141] block mb-1">Estado</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-black rounded-full uppercase">Confirmado</span>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: 'calendar_today', label: 'Fecha y Hora', value: `${bookingData.day} de ${bookingData.month} • ${bookingData.time}` },
                { icon: 'build', label: 'Servicio', value: bookingData.oilType.split(' (')[0] },
                { icon: 'directions_car', label: 'Vehículo', value: `Patente: ${bookingData.plate.toUpperCase()}` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#e8e8e8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#584141]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#584141] font-bold uppercase tracking-tighter">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-stone-100 flex justify-between items-center">
              <span className="text-lg font-bold">Reserva Pagada (50%)</span>
              <span className="text-3xl font-black">${bookingData.depositPrice.toLocaleString('es-AR')}</span>
            </div>
          </motion.div>

          <div className="md:col-span-5 flex flex-col gap-4 h-full">
            <div className="bg-[#f3f3f3] p-6 rounded-xl flex-grow border border-stone-100">
              <h3 className="font-bold mb-2">Próximos Pasos</h3>
              <ul className="space-y-4">
                {[
                  { id: '01', text: 'Recibirás un recordatorio por correo electrónico 24 horas antes.' },
                  { id: '02', text: 'Por favor, llega 10 minutos antes de tu cita programada.' },
                  { id: '03', text: 'Muestra este recibo digital al llegar al taller.' }
                ].map(step => (
                  <li key={step.id} className="flex gap-3 text-sm text-[#584141]">
                    <span className="text-rose-900 font-black">{step.id}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button className="w-full flex items-center justify-center gap-2 py-4 px-6 velocity-gradient text-white font-bold rounded-xl shadow-lg border-none active:scale-95 transition-all">
                <span className="material-symbols-outlined text-sm">download</span>
                Descargar Comprobante
              </button>
              <button 
                onClick={() => onNavigate('home')}
                className="w-full py-4 px-6 bg-[#e2e2e2] text-[#1a1c1c] font-bold rounded-xl hover:bg-stone-300 transition-colors active:scale-95"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-[#584141] text-xs border-t border-stone-100 mx-6">
        <p>© 2024 LUBRICENTER – Ingeniería en Lubricación de Precisión.</p>
      </footer>
    </div>
  );
}
