import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Plus, 
  Trash2, 
  Check, 
  User, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerGarageModal: React.FC = () => {
  const {
    isGarageModalOpen,
    setIsGarageModalOpen,
    currentCustomer,
    setCurrentCustomer,
    customers,
    addVehicleToGarage,
    removeVehicleFromGarage,
    selectedVehicle,
    setSelectedVehicle,
    clearVehicleFilter,
  } = useApp();

  const [isAddingCar, setIsAddingCar] = useState(false);
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [engine, setEngine] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  if (!isGarageModalOpen) return null;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model) return;

    addVehicleToGarage({
      make,
      model,
      year: Number(year),
      engine: engine || 'Motor estándar',
      licensePlate: licensePlate.toUpperCase(),
    });

    // Auto-select this vehicle
    setSelectedVehicle({
      make,
      model,
      year: Number(year),
    });

    setIsAddingCar(false);
    setModel('');
    setEngine('');
    setLicensePlate('');
  };

  const handleSelectCarForStore = (car: { make: string; model: string; year: number }) => {
    setSelectedVehicle({
      make: car.make,
      model: car.model,
      year: car.year,
    });
    setIsGarageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Car className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-base font-bold text-white">Mi Garaje Virtual</h2>
              <p className="text-xs text-slate-400">Guarda tus vehículos para filtrar repuestos compatibles al 100%</p>
            </div>
          </div>
          <button
            onClick={() => setIsGarageModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Switcher Quick Bar */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Perfil: <strong>{currentCustomer.name}</strong> ({currentCustomer.type})</span>
          </div>

          <select
            value={currentCustomer.id}
            onChange={(e) => {
              const found = customers.find((c) => c.id === e.target.value);
              if (found) setCurrentCustomer(found);
            }}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                Cambiar a: {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Active vehicle filter banner */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Filtro activo en la tienda:</span>{' '}
              {selectedVehicle ? (
                <strong className="text-slate-900 font-bold">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                </strong>
              ) : (
                <span className="text-slate-500 italic">Ninguno (mostrando todo el catálogo)</span>
              )}
            </div>

            {selectedVehicle && (
              <button
                onClick={clearVehicleFilter}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            )}
          </div>

          {/* List of Cars in Garage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Vehículos en tu Garaje ({currentCustomer.garage.length})
              </h3>
              {!isAddingCar && (
                <button
                  onClick={() => setIsAddingCar(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Vehículo</span>
                </button>
              )}
            </div>

            {currentCustomer.garage.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
                No tienes vehículos guardados en tu perfil. Añade el primero para no equivocarte de repuesto.
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentCustomer.garage.map((veh) => {
                  const isCurrentlyActive =
                    selectedVehicle?.make === veh.make &&
                    selectedVehicle?.model === veh.model &&
                    selectedVehicle?.year === veh.year;

                  return (
                    <div
                      key={veh.id}
                      className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                        isCurrentlyActive
                          ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {veh.make} {veh.model}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 font-mono">
                            {veh.year}
                          </span>
                          {veh.licensePlate && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {veh.licensePlate}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{veh.engine}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrentlyActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                            <Check className="w-3.5 h-3.5" />
                            <span>Activo</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectCarForStore(veh)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
                          >
                            Filtrar Tienda
                          </button>
                        )}

                        <button
                          onClick={() => removeVehicleFromGarage(veh.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                          title="Eliminar de mi garaje"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Car Form */}
          {isAddingCar && (
            <form onSubmit={handleAddVehicle} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Registrar Nuevo Vehículo
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Toyota, Chevrolet, Ford"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Hilux, Cruze, Golf"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Año *</label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2026}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Motor / Cilindrada</label>
                  <input
                    type="text"
                    placeholder="ej. 2.8L Turbo Diesel"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Patente / Placa (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. LL-KJ-88"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCar(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded transition-colors"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Garantía Anti-Error:</strong> Si compras un repuesto teniendo un vehículo activo y este no calza físicamente, te enviamos la pieza correcta sin ningún costo de envío.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsGarageModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
