import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.custocerto.app',
  appName: 'CustoCerto',
  webDir: 'out',
  server: {
    hostname: 'custocerto.app',
    androidScheme: 'https'
  }
};

export default config;
