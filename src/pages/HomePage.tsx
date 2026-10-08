import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import {
  ArrowRight,
  Sparkles,
  Instagram
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, setCurrentPage, setSelectedCategorySlug, setSelectedProductId } = useShop();
  const [productTab, setProductTab] = useState<'featured' | 'new' | 'bestsellers'>('featured');

  const filteredProducts = products.filter((p) => {
    if (productTab === 'featured') return p.isFeatured;
    if (productTab === 'new') return p.isNewArrival;
    if (productTab === 'bestsellers') return p.isBestSeller;
    return true;
  });

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-24">
      {/* 1. Hero Banner */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[680px] flex items-center bg-[#0B0F17] overflow-hidden border-b border-white/10">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            {/* Clean unboxed kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400">
              <span>Roxas, Oriental Mindoro</span>
              <span aria-hidden="true">·</span>
              <span>2026 Drops</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">Exclusive Run</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Syne'] tracking-tight text-white leading-[1.05]">
              TOP OFF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
                YOUR STYLE.
              </span>
            </h1>

            {/* CTAs - Mobile full-width stacked, desktop inline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="tap-active w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleCategoryClick('limited-edition-caps')}
                className="tap-active w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Limited Edition Crowns</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
              Curated Selection
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
              The CapZone Rotation
            </h2>
          </div>

          {/* Functional Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-[#182232] rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setProductTab('featured')}
              className={`tap-active px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                productTab === 'featured'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setProductTab('new')}
              className={`tap-active px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                productTab === 'new'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              New Drops
            </button>
            <button
              onClick={() => setProductTab('bestsellers')}
              className={`tap-active px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                productTab === 'bestsellers'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* Product Grid - 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-[#111827] hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/10 transition-colors inline-flex items-center gap-2"
          >
            <span>View All {products.length} Caps</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </section>

      {/* 4. Shop by Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
              Explore Silhouettes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentPage('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            All Collections <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group relative h-64 rounded-xl overflow-hidden cursor-pointer border border-white/10 bg-[#182232] hover:border-blue-500/60 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400">
                  {cat.itemCount} Designs
                </span>
                <h3 className="text-xl font-bold font-['Syne'] text-white group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{cat.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-white group-hover:translate-x-1 transition-transform">
                  <span>Explore drop</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Instagram Street Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-bold font-['Syne'] text-white">#CapZoneStreetwear</h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">Tag @capzone.ph to get featured</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => handleProductClick(p.id)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#0d131f] flex items-center justify-center p-2 cursor-pointer group border border-white/10"
            >
              <img
                src={p.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-125 pointer-events-none"
              />
              <img
                src={p.image}
                alt={p.name}
                className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-xs text-white font-medium">{p.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
