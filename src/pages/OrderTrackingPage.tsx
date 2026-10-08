import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, getOrderByTracking } = useShop();

  const [inputVal, setInputVal] = useState('CZ-849201PH');
  const [searchedOrder, setSearchedOrder] = useState(() => getOrderByTracking('CZ-849201PH') || orders[0]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const found = getOrderByTracking(inputVal.trim());
    if (found) {
      setSearchedOrder(found);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const handleQuickTrack = (num: string) => {
    setInputVal(num);
    const found = getOrderByTracking(num);
    if (found) {
      setSearchedOrder(found);
      setNotFound(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
          <Truck className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400">
          CapZone Express Logistics
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Syne'] text-white">
          Real-Time Order Tracking
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
          Monitor your headwear package from crown inspection at our Roxas, Oriental Mindoro fulfillment hub to delivery rider dispatch.
        </p>
      </div>

      {/* Tracking Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter Tracking Number (e.g. CZ-849201PH) or Order ID (ORD-98421)"
            className="w-full pl-12 pr-28 py-3.5 bg-[#111827] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
          >
            Track
          </button>
        </div>

        {/* Demo Fast Click suggestions */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 pt-1 justify-center flex-wrap">
          <span>Try quick demo codes:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => handleQuickTrack(o.trackingNumber)}
              className="text-blue-400 hover:underline hover:text-blue-300 font-mono"
            >
              {o.trackingNumber}
            </button>
          ))}
        </div>
      </form>

      {/* Error State */}
      {notFound && (
        <div className="p-6 bg-rose-950/20 border border-rose-500/30 rounded-xl text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
          <h3 className="text-sm font-semibold text-rose-200">No Shipment Found</h3>
          <p className="text-xs text-rose-300/80">
            We couldn&apos;t find an active shipment matching &quot;{inputVal}&quot;. Please verify your tracking number from your receipt email or invoice.
          </p>
        </div>
      )}

      {/* Order Tracking Timeline & Details */}
      {searchedOrder && !notFound && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Status Card Header */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Status</span>
              <span className="text-lg font-bold uppercase text-white font-mono flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                {searchedOrder.orderStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Carrier</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">
                {searchedOrder.carrier}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Estimated Arrival</span>
              <span className="text-sm font-semibold text-emerald-400 mt-0.5 block font-mono">
                {searchedOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Timeline Visual Steps */}
          <div className="p-6 sm:p-8 bg-[#111827] rounded-xl border border-white/10 space-y-6">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
              Shipment Progress Journey
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {searchedOrder.trackingHistory.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-colors ${
                      step.completed
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-[#182232] border-white/20 text-gray-500'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`text-sm font-bold ${
                          step.completed ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {step.status}
                      </h4>
                      <span className="text-[11px] font-mono text-gray-500">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      {step.location}
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed pt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Contents Breakdown */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" /> Items in this Parcel ({searchedOrder.items.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-[#182232] rounded-lg border border-white/5"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-contain p-0.5 rounded-md bg-black/40 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{item.productName}</p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Color: {item.color} · Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-blue-400 font-bold font-mono">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Tamper-evident CapZone box seal verified
              </span>
              <span>Delivering to: {searchedOrder.city}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
