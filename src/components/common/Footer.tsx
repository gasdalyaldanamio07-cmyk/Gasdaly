import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, MapPin, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setAdminTab, setIsTrackingModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* 4 Feature Value Props */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800 text-orange-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Despacho en 24/48 Horas</h4>
              <p className="text-xs text-slate-400 mt-0.5">Envíos asegurados a todo el país con seguimiento en tiempo real.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Garantía de Compatibilidad</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verificación por número de chasis o modelo de vehículo antes del despacho.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800 text-blue-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Cambios Sin Complicaciones</h4>
              <p className="text-xs text-slate-400 mt-0.5">30 días de garantía para cambio directo si no calza en tu vehículo.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-slate-800 text-orange-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Asesoría Técnica Mecánica</h4>
              <p className="text-xs text-slate-400 mt-0.5">Especialistas automotrices certificados listos para responder tus dudas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              AutoRepuestos <span className="text-orange-500">PRO</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Distribuidor oficial de componentes automotrices OEM y Aftermarket de alta exigencia para talleres mecánicos, flotas y particulares.
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Av. Central Automotriz 1040, Parque Industrial</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>+56 9 8000 AUTO (2886)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>contacto@autorepuestospro.com</span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Líneas de Repuestos
          </h5>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Pastillas y Discos Cerámicos</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Amortiguadores y Espirales</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Kits de Distribución y Bombas de Agua</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Lubricantes Sintéticos y Filtros</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Baterías de Alta Corriente (CCA)</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Iluminación LED Pro</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Servicio al Cliente
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setIsTrackingModalOpen(true)} className="hover:text-white transition-colors text-left">
                Seguimiento de Envío por Código
              </button>
            </li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Políticas de Devolución</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Convenios para Talleres Mecánicos</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Preguntas Frecuentes de Compatibilidad</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Descarga de Fichas Técnicas OEM</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
            Acceso Administrativo
          </h5>
          <p className="text-xs text-slate-400 mb-3">
            Control de inventario en tiempo real, gestión de órdenes de despacho y panel de marketing digital.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('inventory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left text-xs text-orange-400 hover:text-orange-300 font-medium py-1"
            >
              &rarr; Gestionar Inventario & Stock
            </button>
            <button
              onClick={() => {
                setCurrentView('admin');
                setAdminTab('marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left text-xs text-orange-400 hover:text-orange-300 font-medium py-1"
            >
              &rarr; Panel de Marketing y Campañas Publicitarias
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} AutoRepuestos Pro. Todos los derechos reservados.</p>
          <p className="mt-1 sm:mt-0">Marcas y logotipos son propiedad de sus respectivos fabricantes OEM.</p>
        </div>
      </div>
    </footer>
  );
};
