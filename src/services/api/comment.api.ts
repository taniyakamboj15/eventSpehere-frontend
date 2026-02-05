import api from './axios';
import type { IComment } from '../../types/comment.types';

export const commentApi = {
    getByEvent: async (eventId: string, page = 1) => {
        const response = await api.get<{ success: boolean; data: { comments: IComment[], totalPages: number } }>(`/events/${eventId}/comments`, { params: { page } });
        return response.data.data;
    },

    create: async (eventId: string, message: string, parentId?: string) => {
        const response = await api.post<{ success: boolean; data: IComment }>(`/events/${eventId}/comments`, { message, parentId });
        return response.data.data;
    },

    delete: async (commentId: string) => {
        await api.delete(`/comments/${commentId}`);
    }
};
