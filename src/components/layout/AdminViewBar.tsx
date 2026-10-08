import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { Shield, LayoutDashboard, UserCheck, Eye } from 'lucide-react';

export const AdminViewBar: React.FC = () => {
  const { isAdmin, switchRole } = useAuth();
  const { setCurrentPage, currentPage, showToast } = useShop();

  if (!isAdmin) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950 via-[#1c1407] to-amber-950 border-b border-amber-500/40 text-amber-200 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </span>
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-amber-300 font-mono uppercase tracking-wider text-[11px] sm:text-xs">
              Admin Point of View
            </span>
            <span className="hidden md:inline text-amber-200/70 text-[11px]">
              · Store Owner Mode (Purchasing & Add-to-Bag Disabled)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentPage !== 'admin' && (
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="tap-active flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => {
              switchRole('user');
              showToast('Switched to customer view. Purchasing is enabled.', 'info');
            }}
            className="tap-active flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-colors border border-white/10"
            title="Switch to customer mode to test shopping experience"
          >
            <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Switch to Customer</span>
            <span className="sm:hidden">Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
