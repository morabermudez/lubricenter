/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface LandingProps {
  onNavigate: (view: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-stone-50 to-stone-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full flex flex-col items-center justify-center gap-12"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-24 bg-rose-900 rounded-3xl flex items-center justify-center shadow-2xl mb-6 shadow-rose-900/20"
          >
            <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>precision_manufacturing</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-rose-900 uppercase tracking-tighter text-center"
          >
            LUBRICENTER
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.7 }}
            className="text-stone-500 text-xs font-bold uppercase tracking-[0.4em]"
          >
            Mantenimiento de Precisión
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          onClick={() => onNavigate('home')}
          className="group relative px-16 py-6 bg-rose-900 text-white rounded-2xl font-black text-2xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(159,18,57,0.3)] overflow-hidden active:scale-95 transition-all mt-8"
        >
          <div className="absolute inset-0 velocity-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative z-10 flex items-center gap-4">
            Ingresar
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform text-3xl">arrow_forward</span>
          </span>
        </motion.button>
      </motion.div>

      {/* Decoración sutil de fondo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] flex items-center justify-center">
        <span className="material-symbols-outlined text-[60rem]">engineering</span>
      </div>
    </div>
  );
}
