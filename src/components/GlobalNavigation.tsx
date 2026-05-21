/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface GlobalNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole?: 'none' | 'client' | 'employee';
}

export default function GlobalNavigation({ currentView, onNavigate, userRole = 'none' }: GlobalNavigationProps) {
  // We hide navigation on transitional screens like Checkout and Confirmation for focus
  const hideMobileNav = ['landing', 'checkout', 'confirmation', 'admin-booking'].includes(currentView);

  if (hideMobileNav) return null;

  // Filter navigation items based on the user role
  const allNavItems = [
    { id: 'home', label: 'Inicio', icon: 'home', roles: ['client', 'employee', 'none'] },
    { id: 'booking', label: 'Servicios', icon: 'build', roles: ['client'] },
    { id: 'inventory', label: 'Stock', icon: 'inventory_2', roles: ['employee'] },
    { id: 'admin', label: 'Citas', icon: 'event_available', roles: ['employee'] },
    { id: 'login', label: 'Perfil', icon: 'person', roles: ['client', 'employee', 'none'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-[100] flex justify-around items-center px-4 pb-10 pt-4 bg-white/95 backdrop-blur-md border-t border-stone-100 shadow-[0_-4px_20px_rgba(88,0,19,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center flex-1 transition-all duration-200 ${
              currentView === item.id ? 'text-rose-900 scale-110' : 'text-stone-400 hover:text-rose-700'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: currentView === item.id ? '"FILL" 1' : '"FILL" 0' }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Global Footer */}
      <footer className="hidden md:block bg-stone-900 text-white py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-500 text-3xl">precision_manufacturing</span>
              <h2 className="text-xl font-black uppercase tracking-tighter">Lubricenter</h2>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Mantenimiento vehicular de alta precisión. Tecnología avanzada y repuestos premium para el máximo rendimiento de tu motor.
            </p>
          </div>

          <div>
            <h3 className="font-bold uppercase text-xs tracking-[0.2em] text-rose-500 mb-6">Navegación</h3>
            <ul className="space-y-3">
              {navItems.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => onNavigate(item.id)}
                    className="text-stone-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase text-xs tracking-[0.2em] text-rose-500 mb-6">Servicios</h3>
            <ul className="space-y-3 text-stone-400 text-sm font-medium">
              <li>Cambio de Aceite</li>
              <li>Filtros y Fluidos</li>
              <li>Diagnóstico Digital</li>
              <li>Mantenimiento Preventivo</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase text-xs tracking-[0.2em] text-rose-500 mb-6">Contacto</h3>
            <ul className="space-y-3 text-stone-400 text-sm font-medium">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">location_on</span>
                Av. Principal 1234, Ciudad
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">call</span>
                +54 9 11 0000-0000
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                info@lubricenter.pro
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-stone-600">
          <p>© 2024 LUBRICENTER PRO. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-8">
            <button className="hover:text-stone-400">Privacidad</button>
            <button className="hover:text-stone-400">Términos</button>
            <button className="hover:text-stone-400">Soporte</button>
          </div>
        </div>
      </footer>
    </>
  );
}
