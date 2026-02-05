import api from './axios';
import { type IEvent, EventCategory } from '../../types/event.types';
import type { PaginatedResponse } from '../../types/api.types';

export interface GetEventsParams {
  page?: number;
  limit?: number;
  category?: EventCategory;
  search?: string;
  organizer?: string;
  lat?: number;
  lng?: number;
  radius?: number; // in km
  time?: 'UPCOMING' | 'PAST' | 'ALL';
}

export const eventApi = {
  getAll: async (params: GetEventsParams = {}) => {
    const response = await api.get<PaginatedResponse<IEvent>>('/events', { params });
    // Backend now returns { data: [...], meta: {...} } inside the 'data' field of ApiResponse
    // But ApiResponse structure is { success, message, statusCode, data }
    // So response.data.data is { data: IEvent[], meta: ... }
    return response.data; // Return full ApiResponse to access meta
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: IEvent }>(`/events/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<IEvent>) => {
    const response = await api.post<{ success: boolean; data: IEvent }>('/events', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<IEvent>) => {
    const response = await api.patch<{ success: boolean; data: IEvent }>(`/events/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: null }>(`/events/${id}`);
    return response.data;
  },

  uploadPhoto: async (id: string, url: string) => {
    const response = await api.post<{ success: boolean; data: IEvent }>(`/events/${id}/photos`, { url });
    return response.data.data;
  },
};
