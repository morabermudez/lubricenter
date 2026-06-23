/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchInventory, updateInventoryProduct } from "../services/inventoryService";

interface InventoryProps {
  onNavigate: (view: string) => void;
}

export default function Inventory({ onNavigate }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState([
    { id: 1, name: "Royal Purple High Mileage 5W-30", sku: "LUB-RP-5W30-HM", category: "Aceite de Motor", stock: 4, critical: true, icon: "oil_barrel", description: "Aceite sintético de alto rendimiento para motores con más de 120.000km.", price: 32000 },
    { id: 2, name: "Bosch Premium Oil Filter 3330", sku: "FIL-B-3330", category: "Filtros", stock: 42, critical: false, icon: "filter_alt", description: "Filtro de aceite premium con eficiencia del 99%.", price: 8500 },
    { id: 3, name: "Prestone All-Season Coolant", sku: "COO-PRE-GAL", category: "Refrigerantes", stock: 18, critical: false, icon: "water_drop", description: "Refrigerante de larga duración para todo tipo de climas.", price: 12400 },
    { id: 4, name: "NGK Iridium Spark Plug Set", sku: "SP-NGK-IRID", category: "Encendido", stock: 2, critical: true, icon: "settings_input_component", description: "Bujías de iridio para encendido eficiente y ahorro de combustible.", price: 15600 },
  ]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventory();
        if (data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  const handleUpdateProduct = async (updatedProduct: any) => {
    try {
      const savedProduct = await updateInventoryProduct(updatedProduct.id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      setSelectedProduct(null);
      setIsEditing(false);
    } catch (error) {
      alert("Error al actualizar el producto");
      console.error(error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesCritical = !showOnlyCritical || p.critical;
    return matchesSearch && matchesCategory && matchesCritical;
  });

  const criticalCount = products.filter(p => p.critical).length;

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('back')}
              className="p-1 hover:bg-stone-100 rounded-full"
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
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              <button onClick={() => onNavigate('admin')} className="text-stone-500 font-bold hover:text-rose-900">Panel</button>
              <button className="text-rose-900 font-black">Inventario</button>
              <button onClick={() => onNavigate('admin')} className="text-stone-500 font-bold hover:text-rose-900">Citas</button>
            </nav>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-stone-100">
              <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="lg:ml-0 px-6 py-8 pt-24 pb-24 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-stone-100 relative overflow-hidden">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#584141] mb-4">Velocidad de Servicio</h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-extrabold tracking-tighter">1,284</p>
                <p className="text-sm text-[#584141] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +12% vs mes anterior
                </p>
              </div>
              <div className="flex items-end gap-1 h-20">
                {[30, 50, 40, 60, 55, 80, 75, 100].map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-3 rounded-t-sm ${i === 7 ? 'velocity-gradient' : 'bg-rose-900/20'}`} 
                    style={{ height: `${h}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-rose-900 p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between text-white">
            <div className="relative z-10">
              <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-4">Alertas de Stock</h2>
              <p className="text-5xl font-black tracking-tighter">{criticalCount < 10 ? `0${criticalCount}` : criticalCount}</p>
              <p className="text-sm opacity-80">Artículos críticos que requieren pedido</p>
            </div>
            <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-white text-[120px] opacity-20">error_outline</span>
            <button 
              onClick={() => {
                setShowOnlyCritical(!showOnlyCritical);
                setSelectedCategory("Todos");
              }}
              className={`${showOnlyCritical ? 'bg-white text-rose-900' : 'bg-white/10 hover:bg-white/20 text-white'} backdrop-blur-sm text-sm font-bold py-2 px-4 rounded-lg w-fit mt-4 transition-all`}
            >
              {showOnlyCritical ? 'Ver Todo' : 'Revisar Lista'}
            </button>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#eee] border-none rounded-xl py-4 pl-12 pr-4 focus:bg-white focus:ring-2 focus:ring-rose-900/20 transition-all outline-none" 
                placeholder="Buscar por nombre de producto o serie..." 
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {['Todos', 'Aceite de Motor', 'Filtros', 'Refrigerantes', 'Encendido'].map((c) => (
                <button 
                  key={c} 
                  onClick={() => {
                    setSelectedCategory(c);
                    if (c !== "Todos") setShowOnlyCritical(false);
                  }}
                  className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    (selectedCategory === c && !showOnlyCritical)
                      ? 'velocity-gradient text-white' 
                      : 'bg-[#e4e2e2] text-[#1a1c1c] hover:bg-stone-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {showOnlyCritical && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-600">warning</span>
                <p className="text-sm font-bold text-rose-900">Mostrando solo artículos con Stock Crítico</p>
              </div>
              <button 
                onClick={() => setShowOnlyCritical(false)}
                className="text-[10px] font-black uppercase text-rose-900 hover:underline"
              >
                Quitar Filtro
              </button>
            </motion.div>
          )}
        </section>

        <section className="space-y-4">
          <div className="hidden md:grid grid-cols-12 px-6 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <div className="col-span-5">Detalles del Producto</div>
            <div className="col-span-3 text-center">Categoría</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-stone-100 border-dashed">
              <div className="w-12 h-12 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-500 font-medium">Cargando inventario...</p>
            </div>
          ) : filteredProducts.map((p, i) => (
            <motion.div 
              key={p.sku}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-stone-100"
            >
              {p.critical && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-600 animate-pulse"></div>}
              <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-lg bg-[#f3f3f3] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-rose-900">{p.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1c1c]">{p.name}</h3>
                  <p className="text-xs text-stone-400 font-medium tracking-tighter">SKU: {p.sku}</p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-3 mt-4 md:mt-0 text-center uppercase">
                <span className="bg-[#e4e2e2] text-[#584141] px-4 py-1 rounded-full text-[10px] font-bold">
                  {p.category}
                </span>
              </div>
              <div className="col-span-1 md:col-span-2 mt-2 md:mt-0 flex flex-col items-center">
                <p className={`text-xl font-black ${p.critical ? 'text-rose-600' : 'text-[#1a1c1c]'}`}>{p.stock < 10 ? `0${p.stock}` : p.stock}</p>
                <p className={`text-[10px] uppercase font-bold tracking-tighter ${p.critical ? 'text-rose-600' : 'text-stone-400'}`}>
                  {p.critical ? 'Stock Bajo' : 'En Stock'}
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 mt-4 md:mt-0 flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsEditing(true);
                  }}
                  className="p-2 hover:bg-stone-100 rounded-lg text-stone-400"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedProduct(p);
                    setIsEditing(false);
                  }}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${p.critical ? 'velocity-gradient text-white' : 'bg-[#e4e2e2] text-[#1a1c1c]'}`}
                >
                  {p.critical ? 'Reordenar' : 'Detalles'}
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedProduct(null);
                setIsEditing(false);
              }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="velocity-gradient p-6 text-white shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Módulo de Producto</span>
                    <h3 className="text-2xl font-black tracking-tight">{isEditing ? 'Editar Producto' : 'Detalles del Producto'}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsEditing(false);
                    }}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {isEditing ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProduct(selectedProduct);
                  }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">ID Interno</label>
                        <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-400 border border-stone-100 italic">#{selectedProduct.id}</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">SKU Código</label>
                        <input 
                          value={selectedProduct.sku}
                          onChange={(e) => setSelectedProduct({...selectedProduct, sku: e.target.value})}
                          className="w-full p-3 bg-stone-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-900/20 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">Nombre del Producto</label>
                      <input 
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                        className="w-full p-3 bg-stone-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-900/20 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">Descripción Técnica</label>
                      <textarea 
                        value={selectedProduct.description}
                        onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                        className="w-full p-3 bg-stone-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-900/20 outline-none min-h-[100px]" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">Stock</label>
                        <input 
                          type="number"
                          value={selectedProduct.stock}
                          onChange={(e) => {
                            const newStock = parseInt(e.target.value) || 0;
                            setSelectedProduct({...selectedProduct, stock: newStock, critical: newStock < 10});
                          }}
                          className="w-full p-3 bg-stone-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-900/20 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">Precio de Venta ($)</label>
                        <input 
                          type="number"
                          value={selectedProduct.price}
                          onChange={(e) => setSelectedProduct({...selectedProduct, price: parseInt(e.target.value) || 0})}
                          className="w-full p-3 bg-stone-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-rose-900/20 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          setSelectedProduct(null);
                          setIsEditing(false);
                        }}
                        className="flex-1 py-3 bg-stone-100 rounded-lg font-bold text-sm text-[#584141] hover:bg-stone-200 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 py-3 velocity-gradient text-white rounded-lg font-bold text-sm shadow-lg shadow-rose-900/20 active:scale-95 transition-transform">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-2xl bg-[#f3f3f3] flex items-center justify-center border border-stone-100">
                        <span className="material-symbols-outlined text-rose-900 text-4xl">{selectedProduct.icon}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-[#584141] px-3 py-1 rounded-full">{selectedProduct.category}</span>
                        <h4 className="text-xl font-bold mt-2">{selectedProduct.name}</h4>
                        <p className="text-xs text-stone-400 font-medium">SKU: {selectedProduct.sku} | ID: #{selectedProduct.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#584141]">Descripción</label>
                      <p className="text-stone-600 leading-relaxed text-sm">{selectedProduct.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#f3f3f3] p-4 rounded-xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Precio Sugerido</span>
                        <span className="text-2xl font-black text-[#1a1c1c]">${selectedProduct.price.toLocaleString('es-AR')}</span>
                      </div>
                      <div className={`p-4 rounded-xl border ${selectedProduct.critical ? 'bg-rose-50 border-rose-100' : 'bg-[#f3f3f3] border-stone-100'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Stock Disponible</span>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-black ${selectedProduct.critical ? 'text-rose-600' : 'text-[#1a1c1c]'}`}>{selectedProduct.stock}</span>
                          <span className={`text-[10px] font-bold uppercase ${selectedProduct.critical ? 'text-rose-600' : 'text-stone-400'}`}>Unidades</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Editar Información
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
