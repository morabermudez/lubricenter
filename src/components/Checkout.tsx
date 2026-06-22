/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { BookingData } from "../App";
// Importamos el SDK oficial de Mercado Pago
import { initMercadoPago } from '@mercadopago/sdk-react';

// Inicializamos el SDK asegurando que la clave pública esté perfecta
initMercadoPago('TEST-683fdcce-83ef-408d-98fd-c7fe76884ccd', {
  locale: 'es-AR'
});

interface CheckoutProps {
  onNavigate: (view: string) => void;
  bookingData: BookingData | null;
}

export default function Checkout({ onNavigate, bookingData }: CheckoutProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!bookingData) return null;

  // Función para solicitar la orden de pago y redireccionar de forma directa
  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const priceToSend = bookingData && bookingData.depositPrice ? bookingData.depositPrice : 1500;
      const titleToSend = bookingData && bookingData.oilType ? bookingData.oilType.split(' (')[0] : "Seña de Servicio";

      const response = await fetch("/api/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleToSend, 
          quantity: 1,
          price: priceToSend, 
        }),
      });

      const data = await response.json();

      // Si el servidor nos devuelve el init_point, mandamos al usuario directo a Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point; 
      } else {
        alert("No se pudo generar la orden de pago. Verifica el servidor.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Hubo un error al procesar la solicitud de pago.");
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 lg:p-10 border border-stone-100 flex flex-col items-center justify-center min-h-[300px] w-full">
              
              {/* Dejamos el botón azul nativo. Al hacer clic, procesa y redirecciona sin errores de interfaz */}
              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="bg-[#009ee3] hover:bg-[#008cc9] text-white w-full max-w-md py-6 rounded-xl font-black text-2xl tracking-tight active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 shadow-sky-500/35 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>payments</span>
                {isLoading ? "Procesando transferencia..." : "Confirmar y Pagar Seña"}
              </button>

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