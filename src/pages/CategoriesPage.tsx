import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, setCurrentPage, setSelectedCategorySlug } = useShop();

  const handleSelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Curated Headwear Taxonomy
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white">
          Headwear Silhouettes & Collections
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-3 leading-relaxed">
          Every crown tells a different story. Explore our signature silhouettes engineered from heavy twills, Japanese selvedge-style denim, and collector suede.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat.slug)}
            className="group flex flex-col bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            {/* Visual Header */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#182232]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-gray-300 border border-white/10">
                {cat.itemCount} Designs Available
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-['Syne'] text-white group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider group-hover:underline">
                  Browse Collection
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
