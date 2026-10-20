import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  Tag, 
  ShoppingCart, 
  Check, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutModalOpen,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.discountPercent
      ? item.product.price * (1 - item.product.discountPercent / 100)
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;

  const discountedSubtotal = subtotal - discountAmount;
  const isFreeShipping = discountedSubtotal >= 100;
  const shippingCost = cart.length === 0 ? 0 : isFreeShipping ? 0 : 8.50;
  const tax = discountedSubtotal * 0.19; // 19% IVA standard
  const total = discountedSubtotal + shippingCost + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold text-white">
                Carrito de Compras ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                  Explora nuestro catálogo automotriz y agrega las piezas compatibles con tu vehículo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const effectivePrice = item.product.discountPercent
                    ? item.product.price * (1 - item.product.discountPercent / 100)
                    : item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 flex gap-3 items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-bold text-orange-600 uppercase">
                            {item.product.brand}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{item.product.sku}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                          {item.product.name}
                        </h4>
                        <div className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                          ${effectivePrice.toFixed(2)}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">c/u</span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-300 rounded bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-bold text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar del carrito"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal for this item */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          ${(effectivePrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with breakdown & checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              {/* Promo Coupon Bar */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Cupón <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-emerald-700 hover:text-emerald-900 underline ml-2"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código cupón (ej: PRO10, FRENO20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs uppercase text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        Aplicar
                      </button>
                    </form>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span className="font-mono tabular-nums font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    Envío Express Nacional{' '}
                    {isFreeShipping && <span className="text-emerald-600 font-semibold">(Gratis &gt;$100)</span>}
                  </span>
                  <span className="font-mono tabular-nums font-medium">
                    {shippingCost === 0 ? '$0.00' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>IVA Estimado (19%)</span>
                  <span className="font-mono tabular-nums font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total a Pagar</span>
                  <span className="font-mono tabular-nums text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceder al Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transacción segura y garantía de satisfacción</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
