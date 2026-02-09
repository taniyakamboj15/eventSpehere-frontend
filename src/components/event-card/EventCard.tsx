import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import EventImage from './EventImage';
import EventInfo from './EventInfo';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import type { EventCardProps } from '../../types/event.types';

const EventCard = memo(({ event }: EventCardProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const isJoined = event.userRsvpStatus === 'GOING' || event.userRsvpStatus === 'MAYBE';

    const handleCardClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error('Please sign in to join or see details');
            navigate(`${ROUTES.LOGIN}?redirect=/events/${event._id}`);
            return;
        }
        navigate(`/events/${event._id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="group bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            <EventImage event={event} isJoined={isJoined} />
            <EventInfo event={event} />
        </div>
    );
});

export default EventCard;
