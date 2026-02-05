import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';
import type { ICommunity } from '../types/community.types';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import { RsvpStatus } from '../types/rsvp.types';

export const useEventDetails = (id: string | undefined) => {
    const { user } = useAuth();
    const [event, setEvent] = useState<IEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRsvpStatus, setUserRsvpStatus] = useState<RsvpStatus | undefined>(undefined);
    const [imageError, setImageError] = useState(false);

    const fetchEvent = useCallback(async () => {
        if (!id) return;
        try {
            const data = await eventApi.getById(id);
            setEvent(data);
            
            if (data.userRsvpStatus) {
                setUserRsvpStatus(data.userRsvpStatus);
            }
        } catch (error) {
            console.error('Failed to load event', error);
            toast.error('Failed to load event details');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    const handleRsvpChange = useCallback((status: RsvpStatus) => {
        setUserRsvpStatus(status);
        // Optimistic update
        setEvent(prev => {
            if (!prev) return null;
            let countChange = 0;
            if (status === 'GOING' && userRsvpStatus !== 'GOING') {
                countChange = 1;
            } else if (status === 'NOT_GOING' && userRsvpStatus === 'GOING') {
                countChange = -1;
            }
            return { ...prev, attendeeCount: Math.max(0, prev.attendeeCount + countChange) };
        });
    }, [userRsvpStatus]);

    const scrollToMap = useCallback(() => {
        const mapElement = document.getElementById('event-location-map');
        mapElement?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handlePhotoUpload = useCallback(async (url: string) => {
        if (!event || !url) return;
        try {
            await eventApi.uploadPhoto(event._id, url);
            const updated = await eventApi.getById(event._id);
            setEvent(updated);
            toast.success('Photo added to gallery');
        } catch (e) {
            console.error(e);
            toast.error('Failed to add photo');
        }
    }, [event]);

    // Permissions logic
    const isEventEnded = event ? new Date() > new Date(event.endDateTime) : false;
    const isOrganizer = event && user && (typeof event.organizer === 'string' ? event.organizer === user.id : event.organizer._id === user.id);
    const isCommunityAdmin = event && user && user.id && event.community && typeof event.community !== 'string' && ('admins' in event.community) && ((event.community as unknown as ICommunity).admins?.includes(user.id));
    const canManage = isOrganizer || isCommunityAdmin;
    const isAttendee = userRsvpStatus === 'GOING';

    return {
        event,
        isLoading,
        userRsvpStatus,
        imageError,
        setImageError,
        fetchEvent,
        handleRsvpChange,
        scrollToMap,
        handlePhotoUpload,
        permissions: {
            canManage,
            canUpload: event && isEventEnded && (canManage || isAttendee),
            isOrganizer,
            isEventEnded
        }
    };
};
