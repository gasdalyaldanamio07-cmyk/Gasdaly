import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  Package, 
  DollarSign,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, PartOrigin } from '../../types';

export const InventoryManager: React.FC = () => {
  const { products, addProduct, updateStock, updateProduct, deleteProduct } = useApp();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Brembo');
  const [category, setCategory] = useState<ProductCategory>('frenos');
  const [origin, setOrigin] = useState<PartOrigin>('OEM Original');
  const [price, setPrice] = useState<number>(75);
  const [costPrice, setCostPrice] = useState<number>(45);
  const [stock, setStock] = useState<number>(20);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [oemReference, setOemReference] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleMake, setVehicleMake] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Hilux');
  const [vehicleYears, setVehicleYears] = useState('2018, 2019, 2020, 2021, 2022');

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'todas' && p.category !== filterCategory) return false;
    if (filterStockStatus === 'low' && p.stock > p.minStockAlert) return false;
    if (filterStockStatus === 'out' && p.stock > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.oemReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const parsedYears = vehicleYears
      .split(',')
      .map((y) => parseInt(y.trim()))
      .filter((y) => !isNaN(y));

    addProduct({
      name,
      sku: sku.toUpperCase(),
      brand,
      category,
      origin,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      minStockAlert: Number(minStockAlert),
      warrantyMonths: Number(warrantyMonths),
      description: description || `Componente automotriz de alta precisión garantizada para ${vehicleMake} ${vehicleModel}.`,
      oemReference: oemReference.toUpperCase() || `OEM-${Math.floor(10000 + Math.random() * 90000)}`,
      specifications: {
        'Tipo': origin,
        'Fabricante': brand,
        'Garantía': `${warrantyMonths} Meses`,
      },
      compatibleVehicles: [
        {
          make: vehicleMake,
          model: vehicleModel,
          years: parsedYears.length > 0 ? parsedYears : [2018, 2019, 2020, 2021, 2022],
        },
      ],
      rating: 5.0,
      reviewCount: 1,
      featured: false,
    });

    setIsModalOpen(false);
    // Reset form
    setName('');
    setSku('');
    setDescription('');
    setOemReference('');
  };

  return (
    <div className="space-y-6">
      {/* Header and action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Control de Inventario & Catálogo de Repuestos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total en catálogo: {products.length} productos · Repuestos bajo stock mínimo:{' '}
            <strong className="text-amber-600">
              {products.filter((p) => p.stock <= p.minStockAlert).length}
            </strong>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Repuesto</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por repuesto, SKU, marca o código OEM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="todas">Todas las categorías</option>
              <option value="frenos">Frenos & Discos</option>
              <option value="suspension">Suspensión & Dirección</option>
              <option value="motor">Motor & Filtros</option>
              <option value="transmision">Transmisión & Embragues</option>
              <option value="electrico">Eléctrico & Baterías</option>
              <option value="iluminacion">Iluminación</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={filterStockStatus}
              onChange={(e) => setFilterStockStatus(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Todo el stock</option>
              <option value="low">Solo stock crítico / bajo</option>
              <option value="out">Solo agotados (0 unidades)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU / OEM</th>
                <th className="py-3 px-4">Descripción del Repuesto</th>
                <th className="py-3 px-4">Categoría & Marca</th>
                <th className="py-3 px-4 text-right">Precio Venta</th>
                <th className="py-3 px-4 text-right">Costo / Margen</th>
                <th className="py-3 px-4 text-center">Stock Almacén</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const margin = p.price - p.costPrice;
                const marginPercent = p.costPrice > 0 ? (margin / p.costPrice) * 100 : 0;
                const isLow = p.stock <= p.minStockAlert;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    {/* SKU / OEM */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.oemReference}</div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        Compat: {p.compatibleVehicles.map((v) => `${v.make} ${v.model}`).join(', ')}
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.brand}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{p.category}</div>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${p.price.toFixed(2)}
                      {p.discountPercent ? (
                        <div className="text-[10px] text-orange-600 font-semibold">
                          -{p.discountPercent}% promo
                        </div>
                      ) : null}
                    </td>

                    {/* Cost / Margin */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      <div>${p.costPrice.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        +{marginPercent.toFixed(0)}% (${margin.toFixed(2)})
                      </div>
                    </td>

                    {/* Stock with quick buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => updateStock(p.id, p.stock - 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                          title="Restar 1 unidad"
                        >
                          -
                        </button>
                        <span
                          className={`font-mono font-bold text-sm tabular-nums min-w-[32px] text-center ${
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-slate-900'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateStock(p.id, p.stock + 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                          title="Sumar 1 unidad"
                        >
                          +
                        </button>
                      </div>
                      {isLow && (
                        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                          Alerta (mín {p.minStockAlert})
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => updateStock(p.id, p.stock + 10)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded"
                          title="Reposición rápida de 10 unidades"
                        >
                          +10 Reponer
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar repuesto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Auto Part */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">
                  Registrar Nuevo Repuesto Automotriz
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Nombre del Repuesto *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Discos de Freno Ventilados Delanteros 319mm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Código SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. BRM-P8304"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Código OEM de Referencia</label>
                  <input
                    type="text"
                    placeholder="ej. OEM-04465-0K160"
                    value={oemReference}
                    onChange={(e) => setOemReference(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Marca del Repuesto *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Brembo, Bosch, Monroe, Gates"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  >
                    <option value="frenos">Frenos & Discos</option>
                    <option value="suspension">Suspensión & Amortiguadores</option>
                    <option value="motor">Motor, Filtros & Aceites</option>
                    <option value="transmision">Transmisión & Embragues</option>
                    <option value="electrico">Eléctrico & Baterías</option>
                    <option value="iluminacion">Iluminación LED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipo / Origen</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  >
                    <option value="OEM Original">OEM Original</option>
                    <option value="Aftermarket Certificado">Aftermarket Certificado</option>
                    <option value="Performance Racing">Performance Racing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Garantía (Meses)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Precio de Costo ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Precio de Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Stock Inicial en Bodega</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Alerta de Stock Mínimo</label>
                  <input
                    type="number"
                    min={1}
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              {/* Compatibility section */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="font-bold text-slate-800">Compatibilidad Vehicular Principal</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Marca del Auto</label>
                    <input
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Modelo</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Años (separados por coma)</label>
                    <input
                      type="text"
                      value={vehicleYears}
                      onChange={(e) => setVehicleYears(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Descripción / Ficha resumida</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-md shadow-xs"
                >
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
