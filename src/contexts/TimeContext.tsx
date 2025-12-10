import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TimeManager } from '@/services/timeManager';
import { UsageState, Settings } from '@/models/types';
import { storageService } from '@/services/storageService';

interface TimeContextType {
  state: UsageState;
  settings: Settings;
  isBlocked: boolean;
  startSession: () => void;
  pauseSession: () => void;
  useEmergency: () => boolean;
  updateSettings: (settings: Settings) => void;
  resetSettings: () => void;
  dismissBlock: () => void;
  emergenciesRemaining: number;
}

const TimeContext = createContext<TimeContextType | null>(null);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [state, setState] = useState<UsageState | null>(null);
  const [settings, setSettings] = useState<Settings>(storageService.getSettings());
  const managerRef = useRef<TimeManager | null>(null);

  const handleLimitReached = useCallback(() => {
    setIsBlocked(true);
  }, []);

  useEffect(() => {
    const manager = new TimeManager(setState, handleLimitReached);
    managerRef.current = manager;
    setState(manager.getState());

    const interval = setInterval(() => {
      manager.tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [handleLimitReached]);

  const startSession = useCallback(() => {
    managerRef.current?.startSession();
  }, []);

  const pauseSession = useCallback(() => {
    managerRef.current?.pauseSession();
  }, []);

  const useEmergency = useCallback(() => {
    const success = managerRef.current?.useEmergency() ?? false;
    if (success) {
      setIsBlocked(false);
    }
    return success;
  }, []);

  const updateSettings = useCallback((newSettings: Settings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    managerRef.current?.refreshSettings();
  }, []);

  const resetSettings = useCallback(() => {
    storageService.resetSettings();
    const defaultSettings = storageService.getSettings();
    setSettings(defaultSettings);
    managerRef.current?.refreshSettings();
  }, []);

  const dismissBlock = useCallback(() => {
    setIsBlocked(false);
    pauseSession();
  }, [pauseSession]);

  const emergenciesRemaining = managerRef.current?.getEmergenciesRemaining() ?? 0;

  if (!state) return null;

  return (
    <TimeContext.Provider
      value={{
        state,
        settings,
        isBlocked,
        startSession,
        pauseSession,
        useEmergency,
        updateSettings,
        resetSettings,
        dismissBlock,
        emergenciesRemaining,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
