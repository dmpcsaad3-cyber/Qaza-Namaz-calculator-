import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  language: 'ur' | 'en';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>{language === 'ur' ? 'انسٹال شدہ' : 'Installed'}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={install}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-900/30 hover:shadow-emerald-700/40 transition active:scale-95"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>{language === 'ur' ? 'موبائل پر انسٹال کریں' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-ios-guide"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'ur' ? 'آئی فون انسٹال' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'ur' ? 'آئی فون / آئی پیڈ پر انسٹال کریں' : 'Install on iPhone / iPad'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {language === 'ur' ? (
                  <>
                    1. سفاری براؤزر کے نیچے شیئر (Share) بٹن پر ٹیپ کریں۔<br />
                    2. نیچے اسکرول کر کے <strong>"Add to Home Screen"</strong> (ہوم اسکرین میں شامل کریں) منتخب کریں۔<br />
                    3. اوپر دائیں کونے میں <strong>"Add"</strong> پر کلک کریں۔ ایپ بغیر انٹرنیٹ کے بھی چلے گی۔
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> icon in the Safari toolbar.<br />
                    2. Scroll down and tap <strong>"Add to Home Screen"</strong>.<br />
                    3. Tap <strong>"Add"</strong> in the top right. The app will work offline just like a native app.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition"
              >
                {language === 'ur' ? 'سمجھ آ گیا' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
