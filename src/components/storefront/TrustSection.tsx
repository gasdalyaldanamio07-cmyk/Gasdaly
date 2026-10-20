import React from 'react';
import { ShieldCheck, Wrench, Award, CheckCircle, Truck, FileCheck2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrustSection: React.FC = () => {
  const { setIsGarageModalOpen } = useApp();

  return (
    <section id="garantia-section" className="bg-slate-900 text-white py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Compromiso de Calidad AutoRepuestos Pro</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              ¿Por qué confiar tu vehículo o taller con nosotros?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Sabemos que comprar repuestos automotrices por internet suele generar dudas sobre si la pieza calzará o si la calidad soportará el uso diario. Por eso eliminamos la incertidumbre con verificación técnica previa.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Cruce de Códigos OEM Verificado</strong>
                  <span>Cada número de parte es cotejado con el manual de despiece original del fabricante.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Garantía Escrita de 12 a 36 Meses</strong>
                  <span>Reemplazo inmediato sin trámites engorrosos si el producto presenta fallas de material.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Atención Especializada para Talleres Mecánicos</strong>
                  <span>Descuentos comerciales por volumen, facturación con RUT y soporte técnico prioritario vía WhatsApp.</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsGarageModalOpen(true)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <Wrench className="w-4 h-4" />
                <span>Registrar Vehículo en Mi Garaje</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-2">
              <div className="w-9 h-9 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Certificación ECE R90</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas nuestras pastillas y discos cumplen con la rigurosa norma europea de frenado de emergencia.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-2">
              <div className="w-9 h-9 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Factura Inmediata</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generación automática de factura electrónica con RUT para deducir impuestos de taller o empresa.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-2">
              <div className="w-9 h-9 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Despacho Prioritario</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empaque reforzado de alta resistencia para amortiguadores y discos pesados, sin roturas en tránsito.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-2">
              <div className="w-9 h-9 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Devolución en 30 Días</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si te equivocaste de modelo de auto, te hacemos el cambio directo sin penalizaciones ni letras chicas.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
