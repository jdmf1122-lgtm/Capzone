import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const TopBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { applyDiscount, showToast } = useShop();

  if (dismissed) return null;

  const handleCopyCode = () => {
    applyDiscount('CAPZONE10');
    showToast('Voucher CAPZONE10 automatically activated for 10% off!', 'success');
  };

  return (
    <div className="relative z-40 bg-gradient-to-r from-blue-900/60 via-[#111827] to-blue-900/60 border-b border-white/5 py-1.5 px-4 text-xs text-gray-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          <span className="truncate">
            <strong className="text-white font-medium">Exclusively Serving Roxas, Oriental Mindoro:</strong> Same-Day Delivery across all 20 Roxas Barangays · Studio Pickup at Paclasan · Code{' '}
            <button
              onClick={handleCopyCode}
              className="text-amber-400 font-mono font-bold hover:underline cursor-pointer"
              title="Click to apply"
            >
              CAPZONE10
            </button>{' '}
            for 10% OFF
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-emerald-300">
            ₱ PHP
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-0.5 text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
