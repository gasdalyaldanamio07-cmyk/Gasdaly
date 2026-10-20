import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    appliedCoupon,
    currentCustomer,
    createOrder,
    setIsTrackingModalOpen,
    setSearchedTrackingNumber,
  } = useApp();

  // Form states
  const [name, setName] = useState(currentCustomer.name || '');
  const [email, setEmail] = useState(currentCustomer.email || '');
  const [phone, setPhone] = useState(currentCustomer.phone || '');
  const [address, setAddress] = useState(currentCustomer.address || '');
  const [city, setCity] = useState(currentCustomer.city || 'Santiago Centro');
  const [taxId, setTaxId] = useState(currentCustomer.taxId || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'Envío Express' | 'Retiro en Sucursal Central'>('Envío Express');
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito' | 'Transferencia Bancaria' | 'Pago contra entrega'>('Tarjeta de Crédito');
  const [notes, setNotes] = useState('');

  // Post-purchase confirmation state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutModalOpen) return null;

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPercent
      ? item.product.price * (1 - item.product.discountPercent / 100)
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingCost = deliveryMethod === 'Retiro en Sucursal Central' || discountedSubtotal >= 100 ? 0 : 8.50;
  const tax = discountedSubtotal * 0.19;
  const total = discountedSubtotal + shippingCost + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || (deliveryMethod === 'Envío Express' && !address)) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const orderItems = cart.map((item) => {
      const price = item.product.discountPercent
        ? item.product.price * (1 - item.product.discountPercent / 100)
        : item.product.price;
      return {
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        brand: item.product.brand,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      };
    });

    const created = createOrder({
      customerId: currentCustomer.id,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: deliveryMethod === 'Retiro en Sucursal Central' ? 'Retiro en Almacén Central AutoRepuestos Pro' : address,
      city,
      deliveryMethod,
      paymentMethod,
      items: orderItems,
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      shippingCost,
      tax,
      total,
      status: 'Confirmado',
      notes,
    });

    setCompletedOrder(created);
  };

  const handleTrackCreatedOrder = () => {
    if (completedOrder) {
      setSearchedTrackingNumber(completedOrder.orderNumber);
      setIsCheckoutModalOpen(false);
      setIsTrackingModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h2 className="text-base font-bold text-white">
              {completedOrder ? 'Confirmación de Pedido' : 'Finalizar Compra y Despacho'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setCompletedOrder(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View 1: If Order is Completed */}
        {completedOrder ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                ¡Pedido #{completedOrder.orderNumber} Confirmado!
              </h3>
              <p className="text-xs text-slate-500">
                Hemos enviado un correo de confirmación a <strong>{completedOrder.customerEmail}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Número de Pedido:</span>
                <span className="font-mono font-bold text-slate-900">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Código de Rastreo:</span>
                <span className="font-mono font-bold text-orange-600">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Método de Entrega:</span>
                <span className="font-medium text-slate-800">{completedOrder.deliveryMethod}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Destino:</span>
                <span className="font-medium text-slate-800">{completedOrder.shippingAddress}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-slate-900">
                <span>Monto Total Cancelado:</span>
                <span className="font-mono tabular-nums text-base">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
              <button
                onClick={handleTrackCreatedOrder}
                className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-md transition-colors shadow-sm"
              >
                Seguimiento en Vivo del Despacho
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Comprobante</span>
              </button>
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setCompletedOrder(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Customer Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-orange-600" />
                <span>1. Datos del Comprador</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">RUT o DNI *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 18.492.301-K"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Teléfono Móvil *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 8412 3901"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>2. Modalidad de Entrega</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setDeliveryMethod('Envío Express')}
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-colors ${
                    deliveryMethod === 'Envío Express'
                      ? 'border-orange-500 bg-orange-50/40 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Envío Express a Domicilio</span>
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Entrega en 24/48h asegurada con seguimiento en vivo.
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('Retiro en Sucursal Central')}
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-colors ${
                    deliveryMethod === 'Retiro en Sucursal Central'
                      ? 'border-orange-500 bg-orange-50/40 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Retiro en Sucursal Central</span>
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Gratis. Listo en 2 horas en Av. Central Automotriz 1040.
                  </span>
                </label>
              </div>

              {deliveryMethod === 'Envío Express' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Dirección de Despacho *</label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número, depto o bodega"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ciudad / Comuna *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-orange-500 text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>3. Método de Pago</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {(['Tarjeta de Crédito', 'Transferencia Bancaria', 'Pago contra entrega'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                      paymentMethod === m
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Instrucciones o notas adicionales (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="ej. Dejar en conserjería o facturar a nombre de Taller Mecánico..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-orange-500 text-slate-900"
              />
            </div>

            {/* Order total recap */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} piezas):</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento cupón {appliedCoupon.code}:</span>
                  <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costo de Despacho:</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? '$0.00 (Gratis)' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>IVA (19%):</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Final a Cancelar:</span>
                <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Confirmar y Generar Orden de Pedido</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
