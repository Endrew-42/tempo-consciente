import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f601264a8bf74a93bb7b59189f907494',
  appName: 'TempoEquilíbrio',
  webDir: 'dist',
  server: {
    url: 'https://f601264a-8bf7-4a93-bb7b-59189f907494.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
    },
  },
  android: {
    backgroundColor: '#0f172a',
  },
  ios: {
    backgroundColor: '#0f172a',
  },
};

export default config;
