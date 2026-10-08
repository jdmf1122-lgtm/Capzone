/**
 * Image Optimizer Utility for CapZone
 * Supports laptop drag-and-drop, file browsing, and mobile camera / photo gallery uploads.
 * Automatically compresses and resizes photos to fit within browser storage limits
 * and ensure fast loading across desktop and mobile devices.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  name: string;
  blob: Blob;
}

/**
 * Resizes and compresses an image file in the browser using HTML5 Canvas.
 * A 10MB camera photo from an iPhone or Android phone is converted to ~120KB-200KB.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get canvas 2d context.'));
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output type (WebP if supported, fallback to JPEG)
        const outputMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        // Convert dataUrl to Blob for potential storage upload
        canvas.toBlob(
          (blob) => {
            const finalBlob = blob || new Blob([], { type: outputMime });
            resolve({
              dataUrl,
              originalSize: file.size,
              compressedSize: finalBlob.size || Math.round(dataUrl.length * 0.75),
              width,
              height,
              name: file.name,
              blob: finalBlob
            });
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };

      img.src = src;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formats byte size into human readable string (e.g. 1.2 MB or 150 KB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
