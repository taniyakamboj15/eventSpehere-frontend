import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { rsvpApi } from '../../services/api/rsvp.api';
import type { IRsvp } from '../../types/rsvp.types';
import type { IUser } from '../../types/auth.types';
import Button from '../../components/Button';
import { Check, Loader2 } from 'lucide-react';

interface AttendeeManagerProps {
    eventId?: string;
}

const AttendeeManager = ({ eventId: propEventId }: AttendeeManagerProps) => {
    const { id: paramAndId } = useParams<{ id: string }>();
    const eventId = propEventId || paramAndId;
    const [attendees, setAttendees] = useState<IRsvp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState<string | null>(null);

    const fetchAttendees = async () => {
        if (!eventId) return;
        try {
            const data = await rsvpApi.getByEvent(eventId);
            setAttendees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendees();
    }, [eventId]);

    const handleCheckIn = async (userId: string) => {
        if (!eventId) return;
        try {
            setCheckInLoading(userId);
            await rsvpApi.checkIn(eventId, userId);
            
            // Optimistic update
            setAttendees(prev => prev.map(rsvp => {
                 const u = rsvp.user as IUser;
                 if (u._id === userId) {
                     return { ...rsvp, checkedIn: true };
                 }
                 return rsvp;
            }));
        } catch (error) {
             alert('Check-in failed');
        } finally {
            setCheckInLoading(null);
        }
    };

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
             <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-text">Attendee List ({attendees.length})</h3>
                <Button size="sm" variant="outline">Refresh</Button>
            </div>
            <div className="divide-y divide-border">
                {attendees.map((rsvp) => {
                    const user = rsvp.user as IUser;
                    return (
                        <div key={rsvp._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-text text-sm">{user.name}</p>
                                    <p className="text-xs text-textSecondary">{user.email}</p>
                                </div>
                            </div>
                            
                            {rsvp.checkedIn ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                    <Check className="w-3 h-3 mr-1" /> Checked-in
                                </span>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => user._id && handleCheckIn(user._id)}
                                    isLoading={checkInLoading === user._id}
                                >
                                    Check In
                                </Button>
                            )}
                        </div>
                    );
                })}
                {attendees.length === 0 && (
                     <div className="p-8 text-center text-textSecondary text-sm">
                         No attendees yet.
                     </div>
                )}
            </div>
        </div>
    );
};

export default AttendeeManager;
