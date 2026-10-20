import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Megaphone, 
  Users, 
  Store, 
  Bell, 
  ArrowLeft,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { InventoryManager } from './InventoryManager';
import { OrderManager } from './OrderManager';
import { MarketingManager } from './MarketingManager';
import { CustomerManager } from './CustomerManager';

export const AdminPortal: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setCurrentView, 
    products, 
    orders, 
    campaigns 
  } = useApp();

  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente' || o.status === 'Confirmado').length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'Activa').length;

  interface NavItem {
    id: 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'customers';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Resumen', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario & Catálogo', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined },
    { id: 'orders', label: 'Gestión de Pedidos', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} activos` : undefined },
    { id: 'marketing', label: 'Marketing Digital & Pauta', icon: Megaphone, badge: `${activeCampaignsCount} activas` },
    { id: 'customers', label: 'Directorio de Clientes', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Sub-Header / Breadcrumb Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-orange-400">Panel Administrativo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-medium capitalize">
              {adminTab === 'dashboard'
                ? 'Dashboard Ejecutivo'
                : adminTab === 'inventory'
                ? 'Inventario de Repuestos'
                : adminTab === 'orders'
                ? 'Flujo de Pedidos'
                : adminTab === 'marketing'
                ? 'Marketing & Publicidad'
                : 'Clientes Registrados'}
            </span>
          </div>

          <button
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
          >
            <Store className="w-3.5 h-3.5 text-orange-400" />
            <span>Ver Tienda Virtual</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = adminTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic View rendering */}
        <main>
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'inventory' && <InventoryManager />}
          {adminTab === 'orders' && <OrderManager />}
          {adminTab === 'marketing' && <MarketingManager />}
          {adminTab === 'customers' && <CustomerManager />}
        </main>
      </div>
    </div>
  );
};
