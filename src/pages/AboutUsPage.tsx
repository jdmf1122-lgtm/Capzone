import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { setCurrentPage } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Brand Hero Story */}
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CapZone Heritage & Manifesto</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Syne'] text-white leading-tight">
          TOP OFF <br />
          YOUR STYLE.
        </h1>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          CapZone was founded with a singular conviction: headwear is not a careless afterthought or secondary accessory—it is the apex crown of personal streetwear identity.
        </p>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Frustrated by flimsy fast-fashion caps with collapsing crowns, cheap plastic snaps, and distorted embroidery, our design lab began crafting custom headwear in Roxas, Oriental Mindoro—the strategic coastal gateway connecting Mindoro to Panay and the rest of the Philippines. Inspired by New Era athletic legacy, Japanese selvedge denim ateliers, and modern brutalist architecture, we bring world-class headwear craftsmanship right from the heart of Oriental Mindoro.
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sustainable Craftsmanship Guarantee */}
      <div className="p-8 sm:p-12 bg-gradient-to-r from-[#111827] via-[#182232] to-[#111827] rounded-2xl border border-white/10 text-center space-y-4 max-w-3xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold font-['Syne'] text-white">
          Our CapZone Guarantee
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Every cap is inspected by hand, steamed, fitted with protective crown molds, and shipped in rigid shock-resistant cardboard packaging. If your cap does not match your expectations, we offer 7-day hassle-free replacements.
        </p>
      </div>
    </div>
  );
};
