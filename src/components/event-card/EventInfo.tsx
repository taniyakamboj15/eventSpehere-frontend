import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { UI_TEXT, DATE_FORMATS } from '../../constants/text.constants';
import type { IEvent } from '../../types/event.types';

interface EventInfoProps {
    event: IEvent;
}

const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
    // Check if community is populated object
    const communityName = typeof event.community === 'object' ? event.community?.name : null;

    return (
        <div className="p-5 flex flex-col flex-1">
            <div className="space-y-1 mb-3">
                {communityName && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
                        <Users className="w-3 h-3" />
                         Hosted by {communityName}
                    </div>
                )}
                <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {event.title}
                </h3>
            </div>
            
            <div className="space-y-3 text-sm text-textSecondary mb-5 flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-text">{format(new Date(event.startDateTime), DATE_FORMATS.EVENT_CARD)}</span>
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
                    <span className="text-xs font-medium text-textSecondary">{event.attendeeCount} {UI_TEXT.GOING_COUNT_SUFFIX}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                    <span className="text-lg font-light leading-none mb-0.5">&rarr;</span>
                </div>
            </div>
        </div>
    );
};

export default EventInfo;
