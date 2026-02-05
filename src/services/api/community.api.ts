import api from './axios';
import { type ICommunity, CommunityType } from '../../types/community.types';
import type { IEvent } from '../../types/event.types';
import { type IUser } from '../../types/auth.types';

export const communityApi = {
    getAll: async (params?: { latitude?: number; longitude?: number; memberId?: string }) => {
        let url = '/communities';
        if (params?.memberId === 'me') {
            url = '/communities/my';
        }
        const response = await api.get<{ data: ICommunity[] }>(url, { params });
        return response.data.data;
    },

    create: async (data: { name: string; type: CommunityType; description: string; latitude: number; longitude: number }) => {
        const response = await api.post<{ data: ICommunity }>('/communities', {
            ...data,
            location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude]
            }
        });
        return response.data.data;
    },

    join: async (id: string) => {
        const response = await api.post<{ success: boolean }>(`/communities/${id}/join`);
        return response.data;
    },

    leave: async (id: string) => {
        const response = await api.post<{ success: boolean }>(`/communities/${id}/leave`);
        return response.data;
    },

    getEvents: async (id: string) => {
        const response = await api.get<{ data: IEvent[] }>(`/communities/${id}/events`);
        return response.data.data;
    },

    getMembers: async (id: string) => {
        const response = await api.get<{ data: { members: IUser[], admins: IUser[] } }>(`/communities/${id}/members`);
        return response.data.data;
    },

    removeMember: async (communityId: string, memberId: string) => {
        const response = await api.delete<{ success: boolean }>(`/communities/${communityId}/members/${memberId}`);
        return response.data;
    },

    invite: async (communityId: string, email: string) => {
        const response = await api.post<{ success: boolean; message: string }>(`/communities/${communityId}/invite`, { email });
        return response.data;
    }
};
