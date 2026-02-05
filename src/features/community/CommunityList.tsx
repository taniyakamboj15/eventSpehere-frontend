import { MapPin, Users, Lock, Globe, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCommunityList } from '../../hooks/community/useCommunityList';
import { UI_TEXT } from '../../constants/text.constants';

const COMMUNITY_ICONS = {
    'NEIGHBORHOOD': <Lock className="w-6 h-6" />,
    'HOBBY': <Globe className="w-6 h-6" />,
    'BUSINESS': <Briefcase className="w-6 h-6" />
} as const;

const CommunityList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { communities, isLoading, handleJoin } = useCommunityList();

    if (isLoading) return <div className="py-8 text-center text-textSecondary">{UI_TEXT.COMMUNITY_LOADING}</div>;

    if (communities.length === 0) return (
         <div className="py-8 text-center text-textSecondary">
            {UI_TEXT.COMMUNITY_EMPTY}
         </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map(community => {
                const isMember = user && user.id && community.members.includes(user.id);
                
                return (
                <div key={community._id} className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/5 rounded-xl text-primary">
                            {COMMUNITY_ICONS[community.type as keyof typeof COMMUNITY_ICONS] || <Globe className="w-6 h-6" />}
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-textSecondary uppercase">{community.type}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-text mb-2">{community.name}</h3>
                    <p className="text-sm text-textSecondary mb-4 line-clamp-2">{community.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-textSecondary mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{UI_TEXT.COMMUNITY_NEARBY}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{community.members.length} {UI_TEXT.COMMUNITY_MEMBERS_SUFFIX}</span>
                        </div>
                    </div>

                    {isMember ? (
                        <div className="flex flex-col gap-2">
                             <div className="bg-green-50 text-green-700 text-center py-2 rounded-lg text-sm font-bold border border-green-100 mb-1">
                                 {UI_TEXT.COMMUNITY_JOINED_BADGE}
                             </div>
                             <Button onClick={() => navigate(`/communities/${community._id}`)} variant="outline" className="w-full">
                                 {UI_TEXT.COMMUNITY_VIEW_DETAILS}
                             </Button>
                        </div>
                    ) : (
                        <Button onClick={() => handleJoin(community._id)} variant="secondary" className="w-full">
                            {UI_TEXT.COMMUNITY_JOIN}
                        </Button>
                    )}
                </div>
                );
            })}
        </div>
    );
};

export default CommunityList;
