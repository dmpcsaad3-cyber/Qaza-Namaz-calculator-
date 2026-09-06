import React from 'react';
import { History, Clock, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';
import { HistoryEntry, PrayerKey } from '../types';
import { PRAYER_METADATA } from '../utils/qazaStorage';

interface HistoryLogProps {
  history: HistoryEntry[];
  language: 'ur' | 'en';
  onUndoLast: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  history,
  language,
  onUndoLast,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'ur' ? 'حالیہ لاگ ریکارڈ (سرگرمی)' : 'Recent Activity Log'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {language === 'ur' ? 'آپ کے حالیہ لاگ کیے گئے اعمال' : 'Recent prayer logs and entries'}
            </span>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onUndoLast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ur' ? 'آخری عمل واپس لیں' : 'Undo Last'}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          {language === 'ur'
            ? 'ابھی تک کوئی نیا لاگ موجود نہیں ہے۔ اوپر کسی نماز میں +1 لاگ کریں۔'
            : 'No activity logged yet. Tap +1 on any prayer to start recording.'}
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {history.slice(0, 15).map((entry) => {
            const date = new Date(entry.timestamp);
            const timeStr = date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold ${
                      entry.action === 'increment' || entry.action === 'full_day'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {entry.action === 'increment' || entry.action === 'full_day' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-white block">
                      {entry.action === 'full_day'
                        ? language === 'ur'
                          ? 'مکمل 1 دن (تمام 6 نمازیں)'
                          : 'Full 1 Day (All 6 Prayers)'
                        : language === 'ur'
                        ? `${entry.prayerNameUr || entry.prayerKey} قضاء`
                        : `${entry.prayerNameEn || entry.prayerKey} Qaza`}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{entry.dateStr}</span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </span>
                  </div>
                </div>

                <div className="font-mono font-bold text-right">
                  <span
                    className={
                      entry.action === 'decrement'
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }
                  >
                    {entry.action === 'decrement' ? `-${entry.count}` : `+${entry.count}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
