import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.projectguardian',
  appName: 'Guardian',
  webDir: 'dist',
  server: {
    url: 'https://82afa7df-038a-4ddf-aac5-c9a8dedcc070.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
