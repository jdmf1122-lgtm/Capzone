import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  ArrowRight,
  FileText,
  Clock
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, setCurrentPage, setOrderConfirmationId } = useShop();
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const userOrders = orders.filter((o) => {
    // Show user's orders or all orders if guest/admin
    const matchUser = currentUser ? o.userId === currentUser.id || o.customerEmail === currentUser.email : true;
    if (statusFilter === 'all') return matchUser;
    return matchUser && o.orderStatus === statusFilter;
  });

  const handleViewReceipt = (orderId: string) => {
    setOrderConfirmationId(orderId);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
            Account Purchases
          </div>
          <h1 className="text-3xl font-extrabold font-['Syne'] text-white">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review past headwear purchases and download digital receipts and invoices.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#182232] rounded-lg border border-white/10 text-xs font-mono">
          {['all', 'shipped', 'processing', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md uppercase text-[11px] font-semibold transition-colors ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {userOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#111827] rounded-xl border border-white/10 p-8 space-y-4">
          <Package className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You don&apos;t have any orders under this filter yet. Ready to grab your next signature cap?
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-[#111827] border border-white/10 rounded-xl hover:border-white/20 transition-colors space-y-4 shadow-xl"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{order.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : order.orderStatus === 'shipped'
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {order.createdAt}
                  </span>
                  <span>Tracking: {order.trackingNumber}</span>
                </div>
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-[#182232]/50 rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 object-contain p-0.5 rounded bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.productName}</p>
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

              {/* Order Footer & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
                <div>
                  <span className="text-[11px] text-gray-500 font-mono block">Total Amount Paid</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    ₱{order.totalAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono ml-2 uppercase">
                    ({order.paymentMethod})
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleViewReceipt(order.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-300 border border-blue-500/30 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt & Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
