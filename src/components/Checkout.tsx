/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { BookingData } from "../App";

interface CheckoutProps {
  onNavigate: (view: string) => void;
  bookingData: BookingData | null;
}

export default function Checkout({ onNavigate, bookingData }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-24 font-manrope">
      <header className="bg-white flex justify-between items-center px-6 py-4 w-full h-16 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('back')}
            className="text-rose-900 hover:bg-stone-100 transition-colors rounded-full p-2 flex items-center justify-center border border-stone-100 px-3 py-1 font-bold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 
            onClick={() => onNavigate('login')}
            className="text-lg font-black tracking-tighter text-rose-900 uppercase cursor-pointer hover:opacity-80"
          >
            LUBRICENTER
          </h1>
        </div>
        <button onClick={() => onNavigate('login')} className="flex items-center text-rose-900">
          <span className="material-symbols-outlined text-2xl">account_circle</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-900 mb-4 block">Pago Seguro</span>
              <h2 className="text-5xl font-extrabold tracking-[-0.04em] leading-tight">
                Revisa <br />tu Reserva
              </h2>
            </div>
            
            <div className="bg-[#f3f3f3] rounded-xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-900/5 rounded-full blur-3xl"></div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-[#584141] uppercase tracking-wider">Servicio</p>
                    <p className="text-xl font-bold">{bookingData.oilType.split(' (')[0]}</p>
                    <p className="text-[10px] uppercase font-bold text-stone-400 mt-1">
                      {bookingData.day} {bookingData.month} • {bookingData.time}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-rose-900" style={{ fontVariationSettings: '"FILL" 1' }}>build</span>
                </div>
                <div className="pt-6 space-y-3 border-t border-stone-200">
                  <div className="flex justify-between text-[#584141] text-sm">
                    <span>Total del Servicio</span>
                    <span className="font-medium">${bookingData.totalPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-900 font-bold text-lg pt-2">
                    <span>Seña Requerida</span>
                    <span>${bookingData.depositPrice.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#e2e2e2]/30 rounded-lg">
              <span className="material-symbols-outlined text-stone-500" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
              <p className="text-xs text-[#584141] leading-relaxed">
                Su información de pago está encriptada y se procesa de forma segura. Nunca almacenamos los datos completos de su tarjeta.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white shadow-xl rounded-xl p-8 lg:p-10 border border-stone-100">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Detalles de Pago</h3>
                <p className="text-[#584141] text-sm">Selecciona tu método de pago e ingresa los detalles abajo.</p>
              </div>

              <div className="flex gap-4 p-1 bg-[#f3f3f3] rounded-xl mb-8">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "card" 
                      ? "bg-white shadow-sm text-rose-900" 
                      : "text-[#584141] hover:bg-stone-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  Crédito / Débito
                </button>
                <button 
                  onClick={() => setPaymentMethod("transfer")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "transfer" 
                      ? "bg-white shadow-sm text-rose-900" 
                      : "text-[#584141] hover:bg-stone-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">account_balance</span>
                  Transferencia
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">Nombre del Titular</label>
                    <input className="w-full bg-[#e8e8e8] border-none rounded-lg px-4 py-4 focus:ring-2 focus:ring-rose-900/20 focus:bg-white transition-all outline-none" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">Número de Tarjeta</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#584141]">credit_card</span>
                      <input className="w-full bg-[#e8e8e8] border-none rounded-lg pl-12 pr-4 py-4 focus:ring-2 focus:ring-rose-900/20 focus:bg-white transition-all outline-none" placeholder="0000 0000 0000 0000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">Fecha de Vencimiento</label>
                      <input className="w-full bg-[#e8e8e8] border-none rounded-lg px-4 py-4 text-center focus:ring-2 focus:ring-rose-900/20 focus:bg-white transition-all outline-none" placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">CVV</label>
                      <input className="w-full bg-[#e8e8e8] border-none rounded-lg px-4 py-4 text-center focus:ring-2 focus:ring-rose-900/20 focus:bg-white transition-all outline-none" placeholder="•••" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-rose-900 mb-2">
                    <span className="material-symbols-outlined">info</span>
                    <p className="text-xs font-bold uppercase tracking-wider">Datos para la transferencia</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-stone-100">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Alias</p>
                      <p className="font-bold text-lg select-all">LUBRICENTER.PRO.OK</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-stone-100">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">CBU</p>
                      <p className="font-mono text-sm select-all">0000000000000000000000</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-stone-100">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Banco</p>
                      <p className="font-bold">Banco Galicia</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 italic mt-4">
                    * Una vez realizada la transferencia, suba el comprobante o presione confirmar para que validemos el pago manualmente.
                  </p>
                </div>
              )}

              <div className="pt-8">
                <button 
                  onClick={() => onNavigate('confirmation')}
                  className="velocity-gradient w-full py-5 rounded-lg text-white font-bold text-lg tracking-tight hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{paymentMethod === "card" ? "lock" : "send"}</span>
                  {paymentMethod === "card" ? "Pagar" : "Confirmar Transferencia"} ${bookingData.depositPrice.toLocaleString('es-AR')}
                </button>
                <p className="text-center text-[10px] text-[#584141] mt-4 uppercase tracking-[0.1em]">
                  Transacción Segura Operada por LUBRICENTER SecurePay
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 rounded-2xl overflow-hidden h-[400px] relative shadow-2xl">
          <img 
            src="https://picsum.photos/seed/luxurycar/1200/600" 
            alt="Engine Excellence" 
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/60 to-transparent flex items-end p-12">
            <div className="max-w-md text-white">
              <h3 className="text-3xl font-bold mb-2">Excelencia en cada gota.</h3>
              <p className="text-white/80 leading-relaxed">Nuestros técnicos especializados aseguran que su motor rinda al máximo usando solo lubricantes sintéticos premium.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
