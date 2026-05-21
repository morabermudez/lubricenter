/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { BookingData } from "../App";

interface BookingProps {
  onNavigate: (view: string) => void;
  onBookingComplete: (data: BookingData) => void;
  userEmail: string;
  nextView?: string;
  backView?: string;
}

export default function Booking({ 
  onNavigate, 
  onBookingComplete, 
  userEmail, 
  nextView = 'checkout',
  backView = 'home'
}: BookingProps) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [selectedOil, setSelectedOil] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  // Dynamic Days Generator
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const currentYear = 2026;
  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  
  const isPastMonth = currentMonthIndex < today.getMonth();
  const isCurrentMonth = currentMonthIndex === today.getMonth();

  const timeSlots = ["09:00 AM", "10:30 AM", "11:00 AM", "02:30 PM", "04:00 PM", "05:30 PM"];

  const oilPrices: Record<string, number> = {
    "Sintético Premium (5W-30 / 5W-40)": 32000,
    "Semi-sintético (10W-40)": 24000,
    "Mineral de Alto Rendimiento (15W-40)": 18000
  };

  const oilPrice = selectedOil ? (oilPrices[selectedOil] || 0) : 0;
  const filterPrice = selectedOil ? 8500 : 0;
  const laborPrice = selectedOil ? 5000 : 0;
  const totalBudget = oilPrice + filterPrice + laborPrice;
  const depositPrice = totalBudget * 0.5;

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate(backView)}
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
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-stone-100 transition-colors">
              <span className="material-symbols-outlined text-stone-500">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-200">
              <img src="https://picsum.photos/seed/manager/100/100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-[#1a1c1c]">Reserva tu Turno</h2>
          <p className="text-[#584141] max-w-2xl text-lg leading-relaxed">Configura el mantenimiento de tu vehículo con precisión milimétrica. Selecciona los servicios y la fecha que mejor se adapten a tu agenda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1 */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full velocity-gradient text-white flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="text-xl font-bold tracking-tight">Datos Personales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#584141] uppercase tracking-widest px-1">Nombre Completo</label>
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f3f3f3] border-none rounded-lg p-4 focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all outline-none" 
                    placeholder="Ej. Juan Pérez" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-[#584141] uppercase tracking-widest px-1">Correo Electrónico (Registrado)</label>
                  <div className="w-full bg-[#eee] border border-stone-200 rounded-lg p-4 text-stone-500 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    {userEmail}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-[#584141] uppercase tracking-widest px-1">Teléfono de Contacto</label>
                  <input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f3f3f3] border-none rounded-lg p-4 focus:ring-2 focus:ring-rose-900 focus:bg-white transition-all outline-none" 
                    placeholder="+54 9 11 0000-0000" 
                  />
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="bg-[#f3f3f3] p-8 rounded-xl border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full velocity-gradient text-white flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-xl font-bold tracking-tight">Información del Vehículo</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#584141] uppercase tracking-widest px-1">Patente / Dominio</label>
                    <input 
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      className="w-full bg-white border-none rounded-lg p-4 font-mono text-xl tracking-widest uppercase focus:ring-2 focus:ring-rose-900 transition-all outline-none" 
                      placeholder="ABC 123 o AA 123 BB" 
                    />
                  </div>
                  <p className="text-sm text-[#584141] italic">Utilizamos su patente para identificar el historial de servicios previo en nuestro taller.</p>
                </div>
                <div className="w-full md:w-1/2 h-40 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://picsum.photos/seed/engine/600/400" alt="Engine" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full velocity-gradient text-white flex items-center justify-center font-bold text-sm">3</span>
                <h3 className="text-xl font-bold tracking-tight">Selección de Servicio</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#584141] uppercase tracking-widest px-1">Tipo de Aceite</label>
                  <div className="relative">
                    <select 
                      value={selectedOil}
                      onChange={(e) => setSelectedOil(e.target.value)}
                      className="w-full appearance-none bg-[#f3f3f3] border-none rounded-lg p-4 pr-12 focus:ring-2 focus:ring-rose-900 transition-all font-medium outline-none"
                    >
                      <option value="" disabled>Seleccione una opción</option>
                      <option value="Sintético Premium (5W-30 / 5W-40)">Sintético Premium ($32.000)</option>
                      <option value="Semi-sintético (10W-40)">Semi-sintético ($24.000)</option>
                      <option value="Mineral de Alto Rendimiento (15W-40)">Mineral de Alto Rendimiento ($18.000)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-4 text-[#584141] pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section className="bg-[#f3f3f3] p-8 rounded-xl border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-8 rounded-full velocity-gradient text-white flex items-center justify-center font-bold text-sm">4</span>
                <h3 className="text-xl font-bold tracking-tight">Fecha y Hora</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <div className="md:col-span-4 bg-white p-4 rounded-xl border border-stone-100">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="font-bold">{months[currentMonthIndex]} {currentYear}</span>
                    <div className="flex gap-2">
                      <button 
                        disabled={isCurrentMonth}
                        onClick={() => setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11))}
                        className={`p-1 rounded-full transition-colors ${isCurrentMonth ? 'text-stone-200 cursor-not-allowed' : 'hover:bg-stone-50'}`}
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button 
                        onClick={() => setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0))}
                        className="p-1 hover:bg-stone-50 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                      <span key={`${d}-${i}`} className="text-[10px] font-black text-stone-400">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(n => {
                      const isPastDay = isCurrentMonth && n < today.getDate();
                      const isDisabled = isPastMonth || isPastDay;
                      
                      return (
                        <button 
                          key={n} 
                          disabled={isDisabled}
                          onClick={() => setSelectedDay(n)}
                          className={`p-2 font-medium rounded-lg transition-all ${
                            selectedDay === n 
                              ? 'bg-rose-900 text-white font-bold shadow-md scale-110 z-10' 
                              : isDisabled
                              ? 'text-stone-200 cursor-not-allowed'
                              : 'hover:bg-rose-50 text-stone-900'
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="md:col-span-3 space-y-3">
                  <p className="text-[10px] font-bold text-[#584141] uppercase tracking-widest">Horarios Disponibles</p>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        disabled={time === "04:00 PM"}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-lg text-sm transition-all ${
                          selectedTime === time
                            ? "bg-rose-900 text-white font-bold shadow-md"
                            : time === "04:00 PM"
                            ? "bg-stone-200 text-stone-400 font-medium cursor-not-allowed"
                            : "bg-white text-[#1a1c1c] font-medium border border-stone-100 hover:border-rose-900"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-100">
                <div className="velocity-gradient p-6 text-white">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Presupuesto Estimado</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-light">$</span>
                    <span className="text-5xl font-black tracking-tighter">{totalBudget.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm text-[#584141]">
                    <span className="truncate max-w-[200px]">
                      {selectedOil ? selectedOil.split(' (')[0] : "Servicio de Aceite"}
                    </span>
                    <span className="font-bold text-[#1a1c1c]">${oilPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#584141]">
                    <span>Filtro de Aceite</span>
                    <span className="font-bold text-[#1a1c1c]">${filterPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#584141] pb-4 border-b border-stone-100">
                    <span>Mano de Obra Especializada</span>
                    <span className="font-bold text-[#1a1c1c]">${laborPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-rose-900 uppercase">Seña Requerida (50%)</span>
                      <span className="text-lg font-black text-rose-900">${depositPrice.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1 text-[10px] text-stone-500 font-bold uppercase">
                      <span>{selectedDay} {months[currentMonthIndex].substring(0, 3)} {currentYear}</span>
                      <span>{selectedTime || "---"}</span>
                    </div>
                    <p className="text-[10px] text-rose-800 leading-tight">El pago de la seña garantiza tu lugar en la agenda técnica.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  disabled={!name || !phone || !plate || !selectedOil || !selectedTime}
                  onClick={() => {
                    onBookingComplete({
                      name,
                      email: userEmail,
                      phone,
                      plate,
                      oilType: selectedOil,
                      day: selectedDay,
                      month: months[currentMonthIndex],
                      time: selectedTime,
                      totalPrice: totalBudget,
                      depositPrice: depositPrice
                    });
                    onNavigate(nextView);
                  }}
                  className={`w-full font-bold py-5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${
                    (!name || !phone || !plate || !selectedOil || !selectedTime)
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'velocity-gradient text-white shadow-rose-900/20 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  <span>{nextView === 'admin' ? 'Confirmar Turno Administrativo' : 'Confirmar Turno (Pagar Seña 50%)'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button 
                  onClick={() => onNavigate(backView)}
                  className="w-full bg-[#f3f3f3] text-[#1a1c1c] font-bold py-4 rounded-xl hover:bg-stone-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
              </div>

              <div className="flex items-center gap-4 px-2 opacity-60">
                <span className="material-symbols-outlined text-4xl text-rose-900">verified_user</span>
                <div className="text-[10px] uppercase font-black tracking-widest leading-none">
                  Transacción Segura<br />
                  Certificación Lubricenter
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
