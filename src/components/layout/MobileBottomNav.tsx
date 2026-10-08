import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Grid,
  ShoppingBag,
  User,
  Shield
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    cartCount,
    setIsCartOpen,
    setIsAuthModalOpen,
    setAuthModalReason
  } = useShop();

  const { currentUser, isAdmin } = useAuth();

  const handleNav = (targetPage: string) => {
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (!currentUser) {
      setAuthModalReason(null);
      setIsAuthModalOpen(true);
    } else if (isAdmin) {
      handleNav('admin');
    } else {
      handleNav('user-profile');
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const isHomeActive = currentPage === 'home';
  const isShopActive = currentPage === 'shop' || currentPage === 'categories' || currentPage === 'product-detail';
  const isCartActive = currentPage === 'cart' || currentPage === 'checkout';
  const isAccountActive = currentPage === 'user-profile' || currentPage === 'admin' || currentPage === 'login' || currentPage === 'register' || currentPage === 'order-history';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B0F17]/95 backdrop-blur-xl border-t border-white/10 pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-2 px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`tap-active flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            isHomeActive ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Go to Home"
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform duration-200 ${isHomeActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.75]'}`} />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_6px_#3B82F6]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* 2. Shop Catalog */}
        <button
          onClick={() => handleNav('shop')}
          className={`tap-active flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            isShopActive ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Shop Catalog"
        >
          <div className="relative">
            <Grid className={`w-5 h-5 transition-transform duration-200 ${isShopActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.75]'}`} />
            {isShopActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_6px_#3B82F6]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Shop</span>
        </button>

        {/* 3. Cart Bag */}
        <button
          onClick={handleCartClick}
          className={`tap-active flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            isCartActive ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform duration-200 ${isCartActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.75]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white font-mono font-bold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-[#0B0F17] shadow-md animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            {isCartActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_6px_#3B82F6]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Bag</span>
        </button>

        {/* 4. Account / Admin */}
        <button
          onClick={handleAccountClick}
          className={`tap-active flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            isAccountActive ? 'text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Account / Sign In"
        >
          <div className="relative">
            {isAdmin ? (
              <Shield className={`w-5 h-5 text-amber-400 transition-transform duration-200 ${isAccountActive ? 'scale-110' : ''}`} />
            ) : currentUser ? (
              <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-[10px] font-bold text-blue-300 font-mono">
                {currentUser.fullname.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className={`w-5 h-5 transition-transform duration-200 ${isAccountActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.75]'}`} />
            )}
            {isAccountActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_6px_#3B82F6]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[55px]">
            {isAdmin ? 'Admin' : currentUser ? currentUser.fullname.split(' ')[0] : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
