import React, { useState, useRef } from 'react';
import {
  Upload,
  Smartphone,
  Laptop,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Trash2,
  CheckCircle2,
  Plus,
  Star,
  RefreshCw
} from 'lucide-react';
import { optimizeImageFile, formatBytes } from '../../utils/imageOptimizer';
import { uploadProductImageToStorage } from '../../lib/supabase';
import { PRODUCT_ASSET_IMAGES } from '../../data/initialData';

interface ProductImageUploaderProps {
  primaryImage: string;
  galleryImages: string[];
  onChangePrimaryImage: (url: string) => void;
  onChangeGalleryImages: (urls: string[]) => void;
  productName?: string;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  primaryImage,
  galleryImages,
  onChangePrimaryImage,
  onChangeGalleryImages,
  productName = 'Cap'
}) => {
  const [activeTab, setActiveTab] = useState<'device' | 'presets' | 'url'>('device');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [optimizationNote, setOptimizationNote] = useState<string | null>(null);

  // Hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetList = [
    { label: 'Classic Baseball', url: PRODUCT_ASSET_IMAGES.classicBaseball },
    { label: 'Metro Snapback', url: PRODUCT_ASSET_IMAGES.nySnapback },
    { label: 'Urban Streetwear', url: PRODUCT_ASSET_IMAGES.urbanSnapback },
    { label: 'Vintage Dad Hat', url: PRODUCT_ASSET_IMAGES.vintageDad },
    { label: 'Denim Bucket Hat', url: PRODUCT_ASSET_IMAGES.denimBucket },
    { label: 'Mesh Trucker Cap', url: PRODUCT_ASSET_IMAGES.sportsTrucker },
    { label: 'Wave Embroidered', url: PRODUCT_ASSET_IMAGES.embroideredWave },
    { label: 'Gold Crown Limited', url: PRODUCT_ASSET_IMAGES.crownLimited },
    { label: 'Streetwear Hero', url: PRODUCT_ASSET_IMAGES.hero }
  ];

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setOptimizationNote(null);

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WebP).');
      setIsProcessing(false);
      return;
    }

    try {
      let totalOriginal = 0;
      let totalCompressed = 0;
      const uploadedUrls: string[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        totalOriginal += file.size;

        // 1. Optimize image in-browser (resizes & compresses)
        const optimized = await optimizeImageFile(file, 1200, 1200, 0.85);
        totalCompressed += optimized.compressedSize;

        // 2. Try Supabase Storage upload if connected; otherwise use optimized dataUrl
        let finalUrl = optimized.dataUrl;
        try {
          const storageUrl = await uploadProductImageToStorage(
            optimized.blob,
            `${productName.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`
          );
          if (storageUrl) {
            finalUrl = storageUrl;
          }
        } catch {
          // Graceful fallback to dataUrl
        }

        uploadedUrls.push(finalUrl);
      }

      // If no primary image yet, set the first as primary
      if (!primaryImage && uploadedUrls.length > 0) {
        onChangePrimaryImage(uploadedUrls[0]);
        const remaining = uploadedUrls.slice(1);
        if (remaining.length > 0) {
          onChangeGalleryImages([...galleryImages, ...remaining]);
        }
      } else {
        // Append all to gallery or set primary if empty
        if (!primaryImage) {
          onChangePrimaryImage(uploadedUrls[0]);
        }
        // Add all uploaded items to gallery
        const combined = Array.from(new Set([...galleryImages, ...uploadedUrls]));
        onChangeGalleryImages(combined);
      }

      const savedPercent = Math.max(
        0,
        Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
      );
      setOptimizationNote(
        `Optimized ${validFiles.length} photo(s): ${formatBytes(totalOriginal)} ➔ ${formatBytes(totalCompressed)} (${savedPercent}% smaller for fast loading).`
      );
    } catch (err: any) {
      console.error('Error processing image:', err);
      alert('Failed to process image: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!primaryImage) {
      onChangePrimaryImage(trimmed);
    } else {
      onChangeGalleryImages([...galleryImages, trimmed]);
    }
    setUrlInput('');
    setOptimizationNote('Image URL added successfully.');
  };

  const handleRemoveImage = (urlToRemove: string) => {
    if (primaryImage === urlToRemove) {
      // Pick next image from gallery or clear
      if (galleryImages.length > 0) {
        const next = galleryImages[0];
        onChangePrimaryImage(next);
        onChangeGalleryImages(galleryImages.filter((u) => u !== next));
      } else {
        onChangePrimaryImage('');
      }
    } else {
      onChangeGalleryImages(galleryImages.filter((u) => u !== urlToRemove));
    }
  };

  const handleSetPrimary = (url: string) => {
    if (url === primaryImage) return;
    const oldPrimary = primaryImage;
    onChangePrimaryImage(url);
    const updatedGallery = galleryImages.filter((u) => u !== url);
    if (oldPrimary && !updatedGallery.includes(oldPrimary)) {
      updatedGallery.unshift(oldPrimary);
    }
    onChangeGalleryImages(updatedGallery);
  };

  // Combine primary + gallery for overview list
  const allImages = Array.from(
    new Set([primaryImage, ...galleryImages].filter(Boolean))
  );

  return (
    <div className="space-y-4">
      {/* Upload Methods Selector */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <label className="text-gray-300 font-mono text-xs font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-400" />
          <span>Product Photography & Angles</span>
        </label>

        <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-white/5 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('device')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'device'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3 hidden sm:inline" />
            <Laptop className="w-3 h-3 inline sm:hidden" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Studio Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Web URL</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Device Upload (Laptop & Cellphone) */}
      {activeTab === 'device' && (
        <div className="space-y-3">
          {/* Main Drag-Drop / Mobile Tap Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : 'border-white/15 bg-[#0B0F17]/70 hover:border-white/30'
            }`}
          >
            {/* Hidden native inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-white text-xs font-mono font-medium">
                  Optimizing & uploading photography...
                </p>
                <p className="text-[11px] text-gray-400">
                  Auto-compressing image for lightning-fast loading across mobile and desktop.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    Upload Cap Photography
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                    Upload directly from <strong className="text-gray-200">Laptop</strong> (Drag & Drop or File Explorer) or <strong className="text-gray-200">Phone</strong> (Photo Gallery / Files).
                  </p>
                </div>

                {/* Device Action Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="tap-active px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Browse Files / Gallery</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-gray-400" /> Laptop File Explorer
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-gray-400" /> Phone Photo Gallery
                  </span>
                  <span>•</span>
                  <span>JPG, PNG, WebP</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Studio Asset Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-400 font-mono">
            Select from high-resolution streetwear presets available in catalog:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-[#0B0F17] rounded-xl border border-white/5">
            {presetList.map((preset, idx) => {
              const isSelected = primaryImage === preset.url || galleryImages.includes(preset.url);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!primaryImage) {
                      onChangePrimaryImage(preset.url);
                    } else if (primaryImage !== preset.url && !galleryImages.includes(preset.url)) {
                      onChangeGalleryImages([...galleryImages, preset.url]);
                    }
                  }}
                  className={`group relative aspect-square rounded-lg overflow-hidden border transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/50'
                      : 'border-white/10 hover:border-white/30 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-black/80 backdrop-blur-xs text-[9px] font-mono text-white truncate">
                    {preset.label}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Direct Web URL */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-400 font-mono">
            Paste direct image link (e.g. from Cloudinary, Imgur, or external host):
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/cap-photo.jpg"
              className="flex-1 px-3 py-2 bg-[#0B0F17] border border-white/10 rounded-lg text-white font-mono text-xs focus:border-blue-500 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Add Link
            </button>
          </div>
        </div>
      )}

      {/* Optimization Notice */}
      {optimizationNote && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[11px] font-mono flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{optimizationNote}</span>
        </div>
      )}

      {/* Uploaded Photos Strip & Primary Image Badge */}
      {allImages.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>
              Product Photos ({allImages.length}): Click the star (<Star className="w-3 h-3 inline text-amber-400" />) to set as Primary Cover Photo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {allImages.map((imgUrl, index) => {
              const isPrimary = primaryImage === imgUrl;
              return (
                <div
                  key={index}
                  className={`group relative rounded-xl overflow-hidden border transition-all bg-[#0B0F17] ${
                    isPrimary
                      ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden bg-black/40 flex items-center justify-center p-1">
                    <img
                      src={imgUrl}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-blue-600/90 text-white text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Primary</span>
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(imgUrl)}
                          className="p-1 rounded bg-black/70 hover:bg-amber-500 text-white transition-colors"
                          title="Set as primary photo"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgUrl)}
                        className="p-1 rounded bg-black/70 hover:bg-rose-500 text-white transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 pt-4 text-center">
                      <span className="text-[9px] font-mono text-gray-300">
                        {isPrimary ? 'Cover Display' : `Angle #${index}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Extra Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-active aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/5 flex flex-col items-center justify-center p-3 text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-6 h-6 text-blue-400 mb-1" />
              <span className="text-[10px] font-mono font-semibold">Add Angle</span>
              <span className="text-[9px] text-gray-500">Side / Back View</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
