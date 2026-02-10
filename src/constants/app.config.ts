import { env } from '../config/env';

export const APP_CONFIG = {
  API_URL: `${env.apiUrl}/api`,
  APP_NAME: env.appName,
  ENABLE_ANALYTICS: env.enableAnalytics,
} as const;
