import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '../../constants/app.config';
import { store } from '../../store/store';
import { logout, setCredentials } from '../../store/authSlice';
import toast from 'react-hot-toast';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});


api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
      return Promise.reject(new Error('Network error'));
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
      return Promise.reject(error);
    }
    
    // Check if error is 401 and not a retry and not a login request
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${APP_CONFIG.API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Update store
        store.dispatch(setCredentials({ user: data.data.user, accessToken: data.data.accessToken }));

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        store.dispatch(logout());
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    // Handle other HTTP errors
    const message = error.response?.data?.message || 'An error occurred';
    
    // Don't show toast for 401 errors (handled above)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

