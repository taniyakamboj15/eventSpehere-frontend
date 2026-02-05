import { useState, useCallback } from 'react';
import Button from '../../components/Button';
import { Sparkles, Users, Store, Calendar, X } from 'lucide-react';
import { type IRsvp, RsvpStatus } from '../../types/rsvp.types';
import QRCode from 'react-qr-code';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAttendeeDashboard } from '../../hooks/useAttendeeDashboard';
import { AttendeeEventItem } from '../dashboard/AttendeeEventItem';


export const AttendeeDashboard = () => {
    const navigate = useNavigate();
    const {
        user,
        isLoading,
        myRsvps,
        loadingRsvps,
        handleUpgradeRequest
    } = useAttendeeDashboard();

    // 1. Pending State View
    if (user?.upgradeStatus === 'PENDING') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 py-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full shrink-0">
                        <Sparkles className="w-6 h-6 text-yellow-600 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-yellow-800">Application Pending</h2>
                        <p className="text-yellow-700">We are reviewing your request to become an Organizer. You will be notified soon.</p>
                    </div>
                </div>
                <section>
                    <h2 className="text-xl font-bold text-text mb-6">Your Joined Events</h2>
                    <RsvpList rsvps={myRsvps} loading={loadingRsvps} navigate={navigate}/>
                </section>
            </div>
        );
    }

    // 2. Default View
    return (
        <div className="max-w-5xl mx-auto space-y-12 py-4">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h1 className="text-3xl font-bold text-text">Welcome, {user?.name}!</h1>
                   <p className="text-textSecondary mt-1">Ready to discover your next experience?</p>
                </div>
                <Button size="lg" onClick={() => navigate('/events')} className="w-full md:w-auto">
                    Discover Events
                </Button>
            </div>

            {/* RSVP Section */}
            <section>
                <h2 className="text-xl font-bold text-text mb-6">Your Joined Events</h2>
                <RsvpList rsvps={myRsvps} loading={loadingRsvps} navigate={navigate}/>
            </section>

            {/* Become Organizer Section */}
            <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                     <div className="flex-1 space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-text text-center lg:text-left">Become a Community Leader</h2>
                        <p className="text-textSecondary text-lg leading-relaxed text-center lg:text-left">
                            Take the next step. Create and manage events for your neighborhood, hobby group, or local business.
                        </p>
                        <ul className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
                             <li className="flex items-center gap-3 text-text">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={20} /></div>
                                <span className="font-medium">Neighborhood Communities</span>
                             </li>
                             <li className="flex items-center gap-3 text-text">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Sparkles size={20} /></div>
                                <span className="font-medium">Hobby & Interest Groups</span>
                             </li>
                             <li className="flex items-center gap-3 text-text">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Store size={20} /></div>
                                <span className="font-medium">Local Businesses</span>
                             </li>
                        </ul>
                     </div>

                     <div className="w-full lg:w-96 flex flex-col items-center justify-center text-center space-y-6 bg-background/50 p-8 rounded-xl border border-border">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                             <h3 className="text-xl font-bold text-text mb-2">Ready to Host?</h3>
                             <p className="text-sm text-textSecondary">
                                Get access to attendee management, check-ins, and event analytics.
                             </p>
                         </div>
                        <Button 
                            size="lg" 
                            className="w-full" 
                            onClick={handleUpgradeRequest} 
                            isLoading={isLoading}
                        >
                            Upgrade to Organizer
                        </Button>
                        <p className="text-xs text-textSecondary italic">
                            Verification takes less than 24 hours.
                        </p>
                     </div>
                </div>
            </div>
        </div>
    );
};

/**
 * RSVP List Helper Component
 */
const RsvpList = ({ rsvps, loading, navigate }: { rsvps: IRsvp[], loading: boolean, navigate: NavigateFunction }) => {
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
    
    // Filter logic
    const upcoming = (rsvps || []).filter((r) => 
        r && (r.status === RsvpStatus.GOING || r.status === RsvpStatus.MAYBE)
    );


    if (upcoming.length === 0) {
        return (
            <div className="bg-surface border border-dashed border-border rounded-xl p-12 text-center">
                <Calendar className="w-12 h-12 text-textSecondary/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">No joined events yet</h3>
                <p className="text-textSecondary mb-6">Discover amazing things happening in your community.</p>
                <Button variant="outline" onClick={() => navigate('/events')}>Browse Events</Button>
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
                            <h3 className="text-2xl font-black text-text mb-1">Your Ticket</h3>
                            <p className="text-textSecondary text-sm">Scan this at the entrance</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-6">
                            <QRCode value={selectedTicket.ticketCode} size={200} />
                        </div>

                        <div className="space-y-1">
                             <p className="font-bold text-text uppercase text-sm tracking-wider">{(selectedTicket.event as unknown as { title: string })?.title || 'Event'}</p>
                             <p className="text-xs text-textSecondary font-mono">{selectedTicket.ticketCode}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
