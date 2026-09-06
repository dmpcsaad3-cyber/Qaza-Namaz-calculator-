import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Calendar,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { CalculationResult, PrayerKey, QazaState } from '../types';
import { PRAYER_METADATA } from '../utils/qazaStorage';

interface QazaCalculatorProps {
  language: 'ur' | 'en';
  state: QazaState;
  onApplyBaseline: (breakdown: Record<PrayerKey, number>) => void;
}

export const QazaCalculator: React.FC<QazaCalculatorProps> = ({
  language,
  state,
  onApplyBaseline,
}) => {
  const [calcMode, setCalcMode] = useState<'duration' | 'age'>('duration');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [includeWitr, setIncludeWitr] = useState<boolean>(true);

  // Duration mode state
  const [years, setYears] = useState<number>(2);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);

  // Age mode state
  const [currentAge, setCurrentAge] = useState<number>(28);
  const [pubertyAge, setPubertyAge] = useState<number>(14);
  const [regularPrayerAge, setRegularPrayerAge] = useState<number>(25);

  // Female cycle deduction
  const [haidhDaysPerMonth, setHaidhDaysPerMonth] = useState<number>(7);

  // Planned daily rate
  const [dailyPace, setDailyPace] = useState<number>(5);

  // Applied success notification
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Calculate
  const result: CalculationResult = useMemo(() => {
    let rawMissedDays = 0;

    if (calcMode === 'duration') {
      rawMissedDays = Math.max(0, years * 365 + months * 30 + days);
    } else {
      const missedYears = Math.max(0, regularPrayerAge - pubertyAge);
      rawMissedDays = missedYears * 365;
    }

    // If female, deduct monthly cycle days (non-praying days are not qaza)
    let netDays = rawMissedDays;
    if (gender === 'female') {
      const cycleDaysDeducted = Math.round((rawMissedDays / 30) * haidhDaysPerMonth);
      netDays = Math.max(0, rawMissedDays - cycleDaysDeducted);
    }

    const prayersBreakdown: Record<PrayerKey, number> = {
      fajr: netDays,
      dhuhr: netDays,
      asr: netDays,
      maghrib: netDays,
      isha: netDays,
      witr: includeWitr ? netDays : 0,
    };

    const multiplier = includeWitr ? 6 : 5;
    const totalPrayers = netDays * multiplier;
    // Rakat: Fajr 2, Dhuhr 4, Asr 4, Maghrib 3, Isha 4, Witr 3 = 20 total rakat per day (or 17 if witr excluded)
    const rakatPerDay = includeWitr ? 20 : 17;
    const totalRakat = netDays * rakatPerDay;

    const daysToFinish = dailyPace > 0 ? Math.ceil(totalPrayers / dailyPace) : 0;
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + daysToFinish);

    const estimatedMonths = (daysToFinish / 30).toFixed(1);

    return {
      totalDaysMissed: netDays,
      years: Math.floor(netDays / 365),
      months: Math.floor((netDays % 365) / 30),
      days: Math.floor((netDays % 365) % 30),
      prayersBreakdown,
      totalPrayers,
      totalRakat,
      estimatedMonthsAtCurrentPace: Number(estimatedMonths),
      targetFinishDate: finishDate.toLocaleDateString(
        language === 'ur' ? 'ur-PK' : 'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      ),
    };
  }, [
    calcMode,
    gender,
    includeWitr,
    years,
    months,
    days,
    currentAge,
    pubertyAge,
    regularPrayerAge,
    haidhDaysPerMonth,
    dailyPace,
    language,
  ]);

  const handleApply = () => {
    onApplyBaseline(result.prayersBreakdown);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{language === 'ur' ? 'قضاء نماز کیلکولیٹر' : 'Qaza Prayers Calculator'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ur'
                  ? 'چھوٹی ہوئی نمازوں کا درست تخمینہ اور ادائیگی کا تخمینہ وقت معلوم کریں'
                  : 'Calculate missed prayers accurately by duration or age'}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 self-start sm:self-auto">
            <button
              onClick={() => setCalcMode('duration')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                calcMode === 'duration'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ur' ? 'براہِ راست مدت' : 'Duration (Yrs/Mos)'}
            </button>
            <button
              onClick={() => setCalcMode('age')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                calcMode === 'age'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ur' ? 'عمر و بلوغت کے مطابق' : 'By Age & Puberty'}
            </button>
          </div>
        </div>
      </div>

      {/* Input controls & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>{language === 'ur' ? 'بنیادی معلومات درج کریں' : 'Input Parameters'}</span>
            </h3>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                {language === 'ur' ? 'جنس (Gender)' : 'Gender'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-sm font-semibold transition ${
                    gender === 'male'
                      ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{language === 'ur' ? 'مرد (Male)' : 'Male'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-sm font-semibold transition ${
                    gender === 'female'
                      ? 'bg-rose-600/20 border-rose-500/50 text-rose-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{language === 'ur' ? 'خاتون (Female)' : 'Female'}</span>
                </button>
              </div>
            </div>

            {/* Female cycle deduction note */}
            {gender === 'female' && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-rose-300 font-medium">
                  <span>
                    {language === 'ur'
                      ? 'ماہواری (حیض) کے ایام کی کٹوتی:'
                      : 'Monthly Exemption Days (Haidh Deduction):'}
                  </span>
                  <span className="font-bold text-white bg-rose-900/60 px-2 py-0.5 rounded">
                    {haidhDaysPerMonth} {language === 'ur' ? 'دن فی ماہ' : 'days/mo'}
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={haidhDaysPerMonth}
                  onChange={(e) => setHaidhDaysPerMonth(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <p className="text-[11px] text-rose-300/80 leading-relaxed">
                  {language === 'ur'
                    ? 'شرعی مسئلہ: ایامِ مخصوصہ میں چھوٹی ہوئی نمازوں کی قضاء نہیں ہوتی، لہٰذا یہ دن خودکار طور پر کل قضاء سے منہا کر دیے گئے ہیں۔'
                    : 'Islamic Fiqh Rule: Missed prayers during menstrual days are forgiven and NOT qaza. These days are automatically subtracted.'}
                </p>
              </div>
            )}

            {/* Duration Mode Inputs */}
            {calcMode === 'duration' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      {language === 'ur' ? 'کتنے سالوں کی نمازیں قضاء ہیں؟' : 'Years Missed:'}
                    </label>
                    <span className="text-sm font-bold text-emerald-400">{years} {language === 'ur' ? 'سال' : 'Years'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0 {language === 'ur' ? 'سال' : 'yr'}</span>
                    <span>10 {language === 'ur' ? 'سال' : 'yrs'}</span>
                    <span>20 {language === 'ur' ? 'سال' : 'yrs'}</span>
                    <span>30 {language === 'ur' ? 'سال' : 'yrs'}</span>
                    <span>40 {language === 'ur' ? 'سال' : 'yrs'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {language === 'ur' ? 'اضافی مہینے (Months)' : 'Extra Months'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={11}
                      value={months}
                      onChange={(e) => setMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {language === 'ur' ? 'اضافی دن (Days)' : 'Extra Days'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(Math.max(0, Math.min(30, Number(e.target.value))))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Age & Puberty Mode Inputs */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {language === 'ur' ? 'موجودہ عمر' : 'Current Age'}
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={100}
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {language === 'ur' ? 'بلوغت کی عمر' : 'Age of Puberty'}
                    </label>
                    <input
                      type="number"
                      min={12}
                      max={18}
                      value={pubertyAge}
                      onChange={(e) => setPubertyAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'عموماً 14 یا 15 سال' : 'Typically 14-15 yrs'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      {language === 'ur' ? 'پابندی شروع کرنے کی عمر' : 'Age Praying Regularly'}
                    </label>
                    <input
                      type="number"
                      min={pubertyAge}
                      max={currentAge}
                      value={regularPrayerAge}
                      onChange={(e) => setRegularPrayerAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-300">
                  <span>{language === 'ur' ? 'حساب شدہ غیر حاضر سال:' : 'Calculated Missed Years:'} </span>
                  <span className="font-bold text-emerald-400">
                    {Math.max(0, regularPrayerAge - pubertyAge)} {language === 'ur' ? 'سال' : 'years'}
                  </span>{' '}
                  <span className="text-slate-400">
                    ({regularPrayerAge} - {pubertyAge})
                  </span>
                </div>
              </div>
            )}

            {/* Witr Wajib Toggle */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  {language === 'ur' ? 'وتر واجب شامل کریں' : 'Include Missed Witr (وتر واجب)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'ur'
                    ? 'فقہ حنفی میں عشاء کے 3 وتر واجب کی بھی قضاء لازم ہے'
                    : 'According to Hanafi Fiqh, 3 Witr Wajib must also be made up'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeWitr(!includeWitr)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                  includeWitr ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                    includeWitr ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily Pace Selector */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'ur'
                    ? 'روزانہ کتنی قضاء نمازیں ادا کرنے کا ارادہ ہے؟'
                    : 'Target Qaza Prayers to Pray Daily:'}
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                  {dailyPace} {language === 'ur' ? 'نمازیں / دن' : 'prayers/day'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 5, 10, 15].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDailyPace(p)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      dailyPace === p
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p} {p === 5 && (language === 'ur' ? '(1 ہر فرض کے ساتھ)' : '(1/prayer)')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Result Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {language === 'ur' ? 'حساب کا خلاصہ' : 'Calculation Result'}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                {result.totalDaysMissed.toLocaleString()} {language === 'ur' ? 'کل ایام' : 'Days'}
              </span>
            </div>

            {/* Total Prayers Counter */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400">
                {language === 'ur' ? 'کل قضاء نمازیں' : 'Total Missed Prayers'}
              </span>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {result.totalPrayers.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400/80">
                {result.totalRakat.toLocaleString()} {language === 'ur' ? 'کل رکعات' : 'Total Rakat'}
              </div>
            </div>

            {/* Individual Breakdown Grid */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">
                {language === 'ur' ? 'نمازوں کی تفصیل:' : 'Breakdown per Prayer:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'witr'] as PrayerKey[]).map(
                  (key) => {
                    const meta = PRAYER_METADATA[key];
                    const count = result.prayersBreakdown[key];
                    if (key === 'witr' && !includeWitr) return null;
                    return (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-300">
                          {language === 'ur' ? meta.nameUr : meta.nameEn}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Completion Projection */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === 'ur' ? 'تخمینہ تکمیل تاریخ:' : 'Estimated Finish Date:'}
                </span>
              </div>
              <div className="text-white font-bold text-sm">
                {result.targetFinishDate}
              </div>
              <p className="text-[11px] text-slate-300">
                {language === 'ur'
                  ? `روزانہ ${dailyPace} نمازیں ادا کرنے سے تقریباً ${result.estimatedMonthsAtCurrentPace} ماہ میں مکمل ہوں گی۔`
                  : `At ${dailyPace} prayers/day, you will complete in approx ${result.estimatedMonthsAtCurrentPace} months.`}
              </p>
            </div>

            {/* Action button: Set as Tracker Baseline */}
            <button
              id="btn-apply-calculator-baseline"
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition active:scale-[0.99]"
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-200" />
                  <span>
                    {language === 'ur' ? 'ٹریکر میں محفوظ کر دیا گیا!' : 'Saved into Tracker!'}
                  </span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {language === 'ur' ? 'یہ تعداد ٹریکر میں سیٹ کریں' : 'Apply to Tracker as Target'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
