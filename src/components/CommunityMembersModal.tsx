import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { communityApi } from '../services/api/community.api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import type { IUser } from '../types/auth.types';
import TabNavigation from './community-modal/TabNavigation';
import CommunityMembersList from './community-modal/CommunityMembersList';
import CommunityInviteForm from './community-modal/CommunityInviteForm';

interface CommunityMembersModalProps {
    communityId: string;
    onClose: () => void;
    isAdmin: boolean;
}

const CommunityMembersModal = ({ communityId, onClose, isAdmin }: CommunityMembersModalProps) => {
    const { user: currentUser } = useAuth();
    const [members, setMembers] = useState<IUser[]>([]);
    const [activeTab, setActiveTab] = useState<'members' | 'invite'>('members');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await communityApi.getMembers(communityId);
            
                const all = [...data.admins, ...data.members];
                // Deduplicate members based on _id or id
                const unique = Array.from(new Map(all.map((item) => [item._id || item.id, item])).values());
                // Filter out any items that didn't have an ID (shouldn't happen but safe)
                setMembers(unique.filter(u => u._id || u.id) as IUser[]);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load members');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [communityId]);

    const handleRemove = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await communityApi.removeMember(communityId, memberId);
            setMembers(prev => prev.filter(m => (m._id || m.id) !== memberId));
            toast.success('Member removed');
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    const tabContent = {
        members: (
            <CommunityMembersList 
                members={members}
                isLoading={isLoading}
                isAdmin={isAdmin}
                currentUser={currentUser}
                onRemove={handleRemove}
            />
        ),
        invite: isAdmin ? <CommunityInviteForm communityId={communityId} /> : null
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                 <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-lg">Community People</h3>
                     <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                 </div>

                 <TabNavigation 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    memberCount={members.length} 
                    isAdmin={isAdmin} 
                 />

                 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                     {tabContent[activeTab]}
                 </div>
             </div>
        </div>
    );
};

export default CommunityMembersModal;
