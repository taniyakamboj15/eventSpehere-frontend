import api from './axios';
import type { INotification } from '../../types/notification.types';

export const notificationApi = {
    getAll: async () => {
        const response = await api.get<{ data: { notifications: INotification[], unreadCount: number } }>('/notifications');
        return response.data.data;
    },
    markAsRead: async (id: string) => {
        const response = await api.put<{ data: { success: boolean; data: INotification } }>(`/notifications/${id}/read`);
        return response.data.data;
    },
    markAllAsRead: async () => {
        const response = await api.put<{ data: { success: boolean } }>('/notifications/read-all');
        return response.data.data;
    }
};
