import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export const capacitorService = {
  async initialize() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Configure status bar for dark theme
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0f172a' });

      // Hide splash screen after app is ready
      await SplashScreen.hide();
    } catch (error) {
      console.error('Capacitor initialization error:', error);
    }
  },

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  },

  getPlatform(): string {
    return Capacitor.getPlatform();
  },

  // Handle back button on Android
  setupBackButton(callback: () => void) {
    if (!Capacitor.isNativePlatform()) return;

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        callback();
      }
    });
  },

  // Handle app state changes (foreground/background)
  setupAppStateListener(
    onForeground: () => void,
    onBackground: () => void
  ) {
    if (!Capacitor.isNativePlatform()) return;

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        onForeground();
      } else {
        onBackground();
      }
    });
  },
};
