import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar';
import { QazaTracker } from './components/QazaTracker';
import { QazaCalculator } from './components/QazaCalculator';
import { DailyGoalWidget } from './components/DailyGoalWidget';
import { HistoryLog } from './components/HistoryLog';
import { ApkGuideModal } from './components/ApkGuideModal';
import { QazaGuideModal } from './components/QazaGuideModal';
import { BackupModal } from './components/BackupModal';
import { DawatEIslamiSection } from './components/DawatEIslamiSection';
import {
  loadQazaState,
  saveQazaState,
  getTodayDateStr,
  PRAYER_METADATA,
} from './utils/qazaStorage';
import { QazaState, PrayerKey, HistoryEntry } from './types';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  Calculator,
  LayoutGrid,
  BookOpen,
  Smartphone,
  Share2,
  Calendar,
  Sparkles,
  WifiOff,
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<QazaState>(() => loadQazaState());
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator'>('tracker');
  const [language, setLanguage] = useState<'ur' | 'en'>(state.settings.language || 'ur');

  // Modals
  const [showApkGuide, setShowApkGuide] = useState(false);
  const [showQazaGuide, setShowQazaGuide] = useState(false);
  const [showBackup, setShowBackup] = useState(false);

  const isOnline = useOnlineStatus();

  // Save to localStorage on state changes
  useEffect(() => {
    saveQazaState(state);
  }, [state]);

  const toggleLanguage = () => {
    const nextLang = language === 'ur' ? 'en' : 'ur';
    setLanguage(nextLang);
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        language: nextLang,
      },
    }));
  };

  // Prayer increment or decrement
  const handleUpdatePrayer = (
    prayerKey: PrayerKey,
    delta: number,
    action: 'increment' | 'decrement'
  ) => {
    const today = getTodayDateStr();

    setState((prev) => {
      const currentPrayer = prev.prayers[prayerKey] || { total: 0, completed: 0 };
      let newCompleted = currentPrayer.completed;

      if (action === 'increment') {
        newCompleted = currentPrayer.completed + delta;
      } else {
        newCompleted = Math.max(0, currentPrayer.completed - delta);
      }

      // Calculate streak and today count
      let newTodayCount = prev.todayLoggedCount;
      let newStreak = prev.streakDays;

      if (action === 'increment') {
        if (prev.lastLoggedDate === today) {
          newTodayCount += delta;
        } else {
          // New day
          newTodayCount = delta;
          newStreak += 1;
        }
      }

      const meta = PRAYER_METADATA[prayerKey];
      const newHistoryEntry: HistoryEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
        dateStr: today,
        prayerKey,
        prayerNameEn: meta.nameEn,
        prayerNameUr: meta.nameUr,
        count: delta,
        action,
      };

      return {
        ...prev,
        lastLoggedDate: today,
        todayLoggedCount: newTodayCount,
        streakDays: newStreak,
        prayers: {
          ...prev.prayers,
          [prayerKey]: {
            ...currentPrayer,
            completed: newCompleted,
          },
        },
        history: [newHistoryEntry, ...prev.history],
      };
    });
  };

  // Log 1 full day (+1 for all prayers)
  const handleLogFullDay = () => {
    const today = getTodayDateStr();
    const keys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];

    setState((prev) => {
      const updatedPrayers = { ...prev.prayers };
      keys.forEach((k) => {
        if (updatedPrayers[k]) {
          updatedPrayers[k] = {
            ...updatedPrayers[k],
            completed: updatedPrayers[k].completed + 1,
          };
        }
      });

      let newTodayCount = prev.todayLoggedCount;
      let newStreak = prev.streakDays;

      if (prev.lastLoggedDate === today) {
        newTodayCount += keys.length;
      } else {
        newTodayCount = keys.length;
        newStreak += 1;
      }

      const newHistoryEntry: HistoryEntry = {
        id: `log-${Date.now()}-full-day`,
        timestamp: Date.now(),
        dateStr: today,
        count: 1,
        action: 'full_day',
      };

      return {
        ...prev,
        lastLoggedDate: today,
        todayLoggedCount: newTodayCount,
        streakDays: newStreak,
        prayers: updatedPrayers,
        history: [newHistoryEntry, ...prev.history],
      };
    });
  };

  // Undo last action
  const handleUndoLast = () => {
    if (state.history.length === 0) return;
    const lastEntry = state.history[0];

    setState((prev) => {
      const remainingHistory = prev.history.slice(1);
      const updatedPrayers = { ...prev.prayers };

      if (lastEntry.action === 'full_day') {
        const keys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];
        keys.forEach((k) => {
          if (updatedPrayers[k]) {
            updatedPrayers[k] = {
              ...updatedPrayers[k],
              completed: Math.max(0, updatedPrayers[k].completed - 1),
            };
          }
        });
      } else if (lastEntry.prayerKey) {
        const key = lastEntry.prayerKey;
        const current = updatedPrayers[key];
        if (current) {
          if (lastEntry.action === 'increment') {
            updatedPrayers[key] = {
              ...current,
              completed: Math.max(0, current.completed - lastEntry.count),
            };
          } else {
            updatedPrayers[key] = {
              ...current,
              completed: current.completed + lastEntry.count,
            };
          }
        }
      }

      const reversedTodayCount = Math.max(
        0,
        prev.todayLoggedCount - (lastEntry.count || 1)
      );

      return {
        ...prev,
        todayLoggedCount: reversedTodayCount,
        prayers: updatedPrayers,
        history: remainingHistory,
      };
    });
  };

  // Update daily target goal
  const handleUpdateDailyGoal = (newGoal: number) => {
    setState((prev) => ({
      ...prev,
      dailyGoal: newGoal,
      settings: {
        ...prev.settings,
        dailyPace: newGoal,
      },
    }));
  };

  // Apply calculation baseline to tracker
  const handleApplyBaseline = (breakdown: Record<PrayerKey, number>) => {
    setState((prev) => {
      const newPrayers: Record<PrayerKey, { total: number; completed: number }> = {
        ...prev.prayers,
      };

      (Object.keys(breakdown) as PrayerKey[]).forEach((key) => {
        newPrayers[key] = {
          total: breakdown[key],
          completed: 0, // Fresh baseline
        };
      });

      return {
        ...prev,
        prayers: newPrayers,
        todayLoggedCount: 0,
      };
    });

    // Auto-switch to tracker tab so user can see it right away!
    setActiveTab('tracker');
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${
        language === 'ur' ? 'direction-rtl' : ''
      }`}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Top Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenApkGuide={() => setShowApkGuide(true)}
        onOpenQazaGuide={() => setShowQazaGuide(true)}
        onOpenBackup={() => setShowBackup(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
        {/* Banner with Bismillah & Motivation */}
        <div className="text-center py-2 space-y-1">
          <div className="font-serif text-emerald-400 text-lg sm:text-xl tracking-wider select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'ur'
              ? '’’نماز اپنے مقررہ اوقات میں مومنوں پر فرض ہے‘‘ — چھوٹی ہوئی نمازوں کی ادائیگی اخلاص اور استقامت سے کریں۔'
              : '"Indeed, prayer has been decreed upon the believers at specified times." (Surah An-Nisa)'}
          </p>
        </div>

        {/* Top Status & Goal Widgets */}
        <DailyGoalWidget
          state={state}
          onUpdateDailyGoal={handleUpdateDailyGoal}
          language={language}
        />

        {/* View Selection Segmented Tabs for mobile / tablet */}
        <div className="flex md:hidden p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'tracker'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'ur' ? 'نماز ٹریکر' : 'Prayer Tracker'}</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{language === 'ur' ? 'قضاء کیلکولیٹر' : 'Calculator'}</span>
          </button>
        </div>

        {/* Tab 1: Tracker View */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <QazaTracker
              state={state}
              onUpdatePrayer={handleUpdatePrayer}
              onLogFullDay={handleLogFullDay}
              language={language}
            />

            {/* History & Activity Log */}
            <HistoryLog
              history={state.history}
              language={language}
              onUndoLast={handleUndoLast}
            />
          </div>
        )}

        {/* Tab 2: Calculator View */}
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in duration-200">
            <QazaCalculator
              language={language}
              state={state}
              onApplyBaseline={handleApplyBaseline}
            />
          </div>
        )}

        {/* Dawat-e-Islami Islamic Services & Promotional Section */}
        <DawatEIslamiSection language={language} />
      </main>

      {/* Offline Toast if disconnected */}
      {!isOnline && (
        <div className="fixed bottom-20 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl">
          <WifiOff className="w-4 h-4" />
          <span>
            {language === 'ur'
              ? 'آف لائن موڈ — تمام ڈیٹا آپ کے فون میں محفوظ ہو رہا ہے۔'
              : 'Offline Mode — Your prayer logs are safely stored locally.'}
          </span>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition ${
            activeTab === 'tracker' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>{language === 'ur' ? 'ٹریکر' : 'Tracker'}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl transition ${
            activeTab === 'calculator' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span>{language === 'ur' ? 'کیلکولیٹر' : 'Calculator'}</span>
        </button>

        <button
          onClick={() => setShowApkGuide(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl text-amber-400"
        >
          <Smartphone className="w-5 h-5" />
          <span>{language === 'ur' ? 'APK گائیڈ' : 'Get APK'}</span>
        </button>

        <button
          onClick={() => setShowQazaGuide(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-xl text-slate-400"
        >
          <BookOpen className="w-5 h-5" />
          <span>{language === 'ur' ? 'مسائل' : 'Guide'}</span>
        </button>
      </nav>

      {/* Modals */}
      <ApkGuideModal
        isOpen={showApkGuide}
        onClose={() => setShowApkGuide(false)}
        language={language}
      />

      <QazaGuideModal
        isOpen={showQazaGuide}
        onClose={() => setShowQazaGuide(false)}
        language={language}
      />

      <BackupModal
        isOpen={showBackup}
        onClose={() => setShowBackup(false)}
        state={state}
        onUpdateState={setState}
        language={language}
      />
    </div>
  );
}
