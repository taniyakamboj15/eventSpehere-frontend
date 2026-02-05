import React, { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { UI_TEXT } from '../../constants/text.constants';
import type { IEvent } from '../../types/event.types';

interface EventImageProps {
    event: IEvent;
    isJoined: boolean;
}

const EventImage: React.FC<EventImageProps> = ({ event, isJoined }) => {
    const [imageError, setImageError] = useState(false);

    return (
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
                        <span className="text-xs font-medium uppercase tracking-wider opacity-50">{UI_TEXT.NO_IMAGE}</span>
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
                        {UI_TEXT.JOINED_BADGE}
                    </div>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                 <span className="text-white text-xs font-medium">{UI_TEXT.CLICK_TO_VIEW}</span>
            </div>
        </div>
    );
};

export default EventImage;
