/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import Notificaciones from './Notificaciones';

interface WelcomeProps {
  onNavigate: (view: string) => void;
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div className="flex-grow flex flex-col relative min-h-screen">
      {/* Background Imagery */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#f9f9f9]/90 z-10"></div>
        <img
          src="https://picsum.photos/seed/workshop/1920/1080?grayscale"
          alt="Workshop"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('landing')}
              className="p-1 hover:bg-stone-100 rounded-full transition-colors"
              title="Volver al inicio"
            >
              <span className="material-symbols-outlined text-rose-900">arrow_back</span>
            </button>
            <span className="material-symbols-outlined text-rose-900">precision_manufacturing</span>
            <h1 
              onClick={() => onNavigate('login')}
              className="text-xl font-black text-rose-900 uppercase tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            >
              Lubricenter
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-stone-200">
            <img
              src="https://picsum.photos/seed/tech/100/100"
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="relative z-20 flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center space-y-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-stone-100 mb-4">
              <span className="material-symbols-outlined text-6xl text-rose-900">precision_manufacturing</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#1a1c1c] uppercase">
              Lubricenter
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-[#584141] font-medium uppercase">
              Ingeniería de Precisión en Mantenimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <span className="material-symbols-outlined text-rose-900 mb-3">verified</span>
              <h3 className="text-lg font-bold mb-1">Calidad Premium</h3>
              <p className="text-sm text-[#584141] leading-relaxed">Insumos de grado competición para el rendimiento óptimo de su vehículo.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <span className="material-symbols-outlined text-rose-900 mb-3">timer</span>
              <h3 className="text-lg font-bold mb-1">Turnos Express</h3>
              <p className="text-sm text-[#584141] leading-relaxed">Optimización de tiempos con procesos estandarizados de alta eficiencia.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
              <span className="material-symbols-outlined text-rose-900 mb-3">analytics</span>
              <h3 className="text-lg font-bold mb-1">Diagnóstico Digital</h3>
              <p className="text-sm text-[#584141] leading-relaxed">Reportes detallados de cada intervención directamente en su dispositivo.</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6 pt-4">
            <button 
              onClick={() => onNavigate('login')}
              className="velocity-gradient text-white px-12 py-5 rounded-xl font-bold text-xl shadow-xl shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all w-full max-w-md flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">login</span>
              Iniciar Sesión
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-white text-rose-900 border-2 border-rose-900/20 px-12 py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-rose-50 active:scale-95 transition-all w-full max-w-md flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">person_add</span>
              Registrarse
            </button>
          </div>
        </motion.div>
      </main>

      <section className="relative z-20 px-6 py-12 bg-[#eee]/50 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  alt="Reviewer" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-bold">+12k Clientes Satisfechos</p>
              <div className="flex text-amber-500">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale font-black text-xl italic tracking-tighter">
            <span>CASTROL</span>
            <span>MOTUL</span>
            <span>SHELL</span>
            <span>MOBIL</span>
          </div>
        </div>
      </section>

    </div>
  );
}
