import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Star, Heart, ShoppingBag, Zap, Shield } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductId,
    setCurrentPage,
    addToCart,
    buyNow,
    toggleWishlist,
    isWishlisted
  } = useShop();

  const { isAdmin } = useAuth();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [imageLoaded, setImageLoaded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="group relative flex flex-col bg-[#111827] border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60">
      {/* Visual Area - fully contained so the entire picture is visible */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0d131f] flex items-center justify-center p-2.5">
        {/* Ambient soft glow backdrop */}
        <img
          src={product.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
        />

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`relative z-10 h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#182232] animate-pulse">
            <span className="text-xs uppercase tracking-widest text-gray-500">CapZone</span>
          </div>
        )}

        {/* Fallback & Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Status indicator (Single subtle tag) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isAdmin && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-300 bg-amber-950/90 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1 shadow-md">
              <Shield className="w-2.5 h-2.5 text-amber-400" /> Admin
            </span>
          )}
          {product.isLimited ? (
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-300 bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-amber-500/30">
              Limited Edition
            </span>
          ) : product.isNewArrival ? (
            <span className="text-[10px] font-mono tracking-wider uppercase text-blue-300 bg-blue-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-blue-500/30">
              New Drop
            </span>
          ) : product.isBestSeller ? (
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-500/30">
              Best Seller
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            wishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/40 text-gray-300 hover:text-white hover:bg-black/70 border border-white/10'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Fast Quick-Action Overlay on Hover */}
        {isAdmin ? (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-black/80 whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Manage in Admin</span>
            </button>
          </div>
        ) : (
          <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product, selectedColor, 1);
              }}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Order Now</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, selectedColor, 1);
              }}
              disabled={product.stock <= 0}
              className="flex items-center justify-center px-3 py-2 bg-white text-[#0B0F17] hover:bg-gray-100 disabled:opacity-50 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg whitespace-nowrap"
              title="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 cursor-pointer" onClick={handleOpenDetail}>
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400 mb-1 uppercase tracking-wider">
          <span className="font-medium text-blue-400 truncate max-w-[65%]">{product.category}</span>
          <span className="flex items-center gap-0.5 sm:gap-1 text-amber-400 font-mono tabular-nums shrink-0">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-gray-500 hidden xs:inline">({product.reviewCount})</span>
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Pricing & Stock */}
        <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between gap-1 flex-wrap">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-lg font-bold text-white font-mono tabular-nums">
              ₱{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-500 line-through font-mono tabular-nums hidden xs:inline">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
            {product.stock > 0 ? (
              <span className="text-emerald-400">{product.stock} In Stock</span>
            ) : (
              <span className="text-rose-400">Sold Out</span>
            )}
          </span>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.slice(0, 3).map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'scale-125 border-blue-400 ring-2 ring-blue-500/30'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] font-mono text-gray-500">+{product.colors.length - 3}</span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-gray-400 truncate max-w-[80px] sm:max-w-[120px] font-mono hidden xs:inline">
              {selectedColor}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {isAdmin ? (
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-amber-500/20 flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="tap-active w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all"
              title="Manage this cap in Admin Dashboard"
            >
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Manage in Admin</span>
            </button>
          </div>
        ) : (
          <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-white/10 flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => buyNow(product, selectedColor, 1)}
              disabled={product.stock <= 0}
              className="tap-active flex-1 flex items-center justify-center gap-1 py-2 px-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/20"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white shrink-0" />
              <span className="truncate">Order Now</span>
            </button>
            <button
              onClick={() => addToCart(product, selectedColor, 1)}
              disabled={product.stock <= 0}
              className="tap-active p-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-gray-200 hover:text-white rounded-lg border border-white/10 transition-colors shrink-0"
              title="Add to Cart"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
