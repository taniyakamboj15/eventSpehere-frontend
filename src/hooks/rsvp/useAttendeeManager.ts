import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { rsvpApi } from '../../services/api/rsvp.api';
import type { IRsvp } from '../../types/rsvp.types';
import type { IUser } from '../../types/auth.types';
import { UI_TEXT } from '../../constants/text.constants';

interface UseAttendeeManagerProps {
    eventId?: string;
}

export const useAttendeeManager = ({ eventId: propEventId }: UseAttendeeManagerProps) => {
    const { id: paramAndId } = useParams<{ id: string }>();
    const eventId = propEventId || paramAndId;
    const [attendees, setAttendees] = useState<IRsvp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState<string | null>(null);

    const fetchAttendees = useCallback(async () => {
        if (!eventId) return;
        try {
            const data = await rsvpApi.getByEvent(eventId);
            setAttendees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchAttendees();
    }, [fetchAttendees]);

    const handleCheckIn = async (userId: string) => {
        if (!eventId) return;
        try {
            setCheckInLoading(userId);
            await rsvpApi.checkIn(eventId, userId);
            
            // Optimistic update
            setAttendees(prev => prev.map(rsvp => {
                 const u = rsvp.user as IUser;
                 if (u._id === userId) {
                     return { ...rsvp, checkedIn: true };
                 }
                 return rsvp;
            }));
            toast.success(UI_TEXT.CHECKED_IN_STATUS); // Or some success message
        } catch (error) {
             toast.error(UI_TEXT.CHECK_IN_FAILED);
        } finally {
            setCheckInLoading(null);
        }
    };

    return {
        attendees,
        isLoading,
        checkInLoading,
        fetchAttendees,
        handleCheckIn
    };
};
