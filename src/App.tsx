import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { Hero } from './components/storefront/Hero';
import { ProductCatalog } from './components/storefront/ProductCatalog';
import { TrustSection } from './components/storefront/TrustSection';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { CustomerGarageModal } from './components/storefront/CustomerGarageModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { AdminPortal } from './components/admin/AdminPortal';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main View: Storefront vs Admin */}
      <div className="flex-1">
        {currentView === 'store' ? (
          <main>
            <Hero />
            <ProductCatalog />
            <TrustSection />
          </main>
        ) : (
          <AdminPortal />
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Storefront Overlays & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <CustomerGarageModal />
      <OrderTrackingModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
