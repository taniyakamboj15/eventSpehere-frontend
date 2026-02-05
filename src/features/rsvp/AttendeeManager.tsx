import type { IUser } from '../../types/auth.types';
import Button from '../../components/Button';
import { Check, Loader2 } from 'lucide-react';
import { UI_TEXT, BUTTON_TEXT } from '../../constants/text.constants';
import { useAttendeeManager } from '../../hooks/rsvp/useAttendeeManager';

interface AttendeeManagerProps {
    eventId?: string;
}

const AttendeeManager = ({ eventId: propEventId }: AttendeeManagerProps) => {
    const { attendees, isLoading, checkInLoading, fetchAttendees, handleCheckIn } = useAttendeeManager({ eventId: propEventId });

    if (isLoading) return <Loader2 className="animate-spin" />;

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
             <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-text">{UI_TEXT.ATTENDEE_LIST_HEADER} ({attendees.length})</h3>
                <Button size="sm" variant="outline" onClick={fetchAttendees}>{UI_TEXT.REFRESH_BUTTON}</Button>
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
                                    <Check className="w-3 h-3 mr-1" /> {UI_TEXT.CHECKED_IN_STATUS}
                                </span>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => user._id && handleCheckIn(user._id)}
                                    isLoading={checkInLoading === user._id}
                                >
                                    {BUTTON_TEXT.CHECK_IN}
                                </Button>
                            )}
                        </div>
                    );
                })}
                {attendees.length === 0 && (
                     <div className="p-8 text-center text-textSecondary text-sm">
                         {UI_TEXT.NO_ATTENDEES}
                     </div>
                )}
            </div>
        </div>
    );
};

export default AttendeeManager;
