import { useEffect, useState, useCallback } from 'react';
import { communityApi } from '../services/api/community.api'; 
import Button from '../components/Button';
import { TicketScanner } from '../components/TicketScanner';
import { OrganizerEventItem } from '../features/dashboard/OrganizerEventItem';
import { Loader2, Plus, Calendar, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useOrganizerDashboard } from '../hooks/useOrganizerDashboard';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { 
    events, 
    isLoading, 
    scanningEventId, 
    setScanningEventId 
  } = useOrganizerDashboard();
  
  const handleScan = useCallback((id: string) => {
      setScanningEventId(id);
  }, [setScanningEventId]);

  const handleManage = useCallback((id: string) => {
      navigate(`/events/${id}/manage`);
  }, [navigate]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl" />
            <div className="relative z-10">
                <p className="text-blue-100 font-medium mb-1">Total Events</p>
                <h2 className="text-4xl font-black">{events.length}</h2>
                <Button 
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 text-xs" 
                    size="sm"
                    onClick={() => navigate('/communities/create')}
                >
                    + Create Community
                </Button>
            </div>
            <Calendar className="absolute right-6 bottom-6 w-12 h-12 text-white/20" />
        </div>
        
        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate(ROUTES.CREATE_EVENT)}>
             <div className="absolute right-0 top-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl" />
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <Plus className="w-6 h-6" />
                 </div>
                 <div>
                     <h3 className="font-bold text-lg text-text">Create New Event</h3>
                     <p className="text-sm text-textSecondary">Schedule a meetup</p>
                 </div>
             </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Event List */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text">Your Events</h2>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : events.length === 0 ? (
                 <div className="p-12 bg-surface rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">No events yet</h3>
                    <p className="text-textSecondary mb-6">Create your first event to get started managing your community.</p>
                    <Button onClick={() => navigate(ROUTES.CREATE_EVENT)}>Create Event</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <OrganizerEventItem 
                            key={event._id} 
                            event={event} 
                            onScan={handleScan}
                            onManage={handleManage}
                        />
                    ))}
                </div>
            )}
        </div>
        
        {/* Right Sidebar: My Communities + Navigation */}
        <div className="space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-bold text-lg text-text mb-4">Quick Navigation</h3>
                <div className="space-y-3">
                     <Button 
                        variant="secondary" 
                        className="w-full justify-start gap-2"
                        onClick={() => navigate('/discover')}
                    >
                        <Globe className="w-4 h-4" />
                        Go to Discover Page
                    </Button>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-text">My Communities</h3>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => navigate('/communities/create')}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                 {/* We need to fetch these. Ideally we lift state or add another query. 
                     For MVP we will create a small sub-component or just fetch in useEffect.
                 */}
                 <MyCommunitiesList />
            </div>
        </div>

        </div>
    
        {scanningEventId && (
            <TicketScanner 
                eventId={scanningEventId}
                onClose={() => setScanningEventId(null)}
                onScanSuccess={() => {}}
            />
        )}
    </div>
  );
};

import type { ICommunity } from '../types/community.types';

const MyCommunitiesList = () => {
    const [communities, setCommunities] = useState<ICommunity[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                // Now supports memberId='me'
                const data = await communityApi.getAll({ memberId: 'me' }); 
                setCommunities(data);
            } catch (error) {
                console.error('Failed to fetch communities');
            }
        };
        fetch();
    }, []);

    if (communities.length === 0) return <p className="text-sm text-textSecondary">You aren't in any communities yet.</p>;

    return (
        <div className="space-y-3">
            {communities.map(c => (
                <div key={c._id} onClick={() => navigate(`/communities/${c._id}`)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                         {c.type === 'NEIGHBORHOOD' ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-sm text-text truncate">{c.name}</h4>
                        <p className="text-xs text-textSecondary truncate">{c.members.length} Members</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrganizerDashboard;
