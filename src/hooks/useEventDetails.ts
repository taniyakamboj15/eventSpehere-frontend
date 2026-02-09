import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';
import { toast } from 'react-hot-toast';
import { RsvpStatus } from '../types/rsvp.types';
import { usePermissions } from './utils/usePermissions';

export const useEventDetails = (id: string | undefined, initialData?: IEvent | null) => {
    const [event, setEvent] = useState<IEvent | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [userRsvpStatus, setUserRsvpStatus] = useState<RsvpStatus | undefined>(initialData?.userRsvpStatus || undefined);
    const [imageError, setImageError] = useState(false);
    
    const { getEventPermissions } = usePermissions();

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
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!initialData) {
            fetchEvent();
        }
    }, [fetchEvent, initialData]);

    const handleRsvpChange = useCallback((status: RsvpStatus) => {
        setUserRsvpStatus(status);
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

    // Delegated permissions
    const permissions = useMemo(() => getEventPermissions(event, userRsvpStatus), [event, userRsvpStatus, getEventPermissions]);

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
        permissions
    };
};
