import { Settings, UsageState } from '@/models/types';
import { storageService } from './storageService';
import { format } from 'date-fns';

export class TimeManager {
  private state: UsageState;
  private settings: Settings;
  private onStateChange: (state: UsageState) => void;
  private onLimitReached: () => void;

  constructor(
    onStateChange: (state: UsageState) => void,
    onLimitReached: () => void
  ) {
    this.settings = storageService.getSettings();
    this.state = storageService.getUsageState();
    this.onStateChange = onStateChange;
    this.onLimitReached = onLimitReached;
  }

  getState(): UsageState {
    return this.state;
  }

  getSettings(): Settings {
    return this.settings;
  }

  refreshSettings(): void {
    this.settings = storageService.getSettings();
  }

  startSession(): void {
    const now = Date.now();
    
    // Calculate recovery if coming from inactive state
    if (this.state.lastInactiveTime && !this.state.isActive) {
      this.applyRecovery();
    }

    this.state = {
      ...this.state,
      isActive: true,
      lastActiveTime: now,
      lastInactiveTime: null,
    };
    
    this.saveAndNotify();
  }

  pauseSession(): void {
    this.state = {
      ...this.state,
      isActive: false,
      lastInactiveTime: Date.now(),
    };
    
    this.saveAndNotify();
  }

  tick(): void {
    if (!this.state.isActive || !this.state.lastActiveTime) return;

    const now = Date.now();
    const elapsedMinutes = (now - this.state.lastActiveTime) / 60000;

    if (elapsedMinutes >= 1) {
      const minutesToDeduct = Math.floor(elapsedMinutes);
      
      this.state = {
        ...this.state,
        remainingMinutes: Math.max(0, this.state.remainingMinutes - minutesToDeduct),
        lastActiveTime: now,
        todayUsage: {
          ...this.state.todayUsage,
          totalUsageMinutes: this.state.todayUsage.totalUsageMinutes + minutesToDeduct,
        },
      };

      if (this.state.remainingMinutes <= 0) {
        this.state = {
          ...this.state,
          isActive: false,
          todayUsage: {
            ...this.state.todayUsage,
            timesLimitReached: this.state.todayUsage.timesLimitReached + 1,
          },
        };
        this.saveAndNotify();
        this.onLimitReached();
        return;
      }

      this.saveAndNotify();
    }
  }

  private applyRecovery(): void {
    if (!this.state.lastInactiveTime) return;

    const now = Date.now();
    const inactiveMinutes = (now - this.state.lastInactiveTime) / 60000;
    const recoveredMinutes = Math.floor(inactiveMinutes / this.settings.recoveryRatio);
    
    this.state = {
      ...this.state,
      remainingMinutes: Math.min(
        this.settings.sessionLimitMinutes,
        this.state.remainingMinutes + recoveredMinutes
      ),
    };
  }

  useEmergency(): boolean {
    if (this.state.todayUsage.emergencyCount >= this.settings.maxEmergenciesPerDay) {
      return false;
    }

    this.state = {
      ...this.state,
      remainingMinutes: this.settings.emergencyDurationMinutes,
      isActive: true,
      lastActiveTime: Date.now(),
      todayUsage: {
        ...this.state.todayUsage,
        emergencyCount: this.state.todayUsage.emergencyCount + 1,
        emergencyMinutesUsed: 
          this.state.todayUsage.emergencyMinutesUsed + this.settings.emergencyDurationMinutes,
      },
    };

    this.saveAndNotify();
    return true;
  }

  getEmergenciesRemaining(): number {
    return this.settings.maxEmergenciesPerDay - this.state.todayUsage.emergencyCount;
  }

  resetToday(): void {
    const today = format(new Date(), 'yyyy-MM-dd');
    this.state = {
      remainingMinutes: this.settings.sessionLimitMinutes,
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
    this.saveAndNotify();
  }

  private saveAndNotify(): void {
    storageService.saveUsageState(this.state);
    storageService.saveDailyUsage(this.state.todayUsage);
    this.onStateChange(this.state);
  }
}
