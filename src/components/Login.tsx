/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";

interface LoginProps {
  onNavigate: (view: string, email?: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col font-manrope">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('back')}
              className="hover:bg-stone-50 transition-colors p-2 rounded-full"
            >
              <span className="material-symbols-outlined text-rose-900">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tighter text-rose-900">Lubricenter</h1>
          </div>
          <div className="text-rose-900 font-bold tracking-tight">Perfil</div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center max-w-md mx-auto w-full">
        <div className="mt-8 mb-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-rose-900 rounded-2xl flex items-center justify-center shadow-2xl mb-6 shadow-rose-900/20"
          >
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>precision_manufacturing</span>
          </motion.div>
          <h2 className="text-4xl font-extrabold tracking-tight text-rose-900 mb-2">Iniciar Sesión</h2>
          <p className="text-[#584141] text-[10px] font-bold tracking-widest uppercase opacity-70">Acceso al Taller de Precisión</p>
        </div>

        <form className="w-full space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">Correo Electrónico</label>
            <input 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-5 py-4 bg-[#f3f3f3] border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-900/20 transition-all text-[#1a1c1c] outline-none" 
              placeholder="ejemplo@mail.com" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141] ml-1">Contraseña</label>
            <div className="relative">
              <input 
                className="w-full px-5 py-4 bg-[#f3f3f3] border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-900/20 transition-all text-[#1a1c1c] outline-none" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-900 transition-colors" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button 
              type="button"
              onClick={() => onNavigate('booking', emailInput || "cliente@ejemplo.com")}
              className="velocity-gradient w-full py-4 rounded-xl text-white font-bold tracking-tight shadow-xl shadow-rose-900/20 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">person</span>
              Entrar como Cliente
            </button>
            
            <button 
              type="button"
              onClick={() => onNavigate('admin', emailInput || "admin@lubricenter.pro")}
              className="bg-white border-2 border-rose-900/20 text-rose-900 w-full py-4 rounded-xl font-bold tracking-tight hover:bg-rose-50 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">engineering</span>
              Entrar como Empleado
            </button>
          </div>
        </form>

        <div className="w-full mt-12 space-y-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">O continuar con</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f3f3f3] rounded-xl hover:bg-stone-200 transition-colors font-bold text-sm">
              <span className="material-symbols-outlined text-rose-900">google</span>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f3f3f3] rounded-xl hover:bg-stone-200 transition-colors font-bold text-sm">
              <span className="material-symbols-outlined text-rose-900">apple</span>
              Apple
            </button>
          </div>
        </div>

        <div className="mt-16 w-full rounded-3xl overflow-hidden opacity-40 grayscale contrast-125">
          <img src="https://picsum.photos/seed/mechanical/600/200" alt="Mechanical" className="w-full h-32 object-cover" />
        </div>
      </main>
    </div>
  );
}
