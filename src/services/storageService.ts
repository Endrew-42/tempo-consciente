import { Settings, DailyUsage, UsageState, DEFAULT_SETTINGS } from '@/models/types';
import { format } from 'date-fns';

const SETTINGS_KEY = 'tempo_settings';
const USAGE_STATE_KEY = 'tempo_usage_state';
const HISTORY_KEY = 'tempo_history';

export const storageService = {
  // Settings
  getSettings(): Settings {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  resetSettings(): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  },

  // Usage State
  getUsageState(): UsageState {
    const stored = localStorage.getItem(USAGE_STATE_KEY);
    const settings = this.getSettings();
    const today = format(new Date(), 'yyyy-MM-dd');

    const defaultState: UsageState = {
      remainingMinutes: settings.sessionLimitMinutes,
      isActive: false,
      lastActiveTime: null,
      lastInactiveTime: null,
      todayUsage: {
        date: today,
        totalUsageMinutes: 0,
        emergencyCount: 0,
        emergencyMinutesUsed: 0,
        timesLimitReached: 0,
      },
    };

    if (stored) {
      const parsed = JSON.parse(stored) as UsageState;
      // Reset if it's a new day
      if (parsed.todayUsage.date !== today) {
        // Save yesterday's data to history
        this.saveDailyUsage(parsed.todayUsage);
        return {
          ...defaultState,
          remainingMinutes: settings.sessionLimitMinutes,
        };
      }
      return parsed;
    }
    return defaultState;
  },

  saveUsageState(state: UsageState): void {
    localStorage.setItem(USAGE_STATE_KEY, JSON.stringify(state));
  },

  // History
  saveDailyUsage(usage: DailyUsage): void {
    const history = this.getHistory();
    const existingIndex = history.findIndex(h => h.date === usage.date);
    if (existingIndex >= 0) {
      history[existingIndex] = usage;
    } else {
      history.push(usage);
    }
    // Keep only last 30 days
    const sortedHistory = history
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sortedHistory));
  },

  getHistory(): DailyUsage[] {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getLastNDaysUsage(n: number): DailyUsage[] {
    const history = this.getHistory();
    return history.slice(0, n);
  },
};
