import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    calculateDiscountAmount,
    setCurrentPage,
    setIsAuthModalOpen,
    setAuthModalReason,
    showToast
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const discountAmount = calculateDiscountAmount(cartSubtotal);
  const freeShippingThreshold = 500;
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const localShippingFee = cartSubtotal >= 500 || appliedDiscount?.code === 'FREESHIP' ? 0 : 35;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyDiscount(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleGoToCheckout = () => {
    if (!currentUser) {
      showToast('Kailangan munang mag-sign in o mag-register bago mag-checkout.', 'error');
      setAuthModalReason('checkout');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToFullCart = () => {
    setIsCartOpen(false);
    setCurrentPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#111827] border-l border-white/10 flex flex-col h-full shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0B0F17]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-['Syne'] text-white">Your Shopping Bag</h2>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-[#182232] border-b border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Truck className="w-4 h-4 text-blue-400" />
              {remainingForFreeShipping === 0 || appliedDiscount?.code === 'FREESHIP' ? (
                <span className="text-emerald-400 font-semibold">You unlocked FREE Local Delivery in Roxas, Oriental Mindoro!</span>
              ) : (
                <span>
                  Add <strong className="text-white font-mono">₱{remainingForFreeShipping.toLocaleString()}</strong> more for FREE Delivery in Roxas
                </span>
              )}
            </span>
            <span className="font-mono text-gray-400">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${appliedDiscount?.code === 'FREESHIP' ? 100 : freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                <Tag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Discover our iconic streetwear drops, snapbacks, and limited crown headwear.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentPage('shop');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-[#182232]/60 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-black/40 shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-rose-400 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      Color: <span className="text-gray-300">{item.selectedColor}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center border border-white/10 rounded-lg bg-[#0B0F17]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-white text-gray-400 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono tabular-nums text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-white text-gray-400 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold font-mono text-white tabular-nums">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0B0F17] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. CAPZONE10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}

            {appliedDiscount && (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs">
                <span className="text-emerald-300 font-mono flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> {appliedDiscount.code} ({appliedDiscount.description})
                </span>
                <button
                  onClick={removeDiscount}
                  className="text-gray-400 hover:text-rose-400 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">₱{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Roxas Local Delivery</span>
                <span className="font-mono text-gray-300">
                  {localShippingFee === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    '₱35'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="font-mono text-blue-400 tabular-nums">
                  ₱{(cartSubtotal - discountAmount + localShippingFee).toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGoToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleGoToFullCart}
                className="w-full py-2 bg-transparent hover:bg-white/5 text-gray-300 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors"
              >
                View Full Bag & Calculator
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Encrypted Checkout · Cash on Delivery & E-Wallets Supported</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
