export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'witr';

export interface PrayerItem {
  key: PrayerKey;
  nameEn: string;
  nameUr: string;
  rakat: number;
  rakatTypeEn: string;
  rakatTypeUr: string;
  color: string;
  bgLight: string;
  borderLight: string;
  totalQaza: number;
  completed: number;
}

export interface QazaState {
  prayers: Record<PrayerKey, { total: number; completed: number }>;
  dailyGoal: number; // e.g. 5 prayers per day
  streakDays: number;
  lastLoggedDate: string; // YYYY-MM-DD
  todayLoggedCount: number;
  history: HistoryEntry[];
  settings: {
    includeWitr: boolean;
    gender: 'male' | 'female';
    language: 'ur' | 'en';
    dailyPace: number; // prayers per day planned
    showUrduText: boolean;
  };
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  prayerKey?: PrayerKey;
  prayerNameEn?: string;
  prayerNameUr?: string;
  count: number;
  action: 'increment' | 'decrement' | 'full_day';
  note?: string;
}

export interface CalculationResult {
  totalDaysMissed: number;
  years: number;
  months: number;
  days: number;
  prayersBreakdown: Record<PrayerKey, number>;
  totalPrayers: number;
  totalRakat: number;
  estimatedMonthsAtCurrentPace: number;
  targetFinishDate: string;
}
