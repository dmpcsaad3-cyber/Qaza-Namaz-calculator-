import React from 'react';
import { X, BookOpen, Clock, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface QazaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ur' | 'en';
}

export const QazaGuideModal: React.FC<QazaGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-900/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'ur'
                  ? 'قضاء نماز کا آسان طریقہ اور ضروری مسائل'
                  : 'Qaza Prayers Guide & Authentic Rulings'}
              </h2>
              <p className="text-xs text-amber-400">
                {language === 'ur'
                  ? 'قضاءِ عمری کو جلد اور آسانی سے ادا کرنے کی شرعی سہولیات'
                  : 'Islamic jurisprudence concessions for completing missed prayers'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-qaza-guide"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-200 text-sm">
          {/* Quick Method Card */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-base">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>
                {language === 'ur'
                  ? 'قضاءِ عمری کو جلد ادا کرنے کا آسان طریقہ (تخفیف کی سہولت)'
                  : 'Concessions for Speeding Up Qaza-e-Umri'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'فقہائے کرام نے ان افراد کے لیے جن کے ذمہ سالہا سال کی قضاء نمازیں ہوں، آسانی اور جلد ادائیگی کے لیے درج ذیل رعایتیں دی ہیں تاکہ انسان جلد از جلد قرض سے سبکدوش ہو سکے:'
                : 'For individuals with many months or years of missed prayers, classical jurists have highlighted valid sunnah/wajib concessions to facilitate completing them without undue hardship:'}
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>
                    {language === 'ur'
                      ? 'تیسری اور چوتھی رکعت میں سورۂ فاتحہ کی جگہ:'
                      : 'In 3rd & 4th Rakat of Farz:'}
                  </strong>{' '}
                  {language === 'ur'
                    ? 'چار رکعت والے فرض (ظہر، عصر، عشاء) کی آخری دو رکعتوں میں پوری سورہ فاتحہ کے بجائے صرف تین مرتبہ "سبحان اللہ" کہہ کر رکوع میں جانا جائز ہے۔'
                    : 'In the 3rd and 4th rakats of 4-rakat Farz prayers, one may say "Subhan Allah" three times instead of reciting Surah Al-Fatiha.'}
                </div>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>
                    {language === 'ur' ? 'رکوع اور سجدہ کی تسبیح:' : 'Ruku & Sujood Tasbeeh:'}
                  </strong>{' '}
                  {language === 'ur'
                    ? 'رکوع اور سجدے میں کم از کم ایک مرتبہ اطمینان سے "سبحان ربی العظیم" اور "سبحان ربی الاعلیٰ" کہہ لینے سے بھی فرض و واجب ادا ہو جاتا ہے۔'
                    : 'Saying "Subhana Rabbiyal Azeem" (in ruku) and "Subhana Rabbiyal A\'la" (in sujood) at least once with stillness fulfills the minimum requirement.'}
                </div>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>
                    {language === 'ur' ? 'قعدہ اخیرہ میں مختصر درود:' : 'Final Sitting (Qa\'dah):'}
                  </strong>{' '}
                  {language === 'ur'
                    ? 'التحیات کے بعد درودِ پاک کے الفاظ "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّآلِهٖ" تک پڑھ کر مختصر دعا "رَبِّ اغْفِرْ لِی" پڑھ کر سلام پھیر سکتے ہیں۔'
                    : 'After Tashahhud, one can recite the concise Salawat "Allahumma Salli \'ala Muhammadin wa Aalih" and the short supplication "Rabbighfir li" before making Salam.'}
                </div>
              </li>

              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>
                    {language === 'ur' ? 'وتر میں دعائے قنوت کا نعم البدل:' : 'In Witr (Dua-e-Qunoot):'}
                  </strong>{' '}
                  {language === 'ur'
                    ? 'اگر لمبی دعائے قنوت یاد نہ ہو یا جلدی ہو تو "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً..." یا تین مرتبہ "اللّٰهُمَّ اغْفِرْ لِی" پڑھنا کافی ہے۔'
                    : 'If one has not memorized the full Dua-e-Qunoot or needs brevity, reciting "Rabbana Atina fid-dunya hasanah..." or 3 times "Allahummaghfir li" is sufficient.'}
                </div>
              </li>
            </ul>
          </div>

          {/* Prohibited Times */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>
                {language === 'ur'
                  ? 'مکروہ اوقات (جن میں قضاء نماز پڑھنا منع ہے)'
                  : 'Prohibited / Makrooh Times (Do NOT pray Qaza)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'دن رات میں صرف 3 اوقات ایسے ہیں جن میں قضاء نماز ادا نہیں کی جا سکتی:'
                : 'There are only 3 specific times during the day in which Qaza prayer is prohibited:'}
            </p>
            <ul className="text-xs text-rose-200/90 list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>{language === 'ur' ? 'طلوعِ آفتاب:' : 'Sunrise:'}</strong>{' '}
                {language === 'ur'
                  ? 'سورج نکلنے سے لے کر تقریباً 15-20 منٹ بعد تک (جب تک دھوپ تیز نہ ہو جائے)۔'
                  : 'From when the sun begins to rise until approximately 15-20 minutes after sunrise.'}
              </li>
              <li>
                <strong>{language === 'ur' ? 'استواء / زوال:' : 'Zawaal / Midday Peak:'}</strong>{' '}
                {language === 'ur'
                  ? 'ٹھیک دوپہر کے وقت جب سورج عین سر پر ہو (ظہر کے وقت سے تقریباً 5-10 منٹ پہلے)۔'
                  : 'Exact midday zenith (~5 to 10 minutes prior to Dhuhr start).'}
              </li>
              <li>
                <strong>{language === 'ur' ? 'غروبِ آفتاب:' : 'Sunset:'}</strong>{' '}
                {language === 'ur'
                  ? 'مغرب کی اذان سے 15-20 منٹ پہلے جب سورج کی زردی اور تمازت ختم ہو رہی ہو (سوائے اسی دن کی عصر کے)۔'
                  : '15-20 minutes before Maghrib adhan as the sun turns pale yellow.'}
              </li>
            </ul>
            <p className="text-xs text-emerald-400 pt-1">
              {language === 'ur'
                ? 'ان 3 اوقات کے علاوہ رات اور دن کے کسی بھی حصے میں قضاء نماز پڑھی جا سکتی ہے (فجر کے بعد اور عصر کے بعد بھی گھر میں تنہائی میں قضاء پڑھنا جائز ہے)۔'
                : 'Aside from these 3 prohibited times, Qaza can be prayed at any time of day or night, even in the morning or after Asr in privacy.'}
            </p>
          </div>

          {/* Niyyah (Intention) Formula */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'ur'
                  ? 'قضاء نماز کی نیت کا آسان طریقہ'
                  : 'Intention (Niyyah) for Missed Prayers'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'ur' ? (
                <>
                  اگر بہت سی نمازیں قضاء ہوں تو ہر نماز کے وقت دل میں یہ نیت کریں:<br />
                  <span className="text-emerald-400 font-semibold block my-1">
                    "میں اپنے ذمے باقی نمازوں میں سے سب سے پہلی (یا سب سے آخری) فجر / ظہر / عصر / مغرب / عشاء / وتر کی قضاء نماز ادا کر رہا/رہی ہوں۔"
                  </span>
                  عربی الفاظ بولنا ضروری نہیں، دل کا ارادہ ہی نیت ہے۔
                </>
              ) : (
                <>
                  When you have many missed prayers, formulate your intention as follows:<br />
                  <span className="text-emerald-400 font-semibold block my-1">
                    "I intend to pray the first (or earliest) missed Farz of [Fajr/Dhuhr/Asr/Maghrib/Isha/Witr] that is due upon me."
                  </span>
                  Vocalizing in Arabic is not required; firm resolve in the heart is the essence of Niyyah.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition"
          >
            {language === 'ur' ? 'ٹھیک ہے (بند کریں)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
