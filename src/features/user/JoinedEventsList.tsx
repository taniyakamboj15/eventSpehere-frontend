import { useEffect, useState } from 'react';
import { rsvpApi } from '../../services/api/rsvp.api';
import EventCard from '../../components/EventCard';
import { Loader2 } from 'lucide-react';
import type { IEvent } from '../../types/event.types';
import type { IRsvp } from '../../types/rsvp.types';

const JoinedEventsList = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJoined = async () => {
            try {
                // Now strictly typed
                const rsvps: IRsvp[] = await rsvpApi.getMyRsvps();
                const joinedEvents = rsvps
                    .filter((rsvp) => rsvp.status === 'GOING' && rsvp.event && typeof rsvp.event !== 'string')
                    .map((rsvp) => rsvp.event as IEvent);
                setEvents(joinedEvents);
            } catch (error) {
                console.error('Failed to fetch joined events', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJoined();
    }, []);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-textSecondary">You haven't joined any events yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard key={event._id} event={event} />
            ))}
        </div>
    );
};

export default JoinedEventsList;
