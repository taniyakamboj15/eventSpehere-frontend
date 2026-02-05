import api from './axios';
import type { ApiResponse } from '../../types/api.types';
import type { IUser } from '../../types/auth.types';

export const userApi = {
    requestUpgrade: async () => {
        const response = await api.post<ApiResponse<IUser>>('/users/upgrade-request');
        return response.data.data;
    },

    // Admin endpoints
    getPendingRequests: async () => {
        const response = await api.get<ApiResponse<IUser[]>>('/users/admin/upgrade-requests');
        return response.data.data;
    },

    approveUpgrade: async (userId: string) => {
        const response = await api.post<ApiResponse<IUser>>(`/users/admin/upgrade-requests/${userId}/approve`);
        return response.data.data;
    },

    rejectUpgrade: async (userId: string) => {
        const response = await api.post<ApiResponse<IUser>>(`/users/admin/upgrade-requests/${userId}/reject`);
        return response.data.data;
    }
};
