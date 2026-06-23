/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchAppointments, deleteAppointment, updateAppointment } from "../services/bookingService";
import Notificaciones from './Notificaciones';



interface AdminAgendaProps {
  onNavigate: (view: string) => void;
}

export default function AdminAgenda({ onNavigate }: AdminAgendaProps) {
  const now = new Date();
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState<'daily' | 'all'>('daily');
  const [searchName, setSearchName] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [topSearch, setTopSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const currentYear = now.getFullYear();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este turno?")) return;
    
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(apt => String(apt.id) !== String(id)));
      setEditingAppointment(null);
    } catch (error) {
      alert("Error al eliminar el turno");
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointment(id, { status: newStatus });
      setAppointments(prev => prev.map(apt => 
        String(apt.id) === String(id) ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      alert("Error al actualizar el estado");
      console.error(error);
    }
  };

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 is Sunday, 1 is Monday... adapt to L M M J V S D (Monday first)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust so Monday is 0
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonthIndex);

  // Helper to check if a day has appointments
  const hasApptOnDay = (day: number) => {
    const monthStr = months[currentMonthIndex].substring(0, 3);
    return appointments.some(apt => {
      // Logic from bookingService: date: `${appointment.day} ${appointment.month.substring(0, 3)}`
      const aptDate = apt.date || ""; // e.g. "21 Abr"
      return aptDate === `${day} ${monthStr}`;
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesName = apt.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesPlate = apt.plate.toLowerCase().includes(searchPlate.toLowerCase());
    const topSearchText = topSearch.toLowerCase();
    const matchesTopSearch = !topSearchText || [
      apt.name,
      apt.plate,
      apt.service,
      apt.status,
      apt.date,
      apt.time,
    ].some(value => String(value || "").toLowerCase().includes(topSearchText));
    return matchesName && matchesPlate && matchesTopSearch;
  });

  const appointmentsToDisplay = viewMode === 'daily' && !topSearch
    ? appointments.filter(apt => {
        const monthStr = months[currentMonthIndex].substring(0, 3);
        const aptDate = apt.date || "";
        return aptDate === `${selectedDay} ${monthStr}`;
      })
    : filteredAppointments;

  const pendingAppointments = appointments.filter(a => a.status === 'Pendiente');
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmado');

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen py-6 sticky top-0 bg-[#f5f5f0] w-72 rounded-r-2xl border-r border-stone-100 z-40">
        <div className="px-6 mb-10 flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="material-symbols-outlined text-rose-900 text-3xl"
          >
            precision_manufacturing
          </button>
          <h1 
            onClick={() => onNavigate('login')}
            className="text-lg font-bold text-rose-900 tracking-tighter uppercase cursor-pointer hover:opacity-80 transition-opacity"
          >
            Lubricenter
          </h1>
        </div>
        <div className="px-4 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200">
            <img src="https://picsum.photos/seed/techie/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-sm">Líder de Servicio</p>
            <p className="text-xs text-stone-500">Módulo Interno</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => onNavigate('inventory')} className="w-full flex items-center gap-3 text-stone-600 hover:bg-stone-200 mx-2 px-4 py-3 rounded-lg transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">Panel</span>
          </button>
          <button className="w-full flex items-center gap-3 bg-rose-900 text-white rounded-lg mx-2 px-4 py-3 shadow-lg shadow-rose-900/20">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="font-medium text-sm">Citas</span>
          </button>
          <button onClick={() => onNavigate('inventory')} className="w-full flex items-center gap-3 text-stone-600 hover:bg-stone-200 mx-2 px-4 py-3 rounded-lg transition-colors">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-medium text-sm">Inventario</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="fixed top-0 w-full z-50 md:relative md:sticky bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-100 flex items-center justify-between px-6 py-4">
          <div className="md:hidden flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-900">precision_manufacturing</span>
            <span 
              onClick={() => onNavigate('login')}
              className="text-xl font-black text-rose-900 uppercase cursor-pointer hover:opacity-80"
            >
              Lubricenter
            </span>
          </div>
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
              <input 
                value={topSearch}
                onChange={(e) => {
                  setTopSearch(e.target.value);
                  if (e.target.value.trim()) setViewMode('all');
                }}
                className="w-full bg-[#f3f3f3] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" 
                placeholder="Buscar cita, patente o servicio..." 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowNotifications(prev => !prev)}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors relative"
              aria-label="Ver notificaciones"
            >
              <span className="material-symbols-outlined text-[#584141]">notifications</span>
              {pendingAppointments.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-10 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-stone-100 p-4 z-[80]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-sm text-[#1a1c1c]">Notificaciones</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-stone-400 hover:text-rose-900">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setViewMode('all');
                      setTopSearch('Pendiente');
                      setShowNotifications(false);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <p className="font-black text-sm text-amber-800">{pendingAppointments.length} turnos pendientes</p>
                    <p className="text-xs text-amber-700">Tocá para revisarlos y confirmarlos.</p>
                  </button>
                  <button 
                    onClick={() => {
                      setViewMode('all');
                      setTopSearch('Confirmado');
                      setShowNotifications(false);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <p className="font-black text-sm text-green-800">{confirmedAppointments.length} turnos confirmados</p>
                    <p className="text-xs text-green-700">Tocá para ver la agenda confirmada.</p>
                  </button>
                </div>
              </div>
            )}
            <div className="w-8 h-8 rounded-full velocity-gradient text-white flex items-center justify-center font-bold text-xs shadow-lg">JD</div>
          </div>
        </header>

        <section className="pt-24 pb-8 px-6 md:pt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#584141] uppercase">Panel de Operaciones</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Gestión de Citas</h2>
              </div>
              <button 
                onClick={() => onNavigate('admin-booking')}
                className="velocity-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Agendar Turno
              </button>
              <Notificaciones />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: `Citas para el ${selectedDay}/${currentMonthIndex + 1}`, value: appointmentsToDisplay.length.toString().padStart(2, '0'), border: 'border-rose-900' },
                { label: 'Total Pendientes', value: appointments.filter(a => a.status === 'Pendiente').length.toString().padStart(2, '0'), border: '' },
                { label: 'Total Confirmadas', value: appointments.filter(a => a.status === 'Confirmado').length.toString().padStart(2, '0'), border: '' },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-xl shadow-sm flex flex-col justify-between h-32 border-stone-100 border bg-white ${stat.border}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{stat.label}</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-rose-900">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setViewMode('daily')}
                      className={`text-xl font-bold tracking-tight pb-1 border-b-2 transition-all ${viewMode === 'daily' ? 'border-rose-900 text-[#1a1c1c]' : 'border-transparent text-stone-400'}`}
                    >
                      Agenda: {selectedDay} {months[currentMonthIndex]}
                    </button>
                    <button 
                      onClick={() => setViewMode('all')}
                      className={`text-xl font-bold tracking-tight pb-1 border-b-2 transition-all ${viewMode === 'all' ? 'border-rose-900 text-[#1a1c1c]' : 'border-transparent text-stone-400'}`}
                    >
                      Ver todas las citas
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-rose-900 text-white rounded-lg" aria-label="Vista de lista">
                      <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                    </button>
                  </div>
                </div>

                {viewMode === 'all' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#584141] ml-1">Filtrar por Nombre</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">person</span>
                        <input 
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          className="w-full bg-[#f3f3f3] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none" 
                          placeholder="Buscar cliente..." 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#584141] ml-1">Filtrar por Patente</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">badge</span>
                        <input 
                          value={searchPlate}
                          onChange={(e) => setSearchPlate(e.target.value)}
                          className="w-full bg-[#f3f3f3] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none" 
                          placeholder="Buscar patente..." 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-stone-100 border-dashed">
                    <div className="w-12 h-12 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin mb-4"></div>
                    <p className="text-stone-500 font-medium">Cargando citas...</p>
                  </div>
                ) : appointmentsToDisplay.length > 0 ? appointmentsToDisplay.map((apt, i) => (
                  <motion.div 
                    key={apt.id || apt.id_reserva || i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setEditingAppointment(apt)}
                    className={`group bg-white p-5 rounded-xl flex flex-wrap md:flex-nowrap items-center gap-6 border-l-4 border-${apt.color} hover:shadow-md transition-shadow border-stone-100 border cursor-pointer`}
                  >
                    <div className="flex flex-col min-w-[80px]">
                      <span className="text-lg font-black">{apt.time}</span>
                      <span className="text-[10px] font-black text-rose-900 uppercase tracking-tighter">
                        {apt.date || "HOY"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-lg">{apt.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[10px] font-black text-stone-600 border border-stone-200">{apt.plate}</span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">settings_suggest</span>
                          {apt.service}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        apt.status === 'Confirmado' ? 'bg-green-50 text-green-700' : 
                        apt.status === 'Pendiente' ? 'bg-amber-50 text-amber-700' : 
                        'bg-stone-100 text-stone-500'
                      }`}>
                        {apt.status}
                      </span>
                      <div className="flex items-center gap-2">
                        {apt.status === 'Pendiente' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(String(apt.id), 'Confirmado');
                            }}
                            className="bg-green-600 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-green-600/20 hover:scale-105 active:scale-95 transition-all"
                            title="Confirmar Turno"
                          >
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Confirmar
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aquí podrías agregar otras opciones si lo deseas, 
                            // pero por ahora solo está el botón de más opciones vacío
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-50 text-stone-400"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-white p-12 rounded-xl border border-stone-100 border-dashed text-center">
                    <span className="material-symbols-outlined text-4xl text-stone-300 mb-4">search_off</span>
                    <p className="text-stone-500 font-medium">No se encontraron citas con esos criterios.</p>
                  </div>
                )}
              </div>

              <div className="lg:w-80 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{months[currentMonthIndex]} {currentYear}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11))}
                        className="p-1 hover:bg-stone-50 rounded-full transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button 
                        onClick={() => setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0))}
                        className="p-1 hover:bg-stone-50 rounded-full transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-stone-400 uppercase">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={`${d}-${i}`}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
                    {/* Empty slots for week alignment */}
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2"></div>
                    ))}
                    
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(n => {
                      const hasAppts = hasApptOnDay(n);
                      const isToday = now.getDate() === n && now.getMonth() === currentMonthIndex && now.getFullYear() === currentYear;
                      const isPast = new Date(currentYear, currentMonthIndex, n) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      
                      return (
                        <button 
                          key={n} 
                          onClick={() => setSelectedDay(n)}
                          disabled={isPast}
                          className={`p-2 rounded-lg transition-all relative flex flex-col items-center justify-center ${
                            selectedDay === n 
                              ? 'bg-rose-900 text-white shadow-md scale-110 z-10' 
                              : isToday
                              ? 'bg-rose-50 text-rose-900 border border-rose-200'
                              : isPast
                              ? 'text-stone-300 cursor-not-allowed opacity-50'
                              : 'hover:bg-rose-50'
                          }`}
                        >
                          {n}
                          {hasAppts && (
                            <span className={`w-1 h-1 rounded-full absolute bottom-1 ${selectedDay === n ? 'bg-white' : isPast ? 'bg-stone-300' : 'bg-rose-900'}`}></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-rose-900 p-6 rounded-2xl text-white relative overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Alerta de Inventario</h5>
                    <p className="text-xl font-bold leading-tight mb-4">El aceite Sintético 5W-30 se está agotando.</p>
                    <button onClick={() => onNavigate('inventory')} className="text-[10px] font-black uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg transition-colors">Gestionar Stock</button>
                  </div>
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12">oil_barrel</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Edición / Información */}
      {editingAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingAppointment(null)}
            className="absolute inset-0 bg-black/60 shadow-inner backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-100 flex flex-col"
          >
            <div className="bg-rose-900 p-8 text-white">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Detalles del Turno</span>
                <button onClick={() => setEditingAppointment(null)} className="text-white opacity-70 hover:opacity-100">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <h3 className="text-3xl font-black">{editingAppointment.name}</h3>
              <p className="text-rose-100/70 font-medium">{editingAppointment.date} - {editingAppointment.time}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Vehículo / Patente</span>
                  <span className="text-lg font-black text-[#1a1c1c]">{editingAppointment.plate}</span>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Estado Actual</span>
                  <span className={`text-sm font-black uppercase tracking-wider ${
                    editingAppointment.status === 'Confirmado' ? 'text-green-600' : 'text-amber-600'
                  }`}>{editingAppointment.status}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Servicio Solicitado</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-900">settings_suggest</span>
                  <span className="text-lg font-bold">{editingAppointment.service}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex flex-col gap-3">
                {editingAppointment.status === 'Pendiente' && (
                  <button 
                    onClick={() => {
                       handleStatusChange(String(editingAppointment.id), 'Confirmado');
                       setEditingAppointment(prev => ({ ...prev, status: 'Confirmado' }));
                    }}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Confirmar Turno
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(String(editingAppointment.id))}
                  className="w-full bg-rose-50 text-rose-900 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-rose-100 hover:bg-rose-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                  Eliminar permanentemente
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
