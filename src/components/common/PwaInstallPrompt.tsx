import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    const isNavigatorStandalone = 'standalone' in window.navigator && Boolean((window.navigator as unknown as Record<string, unknown>).standalone);
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches || isNavigatorStandalone;

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check if dismissed previously within 3 days
    const lastDismissed = localStorage.getItem('capzone_pwa_dismissed');
    if (lastDismissed) {
      const parsed = parseInt(lastDismissed, 10);
      if (Date.now() - parsed < 3 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Android / Chromium PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('capzone_pwa_dismissed', Date.now().toString());
  };

  // If already installed or dismissed, do not render
  if (isStandalone || dismissed) return null;

  // Render floating mobile install badge (only shown on mobile screens or if installable)
  return (
    <>
      <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-[#111827]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 ring-1 ring-white/10">
          {/* App Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 border border-blue-400/30 shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white font-['Syne'] truncate">
                CapZone Mobile App
              </h4>
              <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1 rounded uppercase">
                Install
              </span>
            </div>
            <p className="text-[11px] text-gray-300 leading-tight truncate">
              {isIos ? 'Add to Home Screen for native app feel' : 'Install for faster loading & 1-tap shopping'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="tap-active px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get App</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instruction Sheet */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-white/10 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-['Syne']">Install on iPhone / iPad</h3>
                  <p className="text-[10px] text-gray-400">Add CapZone to your Home Screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">
                  1
                </span>
                <div>
                  Tap the <strong className="text-white">Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> at the bottom of Safari.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">
                  2
                </span>
                <div>
                  Scroll down the share sheet and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-blue-400" />.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono flex items-center justify-center shrink-0 text-[11px] font-bold">
                  3
                </span>
                <div>
                  Tap <strong className="text-white">&quot;Add&quot;</strong> in the top right corner. CapZone is now installed like a native mobile app!
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
