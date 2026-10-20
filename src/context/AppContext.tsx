import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Vehicle, 
  Order, 
  OrderStatus, 
  Customer, 
  Campaign, 
  PromoCoupon 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_COUPONS 
} from '../data/mockData';

interface VehicleFilter {
  make: string;
  model: string;
  year: number | null;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & Role
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  adminTab: 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'customers';
  setAdminTab: (tab: 'dashboard' | 'inventory' | 'orders' | 'marketing' | 'customers') => void;

  // Products & Inventory
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;

  // Selected Vehicle / Compatibility Filter
  selectedVehicle: VehicleFilter | null;
  setSelectedVehicle: (v: VehicleFilter | null) => void;
  clearVehicleFilter: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: PromoCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Customers & Garage
  customers: Customer[];
  currentCustomer: Customer;
  setCurrentCustomer: (c: Customer) => void;
  addVehicleToGarage: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicleFromGarage: (vehicleId: string) => void;
  registerCustomer: (customerData: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'registeredDate' | 'garage'>) => Customer;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByTracking: (query: string) => Order | undefined;

  // Marketing
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'spend' | 'revenue' | 'impressions' | 'clicks' | 'conversions'>) => void;
  toggleCampaignStatus: (id: string) => void;
  coupons: PromoCoupon[];
  addCoupon: (coupon: PromoCoupon) => void;

  // Modals & Inspection
  inspectingProduct: Product | null;
  setInspectingProduct: (p: Product | null) => void;
  isGarageModalOpen: boolean;
  setIsGarageModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  searchedTrackingNumber: string;
  setSearchedTrackingNumber: (code: string) => void;

  // Notification Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent or initial states
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'inventory' | 'orders' | 'marketing' | 'customers'>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('arp_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      // Merge image URLs if cached products are missing them
      return parsed.map((p) => {
        const foundInitial = INITIAL_PRODUCTS.find((init) => init.id === p.id);
        return {
          ...p,
          imageUrl: p.imageUrl || foundInitial?.imageUrl,
        };
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('arp_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer>(() => {
    return customers[0] || INITIAL_CUSTOMERS[0];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('arp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('arp_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [coupons, setCoupons] = useState<PromoCoupon[]>(() => {
    const saved = localStorage.getItem('arp_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('arp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleFilter | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [searchedTrackingNumber, setSearchedTrackingNumber] = useState('');

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('arp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('arp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('arp_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('arp_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('arp_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('arp_cart', JSON.stringify(cart));
  }, [cart]);

  // Inventory actions
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Producto "${newProduct.name}" agregado al inventario.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Producto actualizado exitosamente.');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    addToast('Stock ajustado.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Producto eliminado del catálogo.', 'info');
  };

  const clearVehicleFilter = () => {
    setSelectedVehicle(null);
    addToast('Filtro de vehículo restablecido. Mostrando todo el catálogo.', 'info');
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      addToast(`Sin stock disponible de ${product.name}`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const targetQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: targetQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    addToast(`${product.name} agregado al carrito.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Producto retirado del carrito.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Cupón no válido o vencido.' };
    }

    const subtotal = cart.reduce((acc, item) => {
      const discountedPrice = item.product.discountPercent
        ? item.product.price * (1 - item.product.discountPercent / 100)
        : item.product.price;
      return acc + discountedPrice * item.quantity;
    }, 0);

    if (subtotal < found.minPurchase) {
      return {
        success: false,
        message: `Este cupón requiere una compra mínima de $${found.minPurchase.toFixed(2)}.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `¡Cupón ${found.code} aplicado! ${found.discountPercent}% de descuento.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Cupón removido.', 'info');
  };

  // Garage & Customers
  const addVehicleToGarage = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v-${Date.now().toString().slice(-4)}`,
    };

    const updatedGarage = [...currentCustomer.garage, newVehicle];
    const updatedCustomer = { ...currentCustomer, garage: updatedGarage };

    setCurrentCustomer(updatedCustomer);
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? updatedCustomer : c))
    );
    addToast(`Vehículo ${newVehicle.make} ${newVehicle.model} (${newVehicle.year}) añadido a Mi Garaje.`);
  };

  const removeVehicleFromGarage = (vehicleId: string) => {
    const updatedGarage = currentCustomer.garage.filter((v) => v.id !== vehicleId);
    const updatedCustomer = { ...currentCustomer, garage: updatedGarage };

    setCurrentCustomer(updatedCustomer);
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentCustomer.id ? updatedCustomer : c))
    );
    addToast('Vehículo retirado de tu garaje.', 'info');
  };

  const registerCustomer = (
    data: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'registeredDate' | 'garage'>
  ): Customer => {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now().toString().slice(-4)}`,
      garage: [],
      ordersCount: 0,
      totalSpent: 0,
      registeredDate: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setCurrentCustomer(newCustomer);
    addToast(`Cliente ${newCustomer.name} registrado con éxito.`);
    return newCustomer;
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const orderNum = `ARP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString(),
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-CL`,
      carrier: orderData.deliveryMethod === 'Envío Express' ? 'Chilexpress Express' : 'Retiro en Tienda',
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const itemOrdered = newOrder.items.find((i) => i.productId === p.id);
        if (itemOrdered) {
          return { ...p, stock: Math.max(0, p.stock - itemOrdered.quantity) };
        }
        return p;
      })
    );

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newOrder.customerId) {
          return {
            ...c,
            ordersCount: c.ordersCount + 1,
            totalSpent: c.totalSpent + newOrder.total,
          };
        }
        return c;
      })
    );

    // If coupon was used, increment counter
    if (newOrder.couponCode) {
      setCoupons((prev) =>
        prev.map((cp) =>
          cp.code === newOrder.couponCode ? { ...cp, timesUsed: cp.timesUsed + 1 } : cp
        )
      );
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addToast(`¡Pedido ${newOrder.orderNumber} creado exitosamente!`);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
              ...(carrier ? { carrier } : {}),
            }
          : o
      )
    );
    addToast(`Estado de pedido actualizado a: ${status}`);
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getOrderByTracking = (query: string) => {
    const clean = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.id.toUpperCase() === clean ||
        (o.trackingNumber && o.trackingNumber.toUpperCase() === clean)
    );
  };

  // Marketing
  const addCampaign = (
    campaignData: Omit<Campaign, 'id' | 'spend' | 'revenue' | 'impressions' | 'clicks' | 'conversions'>
  ) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now().toString().slice(-4)}`,
      spend: 0,
      revenue: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    addToast(`Campaña publicitaria "${newCamp.name}" creada.`);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Activa' ? 'Pausada' : 'Activa';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    addToast('Estado de campaña actualizado.');
  };

  const addCoupon = (coupon: PromoCoupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addToast(`Cupón ${coupon.code} creado exitosamente.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        products,
        addProduct,
        updateProduct,
        updateStock,
        deleteProduct,
        selectedVehicle,
        setSelectedVehicle,
        clearVehicleFilter,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        customers,
        currentCustomer,
        setCurrentCustomer,
        addVehicleToGarage,
        removeVehicleFromGarage,
        registerCustomer,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByTracking,
        campaigns,
        addCampaign,
        toggleCampaignStatus,
        coupons,
        addCoupon,
        inspectingProduct,
        setInspectingProduct,
        isGarageModalOpen,
        setIsGarageModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        searchedTrackingNumber,
        setSearchedTrackingNumber,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
