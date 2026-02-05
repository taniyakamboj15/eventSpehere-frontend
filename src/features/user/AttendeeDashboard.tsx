import Button from '../../components/Button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendeeDashboard } from '../../hooks/user/useAttendeeDashboard';
import { UI_TEXT } from '../../constants/text.constants';
import { JoinedEventsList } from './JoinedEventsList';
import { UpgradeOrganizerCard } from './UpgradeOrganizerCard';

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
                        <h2 className="text-lg font-semibold text-yellow-800">{UI_TEXT.DASHBOARD_PENDING_TITLE}</h2>
                        <p className="text-yellow-700">{UI_TEXT.DASHBOARD_PENDING_MSG}</p>
                    </div>
                </div>
                <section>
                    <h2 className="text-xl font-bold text-text mb-6">{UI_TEXT.DASHBOARD_JOINED_EVENTS}</h2>
                    <JoinedEventsList rsvps={myRsvps} loading={loadingRsvps} />
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
                   <h1 className="text-3xl font-bold text-text">{UI_TEXT.DASHBOARD_WELCOME} {user?.name}!</h1>
                   <p className="text-textSecondary mt-1">{UI_TEXT.DASHBOARD_SUBTITLE}</p>
                </div>
                <Button size="lg" onClick={() => navigate('/events')} className="w-full md:w-auto">
                    {UI_TEXT.DASHBOARD_DISCOVER_BTN}
                </Button>
            </div>

            {/* RSVP Section */}
            <section>
                <h2 className="text-xl font-bold text-text mb-6">{UI_TEXT.DASHBOARD_JOINED_EVENTS}</h2>
                <JoinedEventsList rsvps={myRsvps} loading={loadingRsvps} />
            </section>

            {/* Become Organizer Section */}
            <UpgradeOrganizerCard onUpgrade={handleUpgradeRequest} isLoading={isLoading} />
        </div>
    );
};
