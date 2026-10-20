export type ProductCategory = 
  | 'frenos'
  | 'suspension'
  | 'motor'
  | 'transmision'
  | 'electrico'
  | 'iluminacion'
  | 'accesorios';

export type PartOrigin = 'OEM Original' | 'Aftermarket Certificado' | 'Performance Racing';

export interface VehicleCompatibility {
  make: string;      // e.g. Toyota, Chevrolet, Ford
  model: string;     // e.g. Hilux, Aveo, F-150
  years: number[];   // e.g. [2018, 2019, 2020, 2021, 2022]
  engine?: string;   // e.g. "2.8L Turbo Diesel"
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  brand: string;            // e.g. Brembo, Monroe, Bosch, Mann Filter
  origin: PartOrigin;
  price: number;
  costPrice: number;
  discountPercent?: number; // e.g. 15 for 15% off
  stock: number;
  minStockAlert: number;
  warrantyMonths: number;
  description: string;
  oemReference: string;
  specifications: Record<string, string>;
  compatibleVehicles: VehicleCompatibility[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  engine?: string;
}

export type OrderStatus = 
  | 'Pendiente'
  | 'Confirmado'
  | 'En Almacén'
  | 'En Ruta'
  | 'Entregado'
  | 'Cancelado';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  taxId: string; // RUT o DNI
  type: 'Particular' | 'Taller Mecánico' | 'Flotilla';
  garage: Vehicle[];
  ordersCount: number;
  totalSpent: number;
  registeredDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  deliveryMethod: 'Envío Express' | 'Retiro en Sucursal Central';
  paymentMethod: 'Tarjeta de Crédito' | 'Transferencia Bancaria' | 'Pago contra entrega';
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
}

export type CampaignChannel = 'Google Ads' | 'Meta Ads' | 'Email Marketing' | 'WhatsApp Business' | 'TikTok Ads';
export type CampaignStatus = 'Activa' | 'Pausada' | 'Finalizada' | 'Borrador';

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  objective: 'Conversiones / Ventas' | 'Tráfico a Catálogo' | 'Retargeting de Carrito' | 'Clientes de Taller';
  targetSegment: string;
  budget: number;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  promoCode?: string;
  adCopyHeadline: string;
  adCopyBody: string;
}

export interface PromoCoupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
  timesUsed: number;
}
