import axios from 'axios';
import { APP_CONFIG } from '../../constants/app.config';
import { store } from '../../store/store';
import { logout, setCredentials } from '../../store/authSlice';

const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
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
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
