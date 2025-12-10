export interface Settings {
  sessionLimitMinutes: number;
  recoveryRatio: number; // minutes of rest needed to recover 1 minute
  emergencyDurationMinutes: number;
  maxEmergenciesPerDay: number;
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD
  totalUsageMinutes: number;
  emergencyCount: number;
  emergencyMinutesUsed: number;
  timesLimitReached: number;
}

export interface UsageState {
  remainingMinutes: number;
  isActive: boolean;
  lastActiveTime: number | null;
  lastInactiveTime: number | null;
  todayUsage: DailyUsage;
}

export const DEFAULT_SETTINGS: Settings = {
  sessionLimitMinutes: 30,
  recoveryRatio: 2,
  emergencyDurationMinutes: 5,
  maxEmergenciesPerDay: 3,
};

export const SESSION_LIMIT_OPTIONS = [15, 20, 30, 45, 60];
export const RECOVERY_RATIO_OPTIONS = [
  { value: 1, label: '1:1 (1 min descanso = 1 min uso)' },
  { value: 2, label: '2:1 (2 min descanso = 1 min uso)' },
  { value: 3, label: '3:1 (3 min descanso = 1 min uso)' },
];
export const EMERGENCY_DURATION_OPTIONS = [5, 10, 15];
