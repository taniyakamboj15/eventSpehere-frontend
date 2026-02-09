import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRSVP } from '../../hooks/useRSVP';
import RSVPStates from './RSVPStates';
import { RsvpStatus } from '../../types/rsvp.types';
import type { IEvent } from '../../types/event.types';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const RSVPButton = ({ event }: { event: IEvent }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // We pass event._id to the hook which handles the logic
    const { status, isLoading, handleRsvp } = useRSVP(event._id);

    const isGoing = status === RsvpStatus.GOING || status === RsvpStatus.MAYBE;

    const onJoinClick = () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to join');
            navigate(`${ROUTES.LOGIN}?redirect=/events/${event._id}`);
            return;
        }
        handleRsvp(RsvpStatus.GOING);
    };

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
            onJoin={onJoinClick}
            isLoading={isLoading}
            disabled={event.capacity !== undefined && (event.attendeeCount || 0) >= event.capacity}
        />
    );
};

export default RSVPButton;
