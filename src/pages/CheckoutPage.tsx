import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod } from '../types';
import {
  ShieldCheck,
  Wallet,
  Truck,
  Check,
  ArrowLeft,
  Smartphone,
  Banknote,
  Lock,
  LogIn,
  Shield,
  QrCode,
  Download,
  Copy,
  X,
  Maximize2
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

  // GCash state
  const [ewalletPhone, setEwalletPhone] = useState('0917 555 4321');
  const [gcashReference, setGcashReference] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(totalAmount.toString());
    setCopiedAmount(true);
    showToast(`Amount ₱${totalAmount.toLocaleString()} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedAmount(false), 2000);
  };

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

    const gcashInfoNote =
      paymentMethod === 'gcash'
        ? `[GCASH PAYMENT - Sender: ${ewalletPhone || 'N/A'}${gcashReference.trim() ? ` | Ref No: ${gcashReference.trim()}` : ''}] `
        : '';

    setTimeout(() => {
      createOrder({
        customerName,
        customerEmail,
        contactNumber,
        shippingAddress: finalAddress,
        city: 'Roxas, Oriental Mindoro',
        postalCode: '5212',
        paymentMethod,
        notes: `${deliveryType === 'pickup' ? '[STUDIO PICKUP] ' : `[ROXAS LOCAL RIDER - Brgy. ${selectedBarangay}] `}${gcashInfoNote}${notes}`,
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
              <Wallet className="w-4 h-4 text-blue-400" /> 2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {paymentMethod === 'gcash' && (
              <div className="p-5 bg-[#182232] rounded-xl border border-blue-500/20 space-y-4">
                {/* QR Header & Merchant Account Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <QrCode className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Scan QR Code to Pay
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Official CapZone GCash · InstaPay / QR Ph
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Account: Von Jovy
                  </span>
                </div>

                {/* QR Display Card */}
                <div className="flex flex-col items-center justify-center p-4 bg-[#0B0F17] rounded-xl border border-white/10 space-y-3">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setIsQrModalOpen(true)}
                    title="Click to view full size"
                  >
                    <img
                      src="/assets/images/gcash-qr.jpg"
                      alt="CapZone GCash QR Code - Von Jovy"
                      className="w-56 sm:w-64 max-w-full rounded-xl shadow-2xl border border-white/10 transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-xs font-mono font-medium backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4" />
                      <span>Click to Enlarge</span>
                    </div>
                  </div>

                  {/* Actions: Download QR & Copy Amount */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs">
                    <a
                      href="/assets/images/gcash-qr.jpg"
                      download="CapZone-GCash-QR.jpg"
                      className="flex-1 min-w-[130px] px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Save QR Image</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="flex-1 min-w-[130px] px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border border-blue-500/30"
                    >
                      {copiedAmount ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-400" />
                          <span>Copy ₱{totalAmount.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center font-mono pt-1">
                    Exact Amount to Send: <span className="text-white font-bold text-xs">₱{totalAmount.toLocaleString()} PHP</span>
                  </p>
                </div>

                {/* Instructions */}
                <div className="p-3 bg-[#0e1624] rounded-lg border border-white/5 space-y-1.5 text-[11px] text-gray-300">
                  <p className="font-semibold text-white flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> How to Pay via GCash:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-400 pl-1 leading-relaxed">
                    <li>Open your <strong className="text-white">GCash App</strong> and tap <strong className="text-white">QR / Scan</strong>. (If using your phone, tap <em>Save QR Image</em> above, then in GCash select <em>Upload QR</em> from gallery).</li>
                    <li>Send exactly <strong className="text-blue-400 font-mono">₱{totalAmount.toLocaleString()} PHP</strong> to <strong className="text-white">Von Jovy</strong>.</li>
                    <li>Enter your GCash mobile number and Reference Number below to complete your order.</li>
                  </ol>
                </div>

                {/* Sender Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      Your GCash Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={ewalletPhone}
                      onChange={(e) => setEwalletPhone(e.target.value)}
                      placeholder="09XX XXX XXXX"
                      className="w-full px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-gray-400 block mb-1">
                      GCash Reference No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={gcashReference}
                      onChange={(e) => setGcashReference(e.target.value)}
                      placeholder="e.g. 1002 9842 1530 1"
                      className="w-full px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 font-mono">
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

      {/* GCash QR Enlarge Modal */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="relative bg-[#111827] border border-white/20 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                GCash QR · Von Jovy
              </span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close QR Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center p-2 bg-[#0B0F17] rounded-xl border border-white/10">
              <img
                src="/assets/images/gcash-qr.jpg"
                alt="CapZone GCash QR Full View"
                className="max-h-[70vh] w-auto rounded-lg object-contain shadow-lg"
              />
            </div>

            <div className="flex gap-2">
              <a
                href="/assets/images/gcash-qr.jpg"
                download="CapZone-GCash-QR.jpg"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save to Phone</span>
              </a>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-gray-300 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
