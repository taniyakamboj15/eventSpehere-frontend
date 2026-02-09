import { memo } from 'react';
import { Link } from 'react-router-dom';
import EventImage from './EventImage';
import EventInfo from './EventInfo';
import type { EventCardProps } from './types';

const EventCard = memo(({ event }: EventCardProps) => {
    const isJoined = event.userRsvpStatus === 'GOING' || event.userRsvpStatus === 'MAYBE';

    return (
        <Link 
            to={`/events/${event._id}`} 
            className="group bg-surface rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <EventImage event={event} isJoined={isJoined} />
            <EventInfo event={event} />
        </Link>
    );
});

export default EventCard;
