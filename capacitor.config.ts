import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ios-problem',
  webDir: 'www/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
