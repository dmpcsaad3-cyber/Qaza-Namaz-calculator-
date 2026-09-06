import React, { useState } from 'react';
import { Flame, Target, Trophy, CalendarCheck2, ArrowUpRight } from 'lucide-react';
import { QazaState, PrayerKey } from '../types';

interface DailyGoalWidgetProps {
  state: QazaState;
  onUpdateDailyGoal: (newGoal: number) => void;
  language: 'ur' | 'en';
}

export const DailyGoalWidget: React.FC<DailyGoalWidgetProps> = ({
  state,
  onUpdateDailyGoal,
  language,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(state.dailyGoal.toString());

  // Calculate overall totals
  const keys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'];
  let totalAll = 0;
  let completedAll = 0;

  keys.forEach((k) => {
    totalAll += state.prayers[k]?.total || 0;
    completedAll += state.prayers[k]?.completed || 0;
  });

  const remainingAll = Math.max(0, totalAll - completedAll);
  const overallPercent =
    totalAll > 0 ? Math.min(100, Math.round((completedAll / totalAll) * 100)) : 0;

  const handleSaveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateDailyGoal(val);
    }
    setIsEditingGoal(false);
  };

  const todayPercent = Math.min(
    100,
    Math.round((state.todayLoggedCount / (state.dailyGoal || 1)) * 100)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Today's Progress Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-300 block">
                {language === 'ur' ? 'آج کا ہدف' : "Today's Target"}
              </span>
              <span className="text-[11px] text-slate-400">
                {state.todayLoggedCount} / {state.dailyGoal} {language === 'ur' ? 'ادا شدہ' : 'prayed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isEditingGoal ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-14 px-2 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
                <button
                  onClick={handleSaveGoal}
                  className="px-2 py-1 rounded-lg bg-emerald-600 text-xs text-white"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setGoalInput(state.dailyGoal.toString());
                  setIsEditingGoal(true);
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
              >
                {language === 'ur' ? 'تبدیل کریں' : 'Edit'}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${todayPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>
              {state.todayLoggedCount >= state.dailyGoal
                ? language === 'ur'
                  ? '🎉 آج کا ہدف مکمل!'
                  : '🎉 Daily goal met!'
                : `${state.dailyGoal - state.todayLoggedCount} ${
                    language === 'ur' ? 'باقی ہیں' : 'remaining'
                  }`}
            </span>
            <span>{todayPercent}%</span>
          </div>
        </div>
      </div>

      {/* 2. Streak Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white flex items-baseline gap-1.5 font-mono">
              <span>{state.streakDays}</span>
              <span className="text-xs font-semibold text-slate-400">
                {language === 'ur' ? 'دنوں کا تسلسل' : 'Days Streak'}
              </span>
            </div>
            <p className="text-[11px] text-amber-400/90">
              {state.streakDays > 0
                ? language === 'ur'
                  ? 'ماشاءاللہ! تسلسل برقرار ہے'
                  : 'Consistent prayer streak'
                : language === 'ur'
                ? 'آج پہلی نماز لاگ کر کے تسلسل شروع کریں'
                : 'Log a prayer today to build streak'}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-400">
          <CalendarCheck2 className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Overall Completion Rate Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-300 block">
            {language === 'ur' ? 'مجموعی تکمیل' : 'Overall Completion'}
          </span>
          <div className="text-2xl font-extrabold text-white font-mono">
            {completedAll.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">
              / {totalAll.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-teal-400 block">
            {remainingAll.toLocaleString()} {language === 'ur' ? 'نمازیں باقی ہیں' : 'prayers left'}
          </span>
        </div>

        {/* Circular indicator */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 transition-all duration-700"
              strokeDasharray={`${overallPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-bold text-white font-mono">
            {overallPercent}%
          </span>
        </div>
      </div>
    </div>
  );
};
