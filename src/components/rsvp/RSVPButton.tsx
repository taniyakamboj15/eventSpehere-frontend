import { useRSVP } from '../../hooks/useRSVP';
import RSVPStates from './RSVPStates';
import { RsvpStatus } from '../../types/rsvp.types';
import type { IEvent } from '../../types/event.types';

const RSVPButton = ({ event }: { event: IEvent }) => {
    // We pass event._id to the hook which handles the logic
    const { status, isLoading, handleRsvp } = useRSVP(event._id);

    const isGoing = status === RsvpStatus.GOING || status === RsvpStatus.MAYBE;

    if (isGoing) {
        return (
            <RSVPStates.Going 
                onCancel={() => handleRsvp(RsvpStatus.NOT_GOING)}
                isLoading={isLoading}
            />
        );
    }

    return (
        <RSVPStates.Join 
            onJoin={() => handleRsvp(RsvpStatus.GOING)}
            isLoading={isLoading}
            disabled={event.capacity !== undefined && (event.attendeeCount || 0) >= event.capacity}
        />
    );
};

export default RSVPButton;
