import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';
import type { IEvent } from '../types/event.types';
import { ROUTES } from '../constants/routes';
import { format } from 'date-fns';

interface EventCardProps {
  event: IEvent;
}

const EventCard = memo(({ event }: EventCardProps) => {
  const isJoined = event.userRsvpStatus === 'GOING';
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      to={ROUTES.EVENT_DETAILS(event._id)}
      className="group bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {event.photos && event.photos.length > 0 && !imageError ? (
          <img 
            src={event.photos[0]} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-50">No Image</span>
            </div>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm uppercase tracking-wide border border-white/20">
            {event.category}
          </div>
          {isJoined && (
            <div className="bg-green-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 border border-green-400/20">
              <CheckCircle className="w-3 h-3" />
              JOINED
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <span className="text-white text-xs font-medium">Click to view details</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">
          {event.title}
        </h3>
        
        <div className="space-y-3 text-sm text-textSecondary mb-5 flex-1">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-text">{format(new Date(event.startDateTime), 'EEE, MMM d • h:mm a')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="line-clamp-1">{event.location.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-surface flex items-center justify-center text-[10px] text-primary font-bold">
                {event.attendeeCount > 0 ? event.attendeeCount : '0'}
              </div>
            </div>
            <span className="text-xs font-medium text-textSecondary">{event.attendeeCount} going</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
            <span className="text-lg font-light leading-none mb-0.5">&rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default EventCard;
