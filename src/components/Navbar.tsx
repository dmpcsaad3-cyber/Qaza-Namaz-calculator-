import React from 'react';
import {
  Smartphone,
  BookOpen,
  Database,
  Languages,
  Moon,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface NavbarProps {
  language: 'ur' | 'en';
  onToggleLanguage: () => void;
  onOpenApkGuide: () => void;
  onOpenQazaGuide: () => void;
  onOpenBackup: () => void;
  activeTab: 'tracker' | 'calculator';
  onSelectTab: (tab: 'tracker' | 'calculator') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onOpenApkGuide,
  onOpenQazaGuide,
  onOpenBackup,
  activeTab,
  onSelectTab,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center text-white">
            <img
              src="/icon.svg"
              alt="Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback if svg fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{language === 'ur' ? 'قضاء نماز ٹریکر' : 'Qaza Namaz Tracker'}</span>
              </h1>
              {!isOnline && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-medium border border-amber-500/30">
                  <WifiOff className="w-2.5 h-2.5" />
                  <span>Offline</span>
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-400/90 hidden sm:block">
              {language === 'ur'
                ? 'قضاءِ عمری کا حساب اور روزانہ ٹریکنگ'
                : 'Islamic Missed Prayers Tracker & Calculator'}
            </p>
          </div>
        </div>

        {/* Center Tabs for quick navigation on desktop/tablet */}
        <div className="hidden md:flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            id="tab-tracker-nav"
            onClick={() => onSelectTab('tracker')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'tracker'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ur' ? 'نماز ٹریکر' : 'Prayer Tracker'}
          </button>
          <button
            id="tab-calculator-nav"
            onClick={() => onSelectTab('calculator')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ur' ? 'کیلکولیٹر' : 'Calculator'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* APK Guide Button - Special Highlight */}
          <button
            id="btn-nav-apk-guide"
            onClick={onOpenApkGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition active:scale-95 shadow-sm"
            title="How to build APK via Codemagic"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">
              {language === 'ur' ? 'APK گائیڈ' : 'APK / Codemagic'}
            </span>
            <span className="sm:hidden">APK</span>
          </button>

          {/* Qaza Guide Rulings button */}
          <button
            id="btn-nav-qaza-guide"
            onClick={onOpenQazaGuide}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Qaza Fiqh Rules & Short Method"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Backup button */}
          <button
            id="btn-nav-backup"
            onClick={onOpenBackup}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            title="Backup & Restore Data"
          >
            <Database className="w-4 h-4 text-teal-400" />
          </button>

          {/* Language Switcher */}
          <button
            id="btn-nav-language-toggle"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition"
            title="Toggle Urdu / English"
          >
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ur' ? 'EN' : 'اردو'}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton language={language} />
        </div>
      </div>
    </header>
  );
};
