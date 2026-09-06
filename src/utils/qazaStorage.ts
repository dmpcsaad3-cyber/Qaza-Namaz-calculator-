import { QazaState, PrayerKey, HistoryEntry } from '../types';

const STORAGE_KEY = 'qaza_namaz_tracker_data_v1';

export const PRAYER_METADATA: Record<
  PrayerKey,
  {
    nameEn: string;
    nameUr: string;
    rakat: number;
    rakatTypeEn: string;
    rakatTypeUr: string;
    color: string;
    accentHex: string;
    gradient: string;
  }
> = {
  fajr: {
    nameEn: 'Fajr',
    nameUr: 'فجر',
    rakat: 2,
    rakatTypeEn: 'Farz',
    rakatTypeUr: 'فرض',
    color: 'amber',
    accentHex: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
  dhuhr: {
    nameEn: 'Dhuhr',
    nameUr: 'ظہر',
    rakat: 4,
    rakatTypeEn: 'Farz',
    rakatTypeUr: 'فرض',
    color: 'emerald',
    accentHex: '#10b981',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  asr: {
    nameEn: 'Asr',
    nameUr: 'عصر',
    rakat: 4,
    rakatTypeEn: 'Farz',
    rakatTypeUr: 'فرض',
    color: 'teal',
    accentHex: '#14b8a6',
    gradient: 'from-teal-500/20 to-teal-600/5',
  },
  maghrib: {
    nameEn: 'Maghrib',
    nameUr: 'مغرب',
    rakat: 3,
    rakatTypeEn: 'Farz',
    rakatTypeUr: 'فرض',
    color: 'rose',
    accentHex: '#f43f5e',
    gradient: 'from-rose-500/20 to-rose-600/5',
  },
  isha: {
    nameEn: 'Isha',
    nameUr: 'عشاء',
    rakat: 4,
    rakatTypeEn: 'Farz',
    rakatTypeUr: 'فرض',
    color: 'indigo',
    accentHex: '#6366f1',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
  },
  witr: {
    nameEn: 'Witr',
    nameUr: 'وتر واجب',
    rakat: 3,
    rakatTypeEn: 'Wajib',
    rakatTypeUr: 'واجب',
    color: 'cyan',
    accentHex: '#06b6d4',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
};

export const INITIAL_STATE: QazaState = {
  prayers: {
    fajr: { total: 365, completed: 18 },
    dhuhr: { total: 365, completed: 15 },
    asr: { total: 365, completed: 12 },
    maghrib: { total: 365, completed: 20 },
    isha: { total: 365, completed: 14 },
    witr: { total: 365, completed: 10 },
  },
  dailyGoal: 5,
  streakDays: 3,
  lastLoggedDate: new Date().toISOString().split('T')[0],
  todayLoggedCount: 2,
  history: [
    {
      id: 'init-1',
      timestamp: Date.now() - 3600000 * 2,
      dateStr: new Date().toISOString().split('T')[0],
      prayerKey: 'fajr',
      prayerNameEn: 'Fajr',
      prayerNameUr: 'فجر',
      count: 1,
      action: 'increment',
      note: 'After Fajr Farz',
    },
    {
      id: 'init-2',
      timestamp: Date.now() - 3600000,
      dateStr: new Date().toISOString().split('T')[0],
      prayerKey: 'dhuhr',
      prayerNameEn: 'Dhuhr',
      prayerNameUr: 'ظہر',
      count: 1,
      action: 'increment',
      note: 'After Dhuhr Farz',
    },
  ],
  settings: {
    includeWitr: true,
    gender: 'male',
    language: 'ur',
    dailyPace: 5,
    showUrduText: true,
  },
};

export function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadQazaState(): QazaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as QazaState;
    const today = getTodayDateStr();

    // Check streak & todayLoggedCount reset if new day
    if (parsed.lastLoggedDate !== today) {
      const lastDate = new Date(parsed.lastLoggedDate);
      const todayDate = new Date(today);
      const diffDays = Math.round(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      );

      // If more than 1 day passed without logging, streak resets to 0 (unless no action yet)
      let streak = parsed.streakDays || 0;
      if (diffDays > 1) {
        streak = 0;
      }
      return {
        ...parsed,
        todayLoggedCount: 0,
        streakDays: streak,
        lastLoggedDate: parsed.lastLoggedDate,
      };
    }
    return parsed;
  } catch (e) {
    console.error('Error reading localStorage for Qaza state:', e);
    return INITIAL_STATE;
  }
}

export function saveQazaState(state: QazaState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving Qaza state to localStorage:', e);
  }
}

export function exportDataAsJson(state: QazaState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `qaza-namaz-backup-${getTodayDateStr()}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
