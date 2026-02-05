import { useState, memo, useCallback } from 'react';
import { RsvpStatus } from '../types/rsvp.types';
import { rsvpApi } from '../services/api/rsvp.api';
import Button from './Button';

interface RSVPButtonProps {
    eventId: string;
    currentStatus?: RsvpStatus;
    onStatusChange?: (status: RsvpStatus) => void;
    isFull?: boolean;
}

const RSVPButton = memo(({ eventId, currentStatus, onStatusChange, isFull }: RSVPButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleRsvp = useCallback(async (status: RsvpStatus) => {
        try {
            setIsLoading(true);
            await rsvpApi.create(eventId, status);
            onStatusChange?.(status);
        } catch (error) {
            console.error('RSVP failed', error);
            alert('Failed to update RSVP');
        } finally {
            setIsLoading(false);
        }
    }, [eventId, onStatusChange]);

    if (currentStatus === RsvpStatus.GOING) {
         return (
            <div className="flex gap-2">
                <Button variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
                     ✓ Going
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRsvp(RsvpStatus.NOT_GOING)}
                    isLoading={isLoading}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <Button 
            onClick={() => handleRsvp(RsvpStatus.GOING)} 
            isLoading={isLoading}
            disabled={isFull}
        >
            {isFull ? 'Sold Out' : 'Join Event'}
        </Button>
    );
});

export default RSVPButton;
