import React, { useState } from 'react';
import { Search, CheckCircle2, ChevronRight, RotateCcw, Wrench, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const COMMON_MAKES = [
  'Toyota',
  'Chevrolet',
  'Volkswagen',
  'Ford',
  'Nissan',
  'Hyundai',
  'Kia',
  'Honda',
  'Renault',
];

const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ['Hilux', 'Corolla', 'Yaris', 'Fortuner / SW4', 'Prado Land Cruiser', '4Runner', 'RAV4'],
  Chevrolet: ['Cruze', 'Aveo', 'Spark GT / Beat', 'Tracker / Trax', 'Sail', 'Optra', 'D-Max'],
  Volkswagen: ['Gol', 'Polo', 'Vento', 'Jetta', 'Golf', 'Amarok', 'Tiguan'],
  Ford: ['F-150 / Ranger', 'Focus', 'EcoSport', 'Explorer', 'Fiesta'],
  Nissan: ['Versa', 'Sentra', 'Kicks', 'Navara / Frontier', 'March', 'Tiida', 'X-Trail'],
  Hyundai: ['Tucson', 'Elantra', 'Accent', 'Santa Fe', 'Creta', 'i10 / i30'],
  Kia: ['Sportage', 'Rio', 'Cerato', 'Sorento', 'Picanto'],
  Honda: ['Civic', 'CR-V', 'HR-V', 'Fit / Jazz', 'City'],
  Renault: ['Duster', 'Sandero', 'Logan', 'Kwid', 'Clio'],
};

const YEARS = Array.from({ length: 17 }, (_, i) => 2026 - i);

const COVER_BANNER_IMAGE = '/src/assets/images/hero_cover_banner_1792515268164.jpg';

export const Hero: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, clearVehicleFilter, addToast } = useApp();

  const [make, setMake] = useState(selectedVehicle?.make || '');
  const [model, setModel] = useState(selectedVehicle?.model || '');
  const [year, setYear] = useState<number | ''>(selectedVehicle?.year || '');

  const availableModels = make ? MODELS_BY_MAKE[make] || [] : [];

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make) {
      addToast('Por favor selecciona al menos la marca de tu vehículo.', 'info');
      return;
    }

    setSelectedVehicle({
      make,
      model: model || '',
      year: year ? Number(year) : null,
    });

    addToast(`Catálogo filtrado para: ${make} ${model ? model : ''} ${year ? year : ''}`);

    const el = document.getElementById('catalogo-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Cinematic Cover Background with Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={COVER_BANNER_IMAGE}
          alt="AutoRepuestos Pro Taller Central y Catálogo de Precisión"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full text-xs font-semibold tracking-wider uppercase text-orange-400 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Portada Oficial & Distribución Mayorista</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Repuestos automotrices de precisión con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400">
                calce 100% garantizado
              </span>.
            </h1>

            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Catálogo técnico oficial para talleres mecánicos, flotas comerciales y conductores particulares. Discos cerámicos, amortiguadores de gas, lubricantes sintéticos y kits de distribución con verificación técnica inmediata.
            </p>

            {/* Visual Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 backdrop-blur-xs">
                <div className="text-orange-400 font-bold text-lg font-mono tabular-nums">12,000+</div>
                <div className="text-[11px] text-slate-400">Piezas OEM en stock</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 backdrop-blur-xs">
                <div className="text-emerald-400 font-bold text-lg font-mono tabular-nums">24 Horas</div>
                <div className="text-[11px] text-slate-400">Despacho garantizado</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 backdrop-blur-xs">
                <div className="text-blue-400 font-bold text-lg font-mono tabular-nums">12 - 36m</div>
                <div className="text-[11px] text-slate-400">Garantía de fábrica</div>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Compatibility Selector Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-6 shadow-2xl backdrop-blur-md relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-orange-600 text-white flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Buscador de Compatibilidad
                    </h2>
                    <p className="text-xs text-slate-400">Encuentra repuestos exactos para tu auto</p>
                  </div>
                </div>

                {selectedVehicle && (
                  <button
                    onClick={clearVehicleFilter}
                    className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
                    title="Quitar filtro"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleApplyFilter} className="space-y-4">
                {/* Select Make */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    1. Marca del Auto
                  </label>
                  <select
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value);
                      setModel('');
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="">Selecciona la marca...</option>
                    {COMMON_MAKES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Model */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    2. Modelo
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={!make}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 disabled:opacity-40 transition-colors"
                  >
                    <option value="">
                      {make ? 'Todos los modelos' : 'Primero elige la marca'}
                    </option>
                    {availableModels.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Year */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    3. Año de Fabricación
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
                    disabled={!make}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 disabled:opacity-40 transition-colors"
                  >
                    <option value="">Cualquier año</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span>Filtrar Repuestos Compatibles</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Status footer inside card */}
              {selectedVehicle && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-orange-300 flex items-center justify-between">
                  <span>
                    Filtro activo: <strong>{selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year || ''}</strong>
                  </span>
                  <span className="text-emerald-400 font-semibold">100% Calce</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
