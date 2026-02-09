import api from './axios';
import type { AuthResponse } from '../../types/auth.types';
import type { ApiResponse } from '../../types/api.types';

import * as Yup from 'yup';
import { loginSchema, registerSchema } from '../../validators/auth.schema';

export type LoginDTO = Yup.InferType<typeof loginSchema>;
export type RegisterDTO = Yup.InferType<typeof registerSchema>;

export const authApi = {
  login: async (data: LoginDTO) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },
  
  register: async (data: RegisterDTO) => {
    const response = await api.post<ApiResponse<null>>('/auth/register', data);
    return response.data.data;
  },

  verifyEmail: async (data: { email: string; token: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/verify-email', data);
    return response.data.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data.data;
  },

  refresh: async () => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return response.data.data;
  },

  getCurrentUser: async () => {
     // If backend supports /auth/me or verify token
     // Auth API implementation
  }
};
