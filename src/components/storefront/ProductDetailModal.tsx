import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Truck, 
  RotateCcw, 
  Car,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const { inspectingProduct, setInspectingProduct, addToCart, setIsCartOpen } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!inspectingProduct) return null;

  const product = inspectingProduct;
  const finalPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setInspectingProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>SKU: {product.sku}</span>
              <span>·</span>
              <span>OEM: {product.oemReference}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{product.name}</h2>
          </div>
          <button
            onClick={() => setInspectingProduct(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Price & Purchase Bar with Product Image */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {product.imageUrl && (
              <div className="sm:col-span-4 h-44 rounded-lg overflow-hidden bg-slate-950 border border-slate-200 shadow-xs">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  decoding="async"
                  width="720"
                  height="540"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className={product.imageUrl ? 'sm:col-span-8 space-y-4' : 'sm:col-span-12 space-y-4'}>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {product.discountPercent ? (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Fabricante: <strong>{product.brand}</strong> · Calidad: <strong>{product.origin}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-300 rounded-md bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2.5 px-5 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Descripción Técnica del Componente</span>
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Ficha Técnica de Dimensiones & Materiales
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr
                      key={key}
                      className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-600 w-1/3 border-b border-slate-100">
                        {key}
                      </td>
                      <td className="px-4 py-2.5 text-slate-900 font-mono font-medium border-b border-slate-100">
                        {val}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-600 bg-slate-50">
                      Garantía Certificada
                    </td>
                    <td className="px-4 py-2.5 text-emerald-700 font-semibold bg-slate-50">
                      {product.warrantyMonths} Meses directa del fabricante
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Compatible Vehicles */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-orange-600" />
              <span>Vehículos Compatibles Verificados (Calce Directo)</span>
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-3.5 py-2">Marca</th>
                    <th className="px-3.5 py-2">Modelo</th>
                    <th className="px-3.5 py-2">Años Compatibles</th>
                    <th className="px-3.5 py-2">Motor / Versión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.compatibleVehicles.map((compat, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3.5 py-2 font-semibold text-slate-900">{compat.make}</td>
                      <td className="px-3.5 py-2 text-slate-700">{compat.model}</td>
                      <td className="px-3.5 py-2 font-mono text-slate-600">
                        {compat.years[0]} - {compat.years[compat.years.length - 1]}
                      </td>
                      <td className="px-3.5 py-2 text-slate-600">{compat.engine || 'Todas las motorizaciones'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guarantees Badges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
              <Truck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Despacho seguro nacional 24-48h</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Número de parte y chasis chequeado</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Devolución gratuita por incompatibilidad</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setInspectingProduct(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-md transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
