import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { IEvent } from '../types/event.types';
import { ROUTES } from '../constants/routes';
import { RsvpStatus } from '../types/rsvp.types';
import EventImage from './event-card/EventImage';
import EventInfo from './event-card/EventInfo';

interface EventCardProps {
  event: IEvent;
}

const EventCard = memo(({ event }: EventCardProps) => {
  const isJoined = event.userRsvpStatus === RsvpStatus.GOING;

  return (
    <Link 
      to={ROUTES.EVENT_DETAILS(event._id)}
      className="group bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
    >
      <EventImage event={event} isJoined={isJoined} />
      <EventInfo event={event} />
    </Link>
  );
});

export default EventCard;
