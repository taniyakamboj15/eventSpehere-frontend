import { type ActionFunctionArgs } from 'react-router-dom';
import { rsvpApi } from '../../services/api/rsvp.api';
import { AxiosError } from 'axios';
import { RsvpStatus } from '../../types/rsvp.types';

export const rsvpAction = async ({ request, params }: ActionFunctionArgs) => {
    const eventId = params.id;
    if (!eventId) return { success: false, error: 'Missing event ID' };

    try {
        const formData = await request.formData();
        const status = formData.get('status') as RsvpStatus;
        await rsvpApi.create(eventId, status);
        return { success: true, status };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return { success: false, error: error.response?.data?.message || 'RSVP failed' };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};
