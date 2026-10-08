import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (selectedCategorySlug) {
      const match = categories.find((c) => c.slug === selectedCategorySlug);
      return match ? match.name : 'all';
    }
    return 'all';
  });

  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available unique colors across products
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        if (!map.has(c.name)) {
          map.set(c.name, c.hex);
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Price filter
        if (p.price > priceRange) {
          return false;
        }
        // In-stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        // Search query
        if (
          searchQuery.trim() &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Color filter
        if (selectedColor !== 'all') {
          const hasColor = p.colors?.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase());
          if (!hasColor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, priceRange, inStockOnly, searchQuery, selectedColor, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCategorySlug(null);
    setPriceRange(1000);
    setSortBy('featured');
    setInStockOnly(false);
    setSelectedColor('all');
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange < 1000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
            Official Store Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Syne'] text-white">
            Shop All Caps & Hats
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            From classic 6-panel baseball caps to raw denim bucket hats and limited collector crowns.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs font-medium text-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-gray-400 font-mono hidden sm:inline">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Drops</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`space-y-6 md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } p-5 md:p-0 bg-[#111827] md:bg-transparent rounded-xl md:rounded-none border md:border-none border-white/10`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-white flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Filter Options
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            )}
          </div>

          {/* Search Within Catalog */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono block mb-2">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E.g. Vintage, Snapback..."
                className="w-full pl-9 pr-7 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono block mb-2">
              Category
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCategorySlug(null);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>All Categories</span>
                <span className="font-mono text-[10px] opacity-75">{products.length}</span>
              </button>

              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setSelectedCategorySlug(c.slug);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === c.name
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="font-mono text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="font-semibold text-gray-300 uppercase tracking-wider">Max Price</span>
              <span className="text-blue-400 font-bold tabular-nums">₱{priceRange}</span>
            </div>
            <input
              type="range"
              min={250}
              max={1000}
              step={50}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>₱250</span>
              <span>₱1,000+</span>
            </div>
          </div>

          {/* Color Filter */}
          <div className="pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono block mb-2">
              Color Family
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2 py-1 text-[11px] rounded border font-mono transition-colors ${
                  selectedColor === 'all'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-1.5 px-2 py-1 text-[11px] rounded border font-mono transition-colors ${
                    selectedColor.toLowerCase() === color.name.toLowerCase()
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-[#182232] border-white/20 text-blue-600 focus:ring-0"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>
              Showing <strong className="text-white">{filteredProducts.length}</strong> headwear pieces
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-blue-400">{activeFiltersCount} filter(s) applied</span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#111827] rounded-xl border border-white/10 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No caps match your criteria</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try widening your price range, choosing a different category, or resetting your search filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
