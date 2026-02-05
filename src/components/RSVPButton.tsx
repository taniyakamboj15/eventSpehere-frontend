import { useState, memo, useCallback, useMemo } from 'react';
import { RsvpStatus } from '../types/rsvp.types';
import { rsvpApi } from '../services/api/rsvp.api';
import Button from './Button';
import { BUTTON_TEXT, ERROR_MESSAGES } from '../constants/text.constants';
import { toast } from 'react-hot-toast';

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
            toast.error(ERROR_MESSAGES.RSVP_FAILED);
        } finally {
            setIsLoading(false);
        }
    }, [eventId, onStatusChange]);

    // Configuration Map for Button States
    const rsvpConfig = useMemo(() => ({
        [RsvpStatus.GOING]: (
            <div className="flex gap-2">
                <Button variant="outline" disabled className="bg-green-50 text-green-700 border-green-200">
                     {BUTTON_TEXT.GOING}
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRsvp(RsvpStatus.NOT_GOING)}
                    isLoading={isLoading}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    {BUTTON_TEXT.CANCEL}
                </Button>
            </div>
        ),
        [RsvpStatus.NOT_GOING]: (
             <Button 
                onClick={() => handleRsvp(RsvpStatus.GOING)} 
                isLoading={isLoading}
                disabled={isFull}
            >
                {isFull ? BUTTON_TEXT.SOLD_OUT : BUTTON_TEXT.JOIN_EVENT}
            </Button>
        ),
        [RsvpStatus.MAYBE]: ( // Fallback to same as NOT_GOING/Default for now if needed, or handle explicitly
             <Button 
                onClick={() => handleRsvp(RsvpStatus.GOING)} 
                isLoading={isLoading}
                disabled={isFull}
            >
                {isFull ? BUTTON_TEXT.SOLD_OUT : BUTTON_TEXT.JOIN_EVENT}
            </Button>
        )
    }), [isLoading, isFull, handleRsvp]);

    // Default to NOT_GOING view if status is undefined or NOT_GOING
    return rsvpConfig[currentStatus || RsvpStatus.NOT_GOING] || rsvpConfig[RsvpStatus.NOT_GOING];
});

export default RSVPButton;
