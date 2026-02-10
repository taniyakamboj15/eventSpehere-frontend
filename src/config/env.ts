/**
 * Type-safe environment configuration
 * Validates and exports environment variables for the frontend application
 */

interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
  enableAnalytics: boolean;
}

function validateEnv(): EnvironmentConfig {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error('❌ VITE_API_URL is not defined in environment variables');
    throw new Error('Missing required environment variable: VITE_API_URL');
  }

  return {
    apiUrl,
    appName: import.meta.env.VITE_APP_NAME || 'EventSphere',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  };
}

// Validate and export environment configuration
export const env = validateEnv();

// Log configuration in development
if (env.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: env.apiUrl,
    appName: env.appName,
    mode: env.isDevelopment ? 'development' : 'production',
  });
}
