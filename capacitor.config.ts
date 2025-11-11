import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3eff40be906e4a35b679ab63527eda85',
  appName: 'dream-ink',
  webDir: 'dist',
  server: {
    url: 'https://3eff40be-906e-4a35-b679-ab63527eda85.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
