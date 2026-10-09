import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ArrowLeft,
  Smartphone,
  Banknote,
  Lock,
  LogIn,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

import { ROXAS_BARANGAYS } from '../data/roxasBarangays';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedDiscount,
    calculateDiscountAmount,
    createOrder,
    setCurrentPage,
    setIsAuthModalOpen,
    setAuthModalReason,
    showToast
  } = useShop();

  const { currentUser, switchRole } = useAuth();

  // Form Fields initialized from logged in user if available
  const [customerName, setCustomerName] = useState(currentUser?.fullname || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.contactNumber || '');
  const [streetAddress, setStreetAddress] = useState('Rizal Street');
  const [selectedBarangay, setSelectedBarangay] = useState<string>(ROXAS_BARANGAYS[0]);
  const [deliveryType, setDeliveryType] = useState<'rider' | 'pickup'>('rider');
  const [city] = useState('Roxas, Oriental Mindoro');
  const [postalCode] = useState('5212');
  const [notes, setNotes] = useState('Please call mobile upon arrival near town plaza, Roxas.');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('389');
  const [showCvc, setShowCvc] = useState(false);

  // GCash state
  const [ewalletPhone, setEwalletPhone] = useState('0917 555 4321');

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  const discountAmount = calculateDiscountAmount(cartSubtotal);
  const shippingFee = deliveryType === 'pickup' ? 0 : (cartSubtotal >= 500 || appliedDiscount?.code === 'FREESHIP' ? 0 : 35);
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Authentication Required · Sign In First
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
            Please Sign In to Complete Your Order
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            To process your order for Roxas Local Delivery or Poblacion Studio Pickup, please sign in with your account or create a new one.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-sm mx-auto">
          <button
            onClick={() => {
              setAuthModalReason('order');
              setIsAuthModalOpen(true);
            }}
            className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
          <button
            onClick={() => setCurrentPage('shop')}
            className="py-3 px-5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors border border-white/10"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Admin Point of View check: Admins cannot purchase their own products
  if (currentUser?.role === 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Admin Point of View · Store Owner
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
            Administrators Cannot Purchase Store Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            You are logged in as a store administrator. Administrators cannot purchase their own inventory or submit checkout orders. To test the customer checkout flow, please switch to a customer account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
          <button
            onClick={() => {
              setCurrentPage('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Go to Admin Dashboard</span>
          </button>
          <button
            onClick={() => {
              switchRole('user');
              showToast('Switched to customer account. You can now test customer checkout.', 'info');
            }}
            className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium uppercase tracking-wider transition-colors border border-white/10"
          >
            Switch to Customer View
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Syne'] text-white">Your bag is empty</h2>
        <p className="text-xs text-gray-400">Add caps to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'admin') {
      showToast('Admin restriction: Store administrators cannot place orders.', 'error');
      return;
    }
    setSubmitting(true);

    const finalAddress =
      deliveryType === 'pickup'
        ? 'In-Store Pickup: CapZone Studio (Rizal St., Barangay Paclasan, Roxas, Oriental Mindoro)'
        : `${streetAddress}, Barangay ${selectedBarangay}, Roxas, Oriental Mindoro`;

    setTimeout(() => {
      createOrder({
        customerName,
        customerEmail,
        contactNumber,
        shippingAddress: finalAddress,
        city: 'Roxas, Oriental Mindoro',
        postalCode: '5212',
        paymentMethod,
        notes: `${deliveryType === 'pickup' ? '[STUDIO PICKUP] ' : `[ROXAS LOCAL RIDER - Brgy. ${selectedBarangay}] `}${notes}`,
        userId: currentUser?.id
      });
      setSubmitting(false);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('cart')}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bag Review
      </button>

      <div className="pb-4 border-b border-white/10">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Exclusively Serving Roxas, Oriental Mindoro
        </div>
        <h1 className="text-3xl font-extrabold font-['Syne'] text-white">
          Complete Your Order
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Fast delivery across all barangays of Roxas, Oriental Mindoro or free pick-up at our Poblacion studio.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Payment (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer & Delivery Mode */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-5">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> 1. Delivery within Roxas, Oriental Mindoro
            </h2>

            {/* Delivery Method Selector (Roxas Rider vs Poblacion Studio Pickup) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryType('rider')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryType === 'rider'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-[#182232] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-white">Roxas Local Rider Delivery</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Door-to-door in Roxas (₱35 · FREE over ₱500)
                    </p>
                  </div>
                  {deliveryType === 'rider' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
              </div>

              <div
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-[#182232] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-white">Pick-Up at Paclasan Studio</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Rizal St., Brgy. Paclasan · Ready in 1 Hour · FREE
                    </p>
                  </div>
                  {deliveryType === 'pickup' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Full Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Mobile Contact Number *</label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Email for Receipt & Updates *</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {deliveryType === 'rider' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">
                      Roxas Barangay *
                    </label>
                    <select
                      value={selectedBarangay}
                      onChange={(e) => setSelectedBarangay(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    >
                      {ROXAS_BARANGAYS.map((brgy) => (
                        <option key={brgy} value={brgy}>
                          Barangay {brgy}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">
                      Street / Purok / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rizal St., near Municipal Hall"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">Municipality & Province</label>
                    <input
                      type="text"
                      disabled
                      value={city}
                      className="w-full px-3 py-2.5 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-gray-400 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-400 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      disabled
                      value={postalCode}
                      className="w-full px-3 py-2.5 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-gray-400 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 space-y-1">
                <p className="font-semibold text-white">Pickup Location:</p>
                <p>CapZone Flagship Studio & Headwear Lab</p>
                <p className="text-gray-400 font-mono">Rizal Street, Barangay Paclasan, Roxas, Oriental Mindoro 5212 (Near Town Plaza)</p>
                <p className="text-[11px] text-emerald-400 pt-1">No delivery fee applies for in-store pickup!</p>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Rider Delivery Notes / Instructions (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Landmarks, house color, or person to receive..."
                className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2. Payment Method Selection */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-5">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-400" /> 2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* GCash */}
              <div
                onClick={() => setPaymentMethod('gcash')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'gcash'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-[#182232] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-bold text-xs text-white">GCash</p>
                      <p className="text-[10px] text-gray-400 font-mono">Scan QR or Direct Pay</p>
                    </div>
                  </div>
                  {paymentMethod === 'gcash' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-[#182232] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="font-bold text-xs text-white">Credit / Debit Card</p>
                      <p className="text-[10px] text-gray-400 font-mono">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-white/10 bg-[#182232] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-bold text-xs text-white">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-400 font-mono">Pay rider when handed</p>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              </div>
            </div>

            {/* Payment Sub-Form Details */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#182232] rounded-xl border border-white/5 space-y-3">
                <span className="text-[11px] font-mono text-gray-400 block uppercase">
                  Card Information
                </span>
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">CVC Code</label>
                    <div className="relative">
                      <input
                        type={showCvc ? 'text' : 'password'}
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvc((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-white transition-colors focus:outline-none"
                        aria-label={showCvc ? 'Hide CVC' : 'Show CVC'}
                        title={showCvc ? 'Hide CVC' : 'Show CVC'}
                      >
                        {showCvc ? (
                          <EyeOff className="w-3.5 h-3.5 text-gray-300" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'gcash' && (
              <div className="p-4 bg-[#182232] rounded-xl border border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-gray-400 block uppercase">
                  GCash Account Number
                </span>
                <input
                  type="tel"
                  value={ewalletPhone}
                  onChange={(e) => setEwalletPhone(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="w-full px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono"
                />
                <p className="text-[10px] text-gray-400">
                  Instant secure payment verification token will be generated on order submission.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 leading-relaxed">
                Please prepare exact cash amount of <strong>₱{totalAmount.toLocaleString()} PHP</strong> for the courier rider upon delivery.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-['Syne'] text-white">Order Review</h2>
              <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                Currency: PHP (₱)
              </span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain p-0.5 rounded-lg bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {item.selectedColor} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-white tabular-nums shrink-0">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-gray-400 pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">₱{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Applied Promo ({appliedDiscount?.code})</span>
                  <span className="font-mono tabular-nums">-₱{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono text-gray-300">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₱${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                <span>Total Amount Due</span>
                <span className="font-mono text-blue-400 tabular-nums">₱{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Generating Secure Order & Receipt...</span>
              ) : (
                <span>Confirm & Place Order · ₱{totalAmount.toLocaleString()}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>30-Day Money-Back & Genuine Cap Guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
