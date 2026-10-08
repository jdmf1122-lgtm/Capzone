import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderConfirmationId, orders, setCurrentPage } = useShop();

  const order = orders.find((o) => o.id === orderConfirmationId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Syne'] text-white">No Order Found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleTrackOrder = () => {
    setCurrentPage('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
          Order Payment & Verification Approved
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Syne'] text-white">
          Thank You For Topping Off Your Style!
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
          We&apos;ve sent your order confirmation receipt to <strong className="text-white font-mono">{order.customerEmail}</strong>.
        </p>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleTrackOrder}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Shipment</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[#182232] hover:bg-white/10 text-gray-200 text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/10 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Receipt</span>
          </button>
        </div>
      </div>

      {/* Official CapZone Receipt / Packing Slip Card */}
      <div className="p-8 sm:p-10 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10 print:border-black/20">
          <div>
            <span className="text-2xl font-extrabold font-['Syne'] text-white print:text-black">
              CapZone<span className="text-blue-500">.</span>
            </span>
            <p className="text-xs text-gray-400 print:text-gray-600 font-mono mt-0.5">
              Official Headwear Invoice & Packing Slip
            </p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs">
            <p className="text-white print:text-black font-bold">Order ID: {order.id}</p>
            <p className="text-gray-400 print:text-gray-600">Tracking: {order.trackingNumber}</p>
            <p className="text-gray-400 print:text-gray-600">Date: {order.createdAt}</p>
            <p className="text-emerald-400 print:text-gray-700 font-semibold">Currency: Philippine Peso (PHP · ₱)</p>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-gray-500 print:text-gray-600 uppercase text-[10px] block">
              Ship To Customer
            </span>
            <p className="font-bold text-white print:text-black text-sm">{order.customerName}</p>
            <p className="text-gray-300 print:text-gray-700">{order.shippingAddress}</p>
            <p className="text-gray-300 print:text-gray-700">{order.city}, {order.postalCode}</p>
            <p className="text-gray-400 print:text-gray-600 font-mono">Contact: {order.contactNumber}</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-gray-500 print:text-gray-600 uppercase text-[10px] block">
              Logistics & Payment Method
            </span>
            <p className="font-bold text-white print:text-black text-sm">
              Carrier: {order.carrier}
            </p>
            <p className="text-gray-300 print:text-gray-700">
              Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
            </p>
            <p className="text-gray-300 print:text-gray-700">
              Payment: <strong className="uppercase">{order.paymentMethod}</strong> (Status: {order.paymentStatus.toUpperCase()})
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 print:border-black/20 text-gray-400 print:text-gray-600 font-mono uppercase text-[10px]">
                <th className="py-3">Cap Description</th>
                <th className="py-3">Colorway</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-black/10">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded bg-black/40 print:hidden"
                    />
                    <span className="font-semibold text-white print:text-black">{item.productName}</span>
                  </td>
                  <td className="py-3.5 text-gray-300 print:text-gray-700 font-mono">{item.color}</td>
                  <td className="py-3.5 text-center text-white print:text-black font-mono tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-right font-mono text-gray-300 print:text-gray-700 tabular-nums">
                    ₱{item.price.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-white print:text-black tabular-nums">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-white/10 print:border-black/20 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400 print:text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono text-white print:text-black tabular-nums">
                ₱{order.subtotal.toLocaleString()}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                <span>Voucher Discount:</span>
                <span className="font-mono tabular-nums">-₱{order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-400 print:text-gray-600">
              <span>Shipping:</span>
              <span className="font-mono text-white print:text-black">
                {order.shippingFee === 0 ? 'FREE' : `₱${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white print:text-black pt-2 border-t border-white/10 print:border-black/20">
              <span>Total Paid:</span>
              <span className="font-mono text-blue-400 print:text-blue-700 tabular-nums">
                ₱{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-6 border-t border-white/5 print:border-black/10 flex items-center justify-between text-[11px] text-gray-500 print:text-gray-600 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Genuine CapZone Authenticated Product
          </span>
          <span>Inquiries: help@capzone.ph</span>
        </div>
      </div>

      {/* Bottom Nav CTA */}
      <div className="text-center pt-4 print:hidden">
        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
