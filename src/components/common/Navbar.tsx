import React from 'react';
import { ShoppingCart, Car, Search, ShieldCheck, LayoutDashboard, Store } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    setIsCartOpen,
    selectedVehicle,
    setIsGarageModalOpen,
    setIsTrackingModalOpen,
    currentCustomer,
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
      {/* Top micro announcement bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-orange-400 font-semibold">Despacho Express Nacional</span>
            <span className="text-slate-600">|</span>
            <span>Garantía OEM Directa de Fábrica 12 a 36 Meses</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Atención Técnica: +56 9 8000 AUTO</span>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="text-slate-300 hover:text-orange-400 transition-colors"
            >
              Rastrear Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
              A
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                AutoRepuestos <span className="text-orange-500">PRO</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
                Catálogo & Repuestos
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setCurrentView('store');
              const el = document.getElementById('catalogo-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            Catálogo de Piezas
          </button>

          <button
            onClick={() => setIsGarageModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
          >
            <Car className="w-4 h-4 text-orange-400" />
            <span>Mi Garaje</span>
            {selectedVehicle ? (
              <span className="text-xs text-orange-300 ml-1">
                ({selectedVehicle.make} {selectedVehicle.model})
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Seguimiento de Pedidos</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('store');
              const el = document.getElementById('garantia-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compatibilidad Garantizada</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mode Switcher Button (Storefront <-> Admin) */}
          <button
            onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors border ${
              currentView === 'admin'
                ? 'bg-orange-600 hover:bg-orange-500 text-white border-orange-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Alternar entre la tienda para clientes y el panel administrativo"
          >
            {currentView === 'store' ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
                <span className="whitespace-nowrap">Panel Admin</span>
              </>
            ) : (
              <>
                <Store className="w-3.5 h-3.5 text-white" />
                <span className="whitespace-nowrap">Volver a Tienda</span>
              </>
            )}
          </button>

          {/* Cart Button */}
          {currentView === 'store' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              aria-label="Abrir Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-slate-100" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md tabular-nums">
                  {totalCartCount}
                </span>
              )}
            </button>
          )}

          {/* User profile identifier (quiet text) */}
          <div className="hidden lg:flex flex-col items-end text-xs pl-2 border-l border-slate-800">
            <span className="text-slate-200 font-semibold truncate max-w-[140px]">
              {currentCustomer.name}
            </span>
            <span className="text-slate-400 text-[10px]">{currentCustomer.type}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
