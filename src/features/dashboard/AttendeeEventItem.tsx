import { memo } from 'react';
import { Calendar, MapPin, QrCode, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { IRsvp } from '../../types/rsvp.types';

interface AttendeeEventItemProps {
    rsvp: IRsvp;
    onNavigate: (path: string) => void;
    onTicket: (ticket: IRsvp) => void;
    // We don't really need onShare since it opens a URL, but we can memoize it if needed. 
    // Actually the share URL data depends on event details.
    // Let's just keep share logic inside the item or passed as handler.
    // Since whatsapp URL is constructed, let's keep it here.
}

export const AttendeeEventItem = memo(({ rsvp, onNavigate, onTicket }: AttendeeEventItemProps) => {
    const event = rsvp?.event;

    // Type guard: ensure event is an object (populated) and has _id
    if (!event || typeof event === 'string' || !('_id' in event)) return null;

    const shareText = `Join me at ${event.title}! ${window.location.origin}/events/${event._id}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    return (
        <div 
            className="bg-surface border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col gap-4" 
        >
            <div className="flex gap-4" onClick={() => onNavigate(`/events/${event._id}`)}>
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {event.photos?.[0] ? (
                        <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Calendar className="w-8 h-8" />
                        </div>
                        )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text truncate group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="text-sm text-textSecondary flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 shrink-0" />
                        {format(new Date(event.startDateTime), 'MMM d, h:mm a')}
                    </div>
                    <div className="text-sm text-textSecondary flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{event.location?.address || 'Online'}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                    <div className="flex gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        rsvp.status === 'GOING' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                        {rsvp.status}
                    </span>
                </div>

                <div className="flex gap-2">
                    {rsvp.status === 'GOING' && (
                            <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onTicket(rsvp);
                            }} 
                            className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <QrCode className="w-3 h-3" /> Ticket
                            </button>
                    )}
                    <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-green-600 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <MessageCircle className="w-3 h-3" /> Share
                    </a>
                </div>
            </div>
        </div>
    );
});
