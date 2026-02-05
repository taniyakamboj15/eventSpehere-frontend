import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { type IRsvp, RsvpStatus } from '../../types/rsvp.types';
import { UI_TEXT } from '../../constants/text.constants';
import Button from '../../components/Button';
import { AttendeeEventItem } from '../dashboard/AttendeeEventItem';

interface JoinedEventsListProps {
    rsvps: IRsvp[];
    loading: boolean;
}

export const JoinedEventsList = ({ rsvps, loading }: JoinedEventsListProps) => {
    const navigate = useNavigate();
    const [selectedTicket, setSelectedTicket] = useState<IRsvp | null>(null);

    const handleNavigate = useCallback((path: string) => {
        navigate(path);
    }, [navigate]);

    const handleTicket = useCallback((ticket: IRsvp) => {
        setSelectedTicket(ticket);
    }, []);

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="h-32 bg-surface animate-pulse border border-border rounded-xl"></div>
                ))}
            </div>
        );
    }
    
    
    const upcoming = (rsvps || []).filter((r) => 
        r && (r.status === RsvpStatus.GOING || r.status === RsvpStatus.MAYBE)
    );


    if (upcoming.length === 0) {
        return (
            <div className="bg-surface border border-dashed border-border rounded-xl p-12 text-center">
                <Calendar className="w-12 h-12 text-textSecondary/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">{UI_TEXT.DASHBOARD_NO_EVENTS_TITLE}</h3>
                <p className="text-textSecondary mb-6">{UI_TEXT.DASHBOARD_NO_EVENTS_MSG}</p>
                <Button variant="outline" onClick={() => navigate('/events')}>{UI_TEXT.DASHBOARD_BROWSE_EVENTS}</Button>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {upcoming.map((rsvp) => (
                <AttendeeEventItem 
                    key={rsvp._id} 
                    rsvp={rsvp} 
                    onNavigate={handleNavigate}
                    onTicket={handleTicket}
                />
            ))}
            
            {/* Ticket Modal */}
            {selectedTicket && selectedTicket.ticketCode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedTicket(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-fade-in" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        
                        <div className="mb-6">
                            <h3 className="text-2xl font-black text-text mb-1">{UI_TEXT.DASHBOARD_TICKET_TITLE}</h3>
                            <p className="text-textSecondary text-sm">{UI_TEXT.DASHBOARD_TICKET_SUB}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-6">
                            <QRCode value={selectedTicket.ticketCode} size={200} />
                        </div>

                        <div className="space-y-1">
                             <p className="font-bold text-text uppercase text-sm tracking-wider">{
                                 (typeof selectedTicket.event === 'object' && selectedTicket.event !== null && 'title' in selectedTicket.event) 
                                 ? (selectedTicket.event as { title: string }).title 
                                 : 'Event'
                             }</p>
                             <p className="text-xs text-textSecondary font-mono">{selectedTicket.ticketCode}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
