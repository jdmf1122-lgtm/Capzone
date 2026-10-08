import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  Tag,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    calculateDiscountAmount,
    setCurrentPage,
    setIsAuthModalOpen,
    setAuthModalReason,
    showToast
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const discountAmount = calculateDiscountAmount(cartSubtotal);
  const freeShippingThreshold = 500;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingFee = cartSubtotal >= 500 || appliedDiscount?.code === 'FREESHIP' ? 0 : 35;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput.trim());
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleQuickApply = (code: string) => {
    applyDiscount(code);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-md mx-auto">
            You haven&apos;t added any headwear pieces to your rotation yet. Explore our iconic streetwear drops.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
        >
          <span>Explore Cap Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
            Order Review
          </div>
          <h1 className="text-3xl font-extrabold font-['Syne'] text-white">
            Shopping Bag ({cart.length} unique styles)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 font-mono transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="p-4 bg-[#111827] rounded-xl border border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-2 text-gray-300">
            <Truck className="w-4 h-4 text-blue-400" />
            {remainingForFreeShipping === 0 || appliedDiscount?.code === 'FREESHIP' ? (
              <span className="text-emerald-400 font-semibold">
                You unlocked FREE Local Delivery across Roxas, Oriental Mindoro!
              </span>
            ) : (
              <span>
                Add <strong className="text-white font-mono">₱{remainingForFreeShipping.toLocaleString()}</strong> more to get Free Delivery in Roxas
              </span>
            )}
          </span>
          <span className="font-mono text-gray-400">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${appliedDiscount?.code === 'FREESHIP' ? 100 : freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items Table + Order Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-[#111827] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-black/40 border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Color: <span className="text-gray-200">{item.selectedColor}</span> · Unit: ₱{item.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {/* Quantity */}
                <div className="flex items-center border border-white/10 rounded-lg bg-[#182232]">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-white tabular-nums block">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] text-gray-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1 font-mono mt-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Available vouchers quick-click pills */}
          <div className="p-4 bg-[#182232]/50 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
              Available Promos For You:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickApply('CAPZONE10')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono text-blue-300"
              >
                CAPZONE10 (10% Off)
              </button>
              <button
                onClick={() => handleQuickApply('CROWN20')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono text-amber-300"
              >
                CROWN20 (20% Off over ₱1,200)
              </button>
              <button
                onClick={() => handleQuickApply('FREESHIP')}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono text-emerald-300"
              >
                FREESHIP (Free Delivery)
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-5">
            <h2 className="text-base font-bold font-['Syne'] text-white">Order Summary</h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Voucher code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 font-mono uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-400 font-mono">{promoError}</p>}
              {appliedDiscount && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs">
                  <span className="text-emerald-300 font-mono flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {appliedDiscount.code}
                  </span>
                  <button
                    onClick={removeDiscount}
                    className="text-[11px] text-gray-400 hover:text-rose-400 underline font-mono"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-400 pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-white tabular-nums">₱{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher Discount</span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Roxas Local Delivery</span>
                <span className="font-mono text-gray-300">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : '₱35'}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                <span>Total Due</span>
                <span className="font-mono text-blue-400 tabular-nums">₱{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Kailangan munang mag-sign in o mag-register bago mag-checkout.', 'error');
                  setAuthModalReason('checkout');
                  setIsAuthModalOpen(true);
                  return;
                }
                setCurrentPage('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-blue-600/30"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Safe & Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
