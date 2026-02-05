import { memo } from 'react';
import { Calendar, ScanLine } from 'lucide-react';
import Button from '../../components/Button';
import type { IEvent } from '../../types/event.types';

interface OrganizerEventItemProps {
    event: IEvent;
    onScan: (id: string) => void;
    onManage: (id: string) => void;
}

export const OrganizerEventItem = memo(({ event, onScan, onManage }: OrganizerEventItemProps) => {
    return (
        <div className="bg-surface p-2 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 group">
                <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {event.photos && event.photos[0] ? (
                    <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Calendar /></div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-primary uppercase">{event.category}</div>
                </div>
                
                <div className="flex-1 py-2 pr-4 flex flex-col">
                    <div className="flex justify-between items-start">
                        <div>
                        <h3 className="font-bold text-lg text-text line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-textSecondary flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.startDateTime).toLocaleDateString()}
                        </p>
                        </div>
                    </div>
                    <div className="mt-auto flex gap-2 justify-end pt-4 sm:pt-0">
                        <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onScan(event._id)}
                        className="text-primary hover:bg-primary/5 border-primary/20"
                        >
                        <ScanLine className="w-4 h-4 mr-1" /> Scan
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => onManage(event._id)}>Manage</Button>
                    </div>
                </div>
        </div>
    );
});
