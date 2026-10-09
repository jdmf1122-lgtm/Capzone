import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, Instagram, Facebook, Twitter, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategorySlug } = useShop();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0F17] border-t border-white/10 text-gray-400 text-xs mt-20">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-['Syne'] text-white tracking-tight">
                CapZone<span className="text-blue-500">.</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 font-mono tracking-wide uppercase text-blue-400">
              &quot;Top Off Your Style&quot;
            </p>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              Dedicated exclusively to premier headwear culture. Inspired by global streetwear capitals, New Era pedigree, and Japanese tailoring. Hand-inspected and shipped from Roxas, Oriental Mindoro.
            </p>
            <div className="space-y-1.5 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Flagship Studio: Rizal St., Brgy. Paclasan, Roxas, Oriental Mindoro 5212, Philippines</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Hotline: +63 (43) 289-CAPS / +63 917 555 4321 · Daily 9 AM - 8 PM PHT</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-white mb-4">
              Headwear Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => navigateToCategory('baseball-caps')}
                  className="hover:text-white transition-colors"
                >
                  Baseball Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('snapback-caps')}
                  className="hover:text-white transition-colors"
                >
                  Snapback Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('bucket-hats')}
                  className="hover:text-white transition-colors"
                >
                  Denim Bucket Hats
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('dad-hats')}
                  className="hover:text-white transition-colors"
                >
                  Vintage Dad Hats
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('trucker-caps')}
                  className="hover:text-white transition-colors"
                >
                  Sports Trucker Caps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('limited-edition-caps')}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  Limited Edition Crowns
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-white mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('order-history')} className="hover:text-white transition-colors">
                  Order History & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about-us')} className="hover:text-white transition-colors">
                  Headwear Sizing & Materials
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact-us')} className="hover:text-white transition-colors">
                  Returns & Exchanges Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact-us')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Payments */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-white mb-4">
              Supported Payments
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-6">
              <div className="p-2 bg-[#182232] rounded border border-white/5 text-center text-blue-400 font-bold">
                GCash
              </div>
              <div className="p-2 bg-[#182232] rounded border border-white/5 text-center text-gray-300">
                Visa / MC
              </div>
              <div className="p-2 col-span-2 bg-[#182232] rounded border border-white/5 text-center text-gray-300">
                Cash on Delivery (COD)
              </div>
            </div>

            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-white mb-2">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-lg bg-[#182232] hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-lg bg-[#182232] hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-lg bg-[#182232] hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-mono">
          <p>© {new Date().getFullYear()} CapZone Co. All rights reserved. Top Off Your Style.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> 100% Genuine Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
