import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  Truck, 
  Clock, 
  MapPin, 
  FileText, 
  Printer, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

const STATUS_STEPS: OrderStatus[] = [
  'Pendiente',
  'Confirmado',
  'En Almacén',
  'En Ruta',
  'Entregado',
];

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    searchedTrackingNumber,
    setSearchedTrackingNumber,
    getOrderByTracking,
    orders,
  } = useApp();

  const [inputCode, setInputCode] = useState(searchedTrackingNumber || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchedTrackingNumber) {
      setInputCode(searchedTrackingNumber);
      const found = getOrderByTracking(searchedTrackingNumber);
      setCurrentOrder(found || null);
      setHasSearched(true);
    } else if (orders.length > 0 && !currentOrder) {
      // Default to most recent order for convenient preview
      setCurrentOrder(orders[0]);
      setInputCode(orders[0].orderNumber);
      setHasSearched(true);
    }
  }, [searchedTrackingNumber, orders]);

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const found = getOrderByTracking(inputCode);
    setCurrentOrder(found || null);
    setHasSearched(true);
  };

  const getStepStatus = (step: OrderStatus, orderStatus: OrderStatus) => {
    const stepIdx = STATUS_STEPS.indexOf(step);
    const currentIdx = STATUS_STEPS.indexOf(orderStatus);

    if (orderStatus === 'Cancelado') return 'cancelled';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-base font-bold text-white">Seguimiento en Vivo de Pedidos</h2>
              <p className="text-xs text-slate-400">Verifica el estado del despacho y la ruta de entrega</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setSearchedTrackingNumber('');
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ingresa tu N° de orden (ej: ARP-8001) o código de guía..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono uppercase text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-colors"
            >
              Consultar
            </button>
          </form>

          {/* Quick select buttons from demo orders */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Consultar órdenes activas:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputCode(o.orderNumber);
                  setCurrentOrder(o);
                  setHasSearched(true);
                }}
                className={`px-2 py-0.5 rounded font-mono text-[11px] border transition-colors ${
                  currentOrder?.id === o.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {o.orderNumber} ({o.status})
              </button>
            ))}
          </div>

          {/* Search Result */}
          {hasSearched && !currentOrder && (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Pedido no encontrado</h4>
              <p className="text-xs text-slate-500 mt-1">
                Verifica el código ingresado o contacta a soporte técnico.
              </p>
            </div>
          )}

          {currentOrder && (
            <div className="space-y-6">
              {/* Order Meta Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{currentOrder.orderNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">
                      {new Date(currentOrder.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Cliente: <strong>{currentOrder.customerName}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-600">
                    Estado Actual:{' '}
                    <span className="font-bold text-orange-600 uppercase">
                      {currentOrder.status}
                    </span>
                  </div>
                  {currentOrder.trackingNumber && (
                    <div className="text-[11px] text-slate-500 font-mono">
                      Guía: {currentOrder.trackingNumber} ({currentOrder.carrier})
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Timeline Stepper */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Progreso del Despacho
                </h4>

                <div className="grid grid-cols-5 gap-1 relative text-center">
                  {STATUS_STEPS.map((step, idx) => {
                    const status = getStepStatus(step, currentOrder.status);
                    const isCompleted = status === 'completed';
                    const isActive = status === 'active';

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isActive
                              ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-medium mt-2 leading-tight ${
                            isActive
                              ? 'text-orange-600 font-bold'
                              : isCompleted
                              ? 'text-emerald-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Artículos del Pedido ({currentOrder.items.length})
                </h4>

                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="px-3.5 py-2">Repuesto</th>
                        <th className="px-3.5 py-2 text-center">Cant.</th>
                        <th className="px-3.5 py-2 text-right">Precio Unit.</th>
                        <th className="px-3.5 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentOrder.items.map((it, i) => (
                        <tr key={i}>
                          <td className="px-3.5 py-2.5">
                            <div className="font-semibold text-slate-900">{it.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {it.brand} · SKU: {it.sku}
                            </div>
                          </td>
                          <td className="px-3.5 py-2.5 text-center font-bold tabular-nums">
                            {it.quantity}
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono tabular-nums">
                            ${it.price.toFixed(2)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono font-bold tabular-nums">
                            ${it.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-between items-center text-xs">
                    <div className="text-slate-500">
                      Método: <strong>{currentOrder.deliveryMethod}</strong> | Pago:{' '}
                      <strong>{currentOrder.paymentMethod}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-600 mr-2">Total Pagado:</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                        ${currentOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery notes & address */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>
                    Destino: <strong>{currentOrder.shippingAddress}, {currentOrder.city}</strong>
                  </span>
                </div>
                {currentOrder.notes && (
                  <p className="text-slate-500 pl-5">
                    Observaciones: "{currentOrder.notes}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          {currentOrder ? (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir comprobante</span>
            </button>
          ) : <div />}

          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setSearchedTrackingNumber('');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
