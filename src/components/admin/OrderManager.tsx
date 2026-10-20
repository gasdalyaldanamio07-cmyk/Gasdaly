import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Printer, 
  User,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'todos' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Gestión y Despacho de Pedidos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de flujo operativo: de confirmación a preparación en bodega y entrega final.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Total pedidos:</span>
          <span className="font-bold text-slate-900 font-mono tabular-nums">{orders.length}</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por N° de orden (ARP-XXXX), cliente, email o guía..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="lg:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="En Almacén">En Almacén</option>
              <option value="En Ruta">En Ruta</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">N° Orden & Fecha</th>
                <th className="py-3 px-4">Cliente & Contacto</th>
                <th className="py-3 px-4">Modalidad</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Estado Operativo</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  {/* Order & Date */}
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">{ord.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(ord.date).toLocaleDateString()} {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{ord.customerName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{ord.customerEmail}</div>
                  </td>

                  {/* Delivery & Payment */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{ord.deliveryMethod}</div>
                    <div className="text-[10px] text-slate-400">{ord.paymentMethod}</div>
                  </td>

                  {/* Items */}
                  <td className="py-3 px-4 text-center font-bold tabular-nums">
                    {ord.items.reduce((acc, i) => acc + i.quantity, 0)} un.
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${ord.total.toFixed(2)}
                  </td>

                  {/* Status dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 border border-slate-300 rounded text-[11px] font-semibold bg-white text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmado">Confirmado</option>
                      <option value="En Almacén">En Almacén</option>
                      <option value="En Ruta">En Ruta</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3 text-orange-400" />
                      <span>Detalle</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs text-orange-400 font-mono">Orden de Despacho</span>
                <h3 className="text-base font-bold text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Customer summary */}
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 block mb-0.5">Cliente:</span>
                  <strong className="text-slate-900 text-sm block">{selectedOrder.customerName}</strong>
                  <span className="text-slate-500">{selectedOrder.customerEmail} · {selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Dirección de Entrega:</span>
                  <span className="text-slate-800 font-medium block">{selectedOrder.shippingAddress}</span>
                  <span className="text-slate-500">{selectedOrder.city}</span>
                </div>
              </div>

              {/* Status and Logistics */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 block mb-1">Estado:</span>
                  <span className="font-bold text-orange-600 text-xs uppercase">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Guía Despacho:</span>
                  <span className="font-mono text-slate-900 font-bold">{selectedOrder.trackingNumber || 'Por asignar'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Transportista:</span>
                  <span className="text-slate-800 font-medium">{selectedOrder.carrier || 'Logística Interna'}</span>
                </div>
              </div>

              {/* Items table */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Detalle de Repuestos Despachados
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Repuesto</th>
                        <th className="p-2.5 text-center">Cant.</th>
                        <th className="p-2.5 text-right">Precio</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900">{it.name}</span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {it.sku} · {it.brand}
                            </div>
                          </td>
                          <td className="p-2.5 text-center font-bold font-mono">{it.quantity}</td>
                          <td className="p-2.5 text-right font-mono">${it.price.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-bold">${it.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-slate-50 p-3 border-t border-slate-200 space-y-1 text-right">
                    <div>
                      <span className="text-slate-500 mr-2">Subtotal:</span>
                      <span className="font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="text-emerald-700">
                        <span className="mr-2">Descuento ({selectedOrder.couponCode}):</span>
                        <span className="font-mono">-${selectedOrder.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 mr-2">Envío:</span>
                      <span className="font-mono">${selectedOrder.shippingCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-2">IVA (19%):</span>
                      <span className="font-mono">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span className="mr-2">Total Orden:</span>
                      <span className="font-mono text-base">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900">
                  <strong>Instrucciones del cliente:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Hoja de Despacho</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
