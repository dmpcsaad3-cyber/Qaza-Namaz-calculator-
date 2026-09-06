import React, { useState } from 'react';
import {
  Tv,
  BookOpen,
  HeartHandshake,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from 'lucide-react';

interface DawatEIslamiSectionProps {
  language: 'ur' | 'en';
}

export const DawatEIslamiSection: React.FC<DawatEIslamiSectionProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const ads = [
    {
      id: 'madani-channel',
      icon: Tv,
      titleUr: 'مدنی چینل (Madani Channel)',
      titleEn: 'Madani Channel Live',
      descUr: '100% اسلامی چینل — براہِ راست اصلاحی بیانات، تلاوتِ قرآن اور نعتیں سنیں۔',
      descEn: '100% Islamic Channel — Live Islamic speeches, Quran recitations & naats.',
      badgeUr: 'لائیو نشریات',
      badgeEn: 'Live Broadcast',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      actionTextUr: 'مدنی چینل دیکھیں',
      actionTextEn: 'Watch Live',
      link: 'https://www.dawateislami.net/madanichannel/',
    },
    {
      id: 'darulifta',
      icon: BookOpen,
      titleUr: 'دار الافتاء اہلسنت (فتاویٰ و مسائل)',
      titleEn: 'Dar-ul-Ifta Ahlesunnat (Fatwas)',
      descUr: 'قضاء نمازوں کے شرعی مسائل، احکام اور مفتیانِ کرام سے مستند فتاویٰ حاصل کریں۔',
      descEn: 'Authentic Islamic rulings & Fatwas regarding Qaza Namaz and daily fiqh.',
      badgeUr: 'شرعی رہنمائی',
      badgeEn: 'Shariah Guidance',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      actionTextUr: 'فتاویٰ حاصل کریں',
      actionTextEn: 'Read Fatwas',
      link: 'https://daruliftaahlesunnat.net/',
    },
    {
      id: 'fgrf',
      icon: HeartHandshake,
      titleUr: 'FGRF — فیضان گلوبل ریلیف فاؤنڈیشن',
      titleEn: 'FGRF Global Relief Foundation',
      descUr: 'دکھی انسانیت کی خدمت، راشن، پینے کے صاف پانی اور آفات زدگان کے لیے صدقات و زکوٰۃ دیں۔',
      descEn: 'Humanitarian relief, ration packs, clean water projects, and disaster aid donations.',
      badgeUr: 'کارِ خیر و عطیات',
      badgeEn: 'Charity & Relief',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      actionTextUr: 'عطیات / صدقہ دیں',
      actionTextEn: 'Donate / Support',
      link: 'https://fgrf.org/',
    },
    {
      id: 'quran-academy',
      icon: GraduationCap,
      titleUr: 'فیضان آن لائن اکیڈمی (قرآن و نماز کورس)',
      titleEn: 'Faizan Online Quran Academy',
      descUr: 'گھر بیٹھے اپنے بچوں اور خود کو درست تجوید کے ساتھ قرآن پاک اور نماز سکھائیں۔',
      descEn: 'Learn Quran recitation with proper tajweed and essential prayer courses online.',
      badgeUr: 'آن لائن داخلہ',
      badgeEn: 'Online Admission',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      actionTextUr: 'آن لائن داخلہ لیں',
      actionTextEn: 'Enroll Online',
      link: 'https://www.dawateislami.net/education/',
    },
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {language === 'ur' ? 'دعوتِ اسلامی — دینی خدمات و اعلانات' : 'Dawat-e-Islami — Islamic Services'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {language === 'ur' ? 'کارِ خیر' : 'Official'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ur'
                ? 'مدنی چینل، دار الافتاء اہلسنت، فیضان ریلیف اور آن لائن قرآن اکیڈمی'
                : 'Madani Channel, Dar-ul-Ifta, FGRF relief, and Online Quran courses'}
            </p>
          </div>
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
          aria-label="Toggle Dawat-e-Islami Section"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Grid */}
      {isExpanded && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {ads.map((ad) => {
              const Icon = ad.icon;
              return (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 transition flex flex-col justify-between gap-3 group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition">
                          {language === 'ur' ? ad.titleUr : ad.titleEn}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ad.badgeColor}`}>
                        {language === 'ur' ? ad.badgeUr : ad.badgeEn}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'ur' ? ad.descUr : ad.descEn}
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-semibold text-xs transition duration-150"
                    >
                      <span>{language === 'ur' ? ad.actionTextUr : ad.actionTextEn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice footer */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/70 text-slate-400 text-[11px]">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <p>
              {language === 'ur'
                ? 'تمام لنکس دعوتِ اسلامی کے آفیشل پورٹل پر کھلیں گے۔ قضاء نمازوں کا حساب لگانے کے بعد روزانہ ادائیگی کے لیے استقامت سے عمل کریں۔'
                : 'All links connect to official Dawat-e-Islami web services. Practice consistency in making up missed prayers daily.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
