import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import { Loader2, Users, Lock, Globe, Briefcase, Plus } from 'lucide-react';
import CommunityMembersModal from '../components/CommunityMembersModal';
import { useCommunityDetails } from '../hooks/useCommunityDetails';

const CommunityDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        community, 
        events, 
        isLoading, 
        isJoining, 
        showMembersModal, 
        setShowMembersModal, 
        handleJoin, 
        handleLeave, 
        isMember, 
        isAdmin 
    } = useCommunityDetails(id);

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    if (!community) return <div className="text-center py-20">Community not found</div>;

    return (
        <div className="min-h-screen bg-gray-50/50">
             {/* Banner */}
             <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                 <h1 className="relative z-10 text-4xl md:text-5xl font-black text-white px-4 text-center">
                     {community.name}
                 </h1>
             </div>

             <div className="container mx-auto px-4 -mt-10 relative z-20 pb-12">
                 <div className="max-w-4xl mx-auto">
                     <div className="bg-surface rounded-3xl p-8 border border-border shadow-lg mb-8">
                         <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                             <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                    {community.type === 'NEIGHBORHOOD' && <Lock className="w-6 h-6" />}
                                    {community.type === 'HOBBY' && <Globe className="w-6 h-6" />}
                                    {community.type === 'BUSINESS' && <Briefcase className="w-6 h-6" />}
                                </div>
                                <span className="font-bold text-textSecondary uppercase tracking-wider text-sm">{community.type}</span>
                             </div>
                             <button 
                                onClick={() => setShowMembersModal(true)}
                                className="flex items-center gap-2 text-textSecondary text-sm hover:text-primary transition-colors cursor-pointer"
                             >
                                 <Users className="w-4 h-4" />
                                 <span className="font-bold">{community.members.length} Members</span>
                             </button>
                         </div>
                         
                         <p className="text-lg text-text leading-relaxed whitespace-pre-wrap mb-8">
                             {community.description}
                         </p>

                         <div className="flex flex-col sm:flex-row gap-4">
                             <Button 
                                 onClick={isMember ? handleLeave : handleJoin} 
                                 isLoading={isJoining} 
                                 variant={isMember ? "outline" : "primary"}
                                 className="px-8"
                             >
                                 {isMember ? 'Leave Community' : 'Join Community'}
                             </Button>
                             
                             {isAdmin && (
                                 <Button 
                                     onClick={() => navigate('/events/create', { state: { communityId: id } })}
                                     className="px-8 gap-2 bg-slate-900 text-white hover:bg-slate-800"
                                 >
                                     <Plus className="w-4 h-4" />
                                     Create Event
                                 </Button>
                             )}
                         </div>
                     </div>

                     <h2 className="text-2xl font-black text-text mb-6">Community Events</h2>
                     {events.length === 0 ? (
                         <div className="text-center py-12 bg-gray-100 rounded-3xl border border-dashed border-gray-200">
                             <p className="text-textSecondary font-medium">No active events in this community.</p>
                         </div>
                     ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {events.map(event => (
                                 <EventCard key={event._id} event={event} />
                             ))}
                         </div>
                     )}
                 </div>
             </div>
             
             {showMembersModal && (
                 <CommunityMembersModal 
                    communityId={id!} 
                    onClose={() => setShowMembersModal(false)}
                    isAdmin={isAdmin}
                 />
             )}
        </div>
    );
};

export default CommunityDetailsPage;
