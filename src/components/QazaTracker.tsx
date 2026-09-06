import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Minus,
  CheckCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PrayerKey, QazaState } from '../types';
import { PRAYER_METADATA } from '../utils/qazaStorage';

interface QazaTrackerProps {
  state: QazaState;
  onUpdatePrayer: (
    prayerKey: PrayerKey,
    delta: number,
    action: 'increment' | 'decrement'
  ) => void;
  onLogFullDay: () => void;
  language: 'ur' | 'en';
}

export const QazaTracker: React.FC<QazaTrackerProps> = ({
  state,
  onUpdatePrayer,
  onLogFullDay,
  language,
}) => {
  const [customModalKey, setCustomModalKey] = useState<PrayerKey | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('5');

  const prayerKeys: PrayerKey[] = [
    'fajr',
    'dhuhr',
    'asr',
    'maghrib',
    'isha',
    ...(state.settings.includeWitr ? (['witr'] as PrayerKey[]) : []),
  ];

  const handleIncrement = (key: PrayerKey, delta: number) => {
    onUpdatePrayer(key, delta, 'increment');
    // Fire confetti on round numbers or milestones
    const currentCompleted = state.prayers[key]?.completed || 0;
    if ((currentCompleted + delta) % 25 === 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleDecrement = (key: PrayerKey, delta: number) => {
    onUpdatePrayer(key, delta, 'decrement');
  };

  const handleFullDay = () => {
    onLogFullDay();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  const handleCustomSubmit = () => {
    if (!customModalKey) return;
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      handleIncrement(customModalKey, amount);
    }
    setCustomModalKey(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'ur'
                ? 'فوری لاگ: ایک مکمل دن (تمام 6 نمازیں)'
                : 'Quick Log: 1 Complete Day (All Prayers)'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'ur'
                ? 'فجر، ظہر، عصر، مغرب، عشاء اور وتر میں ایک ساتھ +1 کا اضافہ کریں'
                : 'Increment all 6 prayers by +1 simultaneously'}
            </p>
          </div>
        </div>

        <button
          id="btn-log-full-day"
          onClick={handleFullDay}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 hover:shadow-emerald-700/40 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{language === 'ur' ? 'مکمل 1 دن لاگ کریں (+1)' : 'Log 1 Full Day (+1)'}</span>
        </button>
      </div>

      {/* Prayers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {prayerKeys.map((key) => {
          const meta = PRAYER_METADATA[key];
          const data = state.prayers[key] || { total: 0, completed: 0 };
          const remaining = Math.max(0, data.total - data.completed);
          const percent =
            data.total > 0
              ? Math.min(100, Math.round((data.completed / data.total) * 100))
              : 0;

          return (
            <div
              key={key}
              className="rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 shadow-xl p-5 flex flex-col justify-between transition group relative overflow-hidden"
            >
              {/* Subtle color flare in corner */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none ${
                  meta.color === 'amber'
                    ? 'bg-amber-500'
                    : meta.color === 'emerald'
                    ? 'bg-emerald-500'
                    : meta.color === 'teal'
                    ? 'bg-teal-500'
                    : meta.color === 'rose'
                    ? 'bg-rose-500'
                    : meta.color === 'indigo'
                    ? 'bg-indigo-500'
                    : 'bg-cyan-500'
                }`}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: meta.accentHex }}
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {language === 'ur' ? meta.nameUr : meta.nameEn}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {meta.rakat}{' '}
                        {language === 'ur' ? meta.rakatTypeUr : meta.rakatTypeEn}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {percent}%
                  </span>
                </div>

                {/* Remaining & Completed Stats */}
                <div className="my-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ur' ? 'باقی قضاء' : 'Remaining'}
                    </span>
                    <div className="text-2xl font-black text-white font-mono tracking-tight">
                      {remaining.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ur' ? 'ادا شدہ' : 'Completed'}
                    </span>
                    <div className="text-sm font-bold text-emerald-400 font-mono">
                      {data.completed.toLocaleString()}{' '}
                      <span className="text-xs text-slate-500 font-normal">
                        / {data.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: meta.accentHex,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {/* Primary increment buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id={`btn-increment-${key}-1`}
                    onClick={() => handleIncrement(key, 1)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-950/40 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+1 {language === 'ur' ? 'ادا کی' : 'Prayed'}</span>
                  </button>

                  <button
                    id={`btn-increment-${key}-5`}
                    onClick={() => handleIncrement(key, 5)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700/80 active:scale-95 transition"
                    title="+5 Prayers"
                  >
                    +5
                  </button>

                  <button
                    onClick={() => {
                      setCustomModalKey(key);
                      setCustomAmount('10');
                    }}
                    className="px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/80 active:scale-95 transition"
                    title="Custom amount"
                  >
                    +X
                  </button>

                  <button
                    id={`btn-decrement-${key}`}
                    onClick={() => handleDecrement(key, 1)}
                    disabled={data.completed <= 0}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700/80 active:scale-95 transition"
                    title="Undo / Decrement (-1)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Amount Modal */}
      {customModalKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">
              {language === 'ur'
                ? `اضافی قضاء لاگ کریں (${PRAYER_METADATA[customModalKey].nameUr})`
                : `Add Custom Count (${PRAYER_METADATA[customModalKey].nameEn})`}
            </h4>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'ur' ? 'کتنی نمازیں شامل کرنی ہیں؟' : 'Number of prayers to add:'}
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg font-bold focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCustomSubmit}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
              >
                {language === 'ur' ? 'شامل کریں' : 'Add'}
              </button>
              <button
                onClick={() => setCustomModalKey(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
              >
                {language === 'ur' ? 'منسوخ' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
