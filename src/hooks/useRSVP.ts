import { useFetcher } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { RsvpStatus } from '../types/rsvp.types';

export const useRSVP = (eventId: string, currentStatus?: RsvpStatus, onStatusChange?: (status: RsvpStatus) => void) => {
    const fetcher = useFetcher();
    
    const optimisticStatus = fetcher.formData?.get('status') as RsvpStatus | undefined;
    const status = optimisticStatus || currentStatus || RsvpStatus.NOT_GOING;
    const isLoading = fetcher.state !== 'idle';

    const handleRsvp = useCallback((newStatus: RsvpStatus) => {
        const formData = new FormData();
        formData.append('status', newStatus);
        fetcher.submit(formData, { 
            method: 'post', 
            action: `/events/${eventId}` 
        });
        onStatusChange?.(newStatus);
    }, [eventId, fetcher, onStatusChange]);

    return useMemo(() => ({
        status,
        isLoading,
        handleRsvp
    }), [status, isLoading, handleRsvp]);
};
