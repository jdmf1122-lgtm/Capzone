import React from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-xl p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold font-['Syne'] tracking-wide">CapZone Headwear Sizing Matrix</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <p className="text-sm text-gray-300 leading-relaxed">
            Every CapZone headwear piece is engineered to deliver structured fit and all-day comfort. Use a flexible tape measure around the widest part of your head—approximately 1 cm above your ears and eyebrows.
          </p>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-3">
              Standard Headwear Size Conversion
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-[#182232] text-gray-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">Size</th>
                    <th className="p-3 font-semibold">Circumference (CM)</th>
                    <th className="p-3 font-semibold">Inches</th>
                    <th className="p-3 font-semibold">Fitted Scale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-medium text-white">Small (S)</td>
                    <td className="p-3 tabular-nums">54 - 55 cm</td>
                    <td className="p-3 tabular-nums">21¼ - 21⅝ in</td>
                    <td className="p-3 tabular-nums">6⅞ - 7</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-medium text-white">Medium (M)</td>
                    <td className="p-3 tabular-nums">56 - 57 cm</td>
                    <td className="p-3 tabular-nums">22 - 22½ in</td>
                    <td className="p-3 tabular-nums">7⅛ - 7¼</td>
                  </tr>
                  <tr className="hover:bg-white/5 bg-blue-500/10 text-blue-200">
                    <td className="p-3 font-medium text-white">One Size / OSFA (Adjustable)</td>
                    <td className="p-3 tabular-nums font-semibold">55 - 61 cm</td>
                    <td className="p-3 tabular-nums font-semibold">21⅝ - 24 in</td>
                    <td className="p-3 tabular-nums font-semibold">Snapback / Strap</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-medium text-white">Large (L)</td>
                    <td className="p-3 tabular-nums">58 - 59 cm</td>
                    <td className="p-3 tabular-nums">22⅞ - 23¼ in</td>
                    <td className="p-3 tabular-nums">7⅜ - 7½</td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 font-medium text-white">X-Large (XL)</td>
                    <td className="p-3 tabular-nums">60 - 62 cm</td>
                    <td className="p-3 tabular-nums">23⅝ - 24⅜ in</td>
                    <td className="p-3 tabular-nums">7⅝ - 7¾</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#182232] rounded-lg border border-white/5">
              <h5 className="font-semibold text-sm text-white mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Snapbacks & Dad Hats
              </h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Feature 7-pin poly snaps or metal slide closures that comfortably span 55cm to 61cm, fitting 98% of adults effortlessly.
              </p>
            </div>
            <div className="p-4 bg-[#182232] rounded-lg border border-white/5">
              <h5 className="font-semibold text-sm text-white mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Bucket Hats & Fitted Crowns
              </h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Structured with internal crown lining tape. If between measurements, we suggest choosing the larger size for a relaxed drop.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
