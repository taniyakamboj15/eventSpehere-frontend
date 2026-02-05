import api from './axios';
import { RsvpStatus, type IRsvp } from '../../types/rsvp.types';

export const rsvpApi = {
  create: async (eventId: string, status: RsvpStatus) => {
    const response = await api.post<{ success: boolean; data: IRsvp }>(`/events/${eventId}/rsvp`, { status });
    return response.data.data;
  },

  getByEvent: async (eventId: string) => {
    const response = await api.get<{ success: boolean; data: IRsvp[] }>(`/events/${eventId}/attendees`);
    return response.data.data;
  },

  checkIn: async (eventId: string, userId: string) => {
    const response = await api.post(`/events/${eventId}/checkin/${userId}`);
    return response.data;
  },

  getMyRsvps: async () => {
    const response = await api.get<{ success: boolean; data: IRsvp[] }>('/events/my-rsvps');
    return response.data.data;
  },

  scanTicket: async (eventId: string, ticketCode: string) => {
      const response = await api.post(`/events/${eventId}/scan`, { ticketCode });
      return response.data;
  }
};
