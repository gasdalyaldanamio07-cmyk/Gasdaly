import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  Megaphone,
  CheckCircle,
  Truck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    campaigns, 
    setAdminTab, 
    updateStock, 
    updateOrderStatus 
  } = useApp();

  // Financial aggregates
  const totalSales = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((sum, o) => sum + o.total, 0);

  const averageTicket = orders.length > 0 ? totalSales / orders.length : 0;

  const totalUnitsSold = orders.reduce((sum, o) => {
    return sum + o.items.reduce((acc, i) => acc + i.quantity, 0);
  }, 0);

  const lowStockItems = products.filter((p) => p.stock <= p.minStockAlert);

  // Marketing aggregate metrics
  const totalMarketingSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalMarketingRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const globalROAS = totalMarketingSpend > 0 ? totalMarketingRevenue / totalMarketingSpend : 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Panel de Control Ejecutivo & Ventas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas de facturación, estado del inventario y rendimiento de marketing en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('inventory')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Gestionar Inventario</span>
          </button>
          <button
            onClick={() => setAdminTab('marketing')}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Campañas de Marketing</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ingresos Totales (Ventas)</span>
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Orders Count & Ticket */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pedidos & Ticket Promedio</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {orders.length}{' '}
              <span className="text-xs font-normal text-slate-500">
                (Ticket: ${averageTicket.toFixed(2)})
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {totalUnitsSold} piezas automotrices despachadas
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Alertas de Stock Crítico</span>
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
              {lowStockItems.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Repuestos cerca o por debajo del stock mínimo
            </div>
          </div>
        </div>

        {/* Global Marketing ROAS */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ROAS Campañas Digitales</span>
            <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {globalROAS.toFixed(2)}x
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Gasto: ${totalMarketingSpend.toFixed(0)} | Ingresos: ${totalMarketingRevenue.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders (Left) & Low Stock Attention (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Section */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Últimos Pedidos Recibidos
              </h3>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Ver todos los pedidos &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Orden</th>
                  <th className="py-2 px-3">Cliente</th>
                  <th className="py-2 px-3 text-right">Total</th>
                  <th className="py-2 px-3">Estado</th>
                  <th className="py-2 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800 truncate max-w-[150px]">
                        {o.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400">{o.deliveryMethod}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[11px] text-slate-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {o.status === 'Confirmado' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'En Almacén')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded"
                        >
                          A Empaque
                        </button>
                      )}
                      {o.status === 'En Almacén' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'En Ruta')}
                          className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-[10px] font-semibold rounded"
                        >
                          Despachar
                        </button>
                      )}
                      {o.status === 'En Ruta' && (
                        <button
                          onClick={() => updateOrderStatus(o.id, 'Entregado')}
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-semibold rounded"
                        >
                          Entregar
                        </button>
                      )}
                      {o.status === 'Entregado' && (
                        <span className="text-[11px] text-emerald-600 font-medium">✓ Completado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Replenishment Quick Table */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Stock Crítico en Almacén
              </h3>
            </div>
            <button
              onClick={() => setAdminTab('inventory')}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Inventario &rarr;
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Todos los repuestos tienen niveles de stock saludables.
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      SKU: {prod.sku} · Mínimo: {prod.minStockAlert} un.
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-rose-600 text-sm font-mono tabular-nums">
                      {prod.stock} un.
                    </span>
                    <button
                      onClick={() => updateStock(prod.id, prod.stock + 10)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold rounded transition-colors"
                      title="Agregar 10 unidades al stock disponible"
                    >
                      +10 Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick summary of digital marketing */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Campañas Publicitarias Activas:</span>
              <strong className="text-slate-900">{campaigns.filter((c) => c.status === 'Activa').length} de {campaigns.length}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
