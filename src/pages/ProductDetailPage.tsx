import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/common/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Check,
  ArrowLeft,
  Plus,
  Minus,
  MessageSquare,
  Shield,
  Edit3,
  ZoomIn,
  Scan,
  Maximize2,
  X
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentPage,
    addToCart,
    buyNow,
    toggleWishlist,
    isWishlisted,
    getProductReviews,
    addReview,
    showToast
  } = useShop();

  const { isAdmin, switchRole } = useAuth();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // New Review state
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const wishlisted = isWishlisted(product.id);
  const reviews = getProductReviews(product.id);

  // Related products (same category or featured)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview({
      productId: product.id,
      userName: reviewName.trim(),
      userEmail: reviewEmail.trim() || 'shopper@capzone.ph',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });
    setReviewName('');
    setReviewEmail('');
    setReviewComment('');
    setReviewFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-36 sm:pb-16 space-y-10 sm:space-y-16">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('shop')}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Gallery Column (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Frame - Fully Contained, No Cropping */}
          <div className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] max-h-[640px] w-full rounded-2xl overflow-hidden bg-[#0c121d] border border-white/10 shadow-2xl flex items-center justify-center p-3 sm:p-6 group select-none">
            {/* Ambient soft glow backdrop (fills the dark frame without clipping) */}
            <img
              src={activeImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-125 pointer-events-none transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/60 via-transparent to-transparent pointer-events-none" />

            {/* Main Product Image - Full Uncropped View */}
            <img
              src={activeImage}
              alt={product.name}
              className={`relative z-10 w-full h-full max-h-[560px] ${
                imageFit === 'contain' ? 'object-contain' : 'object-cover'
              } object-center transition-all duration-300 group-hover:scale-[1.02] cursor-zoom-in`}
              onClick={() => setIsZoomOpen(true)}
              title="Click to view full image in high resolution"
            />

            {/* Top Left Status Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
              {product.isLimited && (
                <span className="text-xs font-mono tracking-wider uppercase text-amber-300 bg-amber-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-amber-500/30 shadow-md">
                  Limited Edition Crown
                </span>
              )}
            </div>

            {/* Top Right Controls Toolbar (Fit Mode, Zoom Lightbox, Wishlist) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              {/* Fit Toggle (Contain vs Fill) */}
              <button
                type="button"
                onClick={() => setImageFit(imageFit === 'contain' ? 'cover' : 'contain')}
                className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-gray-200 hover:text-white border border-white/15 text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-md"
                title={imageFit === 'contain' ? 'Switch to Fill Frame' : 'Fit Entire Photo (See All)'}
              >
                {imageFit === 'contain' ? (
                  <>
                    <Scan className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">Fit All</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Fill Frame</span>
                  </>
                )}
              </button>

              {/* Fullscreen Zoom Lightbox Button */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="p-2 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-gray-200 hover:text-white border border-white/15 transition-all shadow-md"
                title="View full picture uncropped"
                aria-label="View full picture"
              >
                <ZoomIn className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                  wishlisted
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90 border border-white/15'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Bottom Indicator */}
            <div className="absolute bottom-3 left-4 z-20 text-[10px] font-mono text-gray-400/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>{imageFit === 'contain' ? '100% Full Picture Visible' : 'Filled View'}</span>
            </div>
          </div>

          {/* Fullscreen Lightbox Zoom Modal */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setIsZoomOpen(false)}
            >
              <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
                <span className="text-xs font-mono text-gray-400 hidden sm:inline">
                  Click anywhere or press close
                </span>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close full view"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10 bg-[#0d131f]"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-white text-sm font-semibold">{product.name}</h3>
                <p className="text-gray-400 text-xs font-mono">100% Full Uncropped Original Photography</p>
              </div>
            </div>
          )}

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-[#0c121d] border transition-all shrink-0 p-1 flex items-center justify-center ${
                    activeImage === img
                      ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Craftsmanship & Anatomy Banner */}
          <div className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400">
              The CapZone Standard · Anatomy of the Crown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-300">
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-mono block">Profile</span>
                <span className="font-semibold">{product.specs.crown.split(' ')[0]} Crown</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-mono block">Closure</span>
                <span className="font-semibold">{product.specs.closure.split(' ')[0]} Fit</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-mono block">Visor</span>
                <span className="font-semibold">{product.specs.visor.split(' ')[0]} Visor</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] uppercase font-mono block">Origin</span>
                <span className="font-semibold">Hand-Finished</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Purchase Module (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 h-fit">
          {/* Header Metadata (Zero-pill, typographic separators) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono uppercase tracking-wider">
              <span className="text-blue-400 font-medium">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewCount} reviews)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Syne'] text-white">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold font-mono text-white tabular-nums">
                ₱{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through font-mono tabular-nums">
                  ₱{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                In Stock & Ready to Ship
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-gray-400 uppercase tracking-wider">Color:</span>
              <span className="font-semibold text-white font-mono">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    selectedColor === c.name
                      ? 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500'
                      : 'border-white/10 hover:border-white/20 text-gray-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size & Purchase CTAs or Admin Control Box */}
          {isAdmin ? (
            <div className="space-y-4 pt-3 border-t border-amber-500/20">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#182232] to-[#111827] border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                        Admin Point of View
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">Store Owner & Inventory Manager</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    Purchasing Disabled
                  </span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1 text-xs text-amber-100/90 leading-relaxed">
                  <p className="font-semibold text-amber-200">
                    Store administrators cannot purchase store products or add items to cart.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Manage pricing, inventory levels, color options, and product releases directly in the Admin Dashboard.
                  </p>
                </div>

                {/* Cap Inventory Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 bg-[#111827]/80 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Inventory Stock</span>
                    <span className="text-white font-bold text-sm">
                      {product.stock} units {product.stock > 0 ? '(Ready)' : '(Sold Out)'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#111827]/80 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Retail Price</span>
                    <span className="text-white font-bold text-sm">₱{product.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setCurrentPage('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.01]"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Manage / Edit Cap in Admin Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('user');
                      showToast('Switched to customer view. Purchasing is enabled for test customer.', 'info');
                    }}
                    className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider border border-white/10 transition-colors text-center"
                  >
                    Switch to Customer Mode (Test Buying)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Size & Quantity Row */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-400 uppercase tracking-wider">Size:</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Sizing Matrix
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 py-2 px-3 bg-[#182232] rounded-lg border border-white/10 text-xs font-mono text-gray-300 flex items-center justify-between">
                    <span>One Size Fits All (OSFA)</span>
                    <span className="text-gray-500">55 - 61 cm</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/10 rounded-lg bg-[#182232]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2.5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => buyNow(product, selectedColor, quantity)}
                  disabled={product.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {product.stock > 0
                      ? `Order Now · ₱${(product.price * quantity).toLocaleString()}`
                      : 'Sold Out'}
                  </span>
                </button>

                <button
                  onClick={() => addToCart(product, selectedColor, quantity)}
                  disabled={product.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white border border-white/20 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews & Social Proof Section */}
      <section className="pt-12 border-t border-white/10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-1">
              Customer Feedback
            </div>
            <h2 className="text-2xl font-bold font-['Syne'] text-white">
              Reviews & Fit Ratings ({reviews.length})
            </h2>
          </div>

          <button
            onClick={() => setReviewFormOpen(!reviewFormOpen)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{reviewFormOpen ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Submission Form */}
        {reviewFormOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 bg-[#111827] rounded-xl border border-white/10 space-y-4 max-w-2xl animate-in fade-in duration-200"
          >
            <h3 className="text-sm font-semibold text-white">Share Your Experience with {product.name}</h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenji Cruz"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kenji@gmail.com"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Review Commentary</label>
              <textarea
                required
                rows={3}
                placeholder="How does the cap fit? Describe the fabric, stitch quality, visor curvature..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-[#182232] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Post Verified Review
            </button>
          </form>
        )}

        {/* Existing Reviews List */}
        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-[#111827] rounded-xl border border-white/10 text-xs text-gray-400">
            No customer reviews yet. Be the first to share your thoughts on this cap!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-[#111827] rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{rev.userName}</h4>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-['Syne'] text-white">
              Complete Your Headwear Rotation
            </h2>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider"
            >
              View All Caps →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Mobile Sticky Action Dock (App-Like Ergonomics) */}
      {isAdmin ? (
        <div className="md:hidden fixed bottom-[max(env(safe-area-inset-bottom,0px),58px)] left-0 right-0 z-30 bg-[#0B0F17]/95 backdrop-blur-xl border-t border-amber-500/30 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1.5 truncate">
              <Shield className="w-3 h-3 text-amber-400" /> Admin Point of View
            </span>
            <div className="text-xs font-mono text-gray-300">
              Stock: <strong className="text-white font-bold">{product.stock} pcs</strong> · ₱{product.price.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="tap-active px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage Cap</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="md:hidden fixed bottom-[max(env(safe-area-inset-bottom,0px),58px)] left-0 right-0 z-30 bg-[#0B0F17]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block shrink-0"
                style={{
                  backgroundColor:
                    product.colors?.find((c) => c.name === selectedColor)?.hex || '#3B82F6'
                }}
              />
              <span className="truncate">{selectedColor}</span> · Qty {quantity}
            </span>
            <div className="text-base font-bold font-mono text-white tabular-nums">
              ₱{(product.price * quantity).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => addToCart(product, selectedColor, quantity)}
              disabled={product.stock <= 0}
              className="tap-active p-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white rounded-xl border border-white/15 shadow-sm"
              aria-label="Add to cart"
              title="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <button
              onClick={() => buyNow(product, selectedColor, quantity)}
              disabled={product.stock <= 0}
              className="tap-active px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{product.stock > 0 ? 'Buy Now' : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
