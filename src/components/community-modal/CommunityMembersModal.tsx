import { X } from 'lucide-react';
import Button from '../common/Button';
import { useCommunityDetails } from '../../hooks/useCommunityDetails';
import { UI_TEXT } from '../../constants/text.constants';
import StatusHandler from '../common/StatusHandler';
import CommunityMembersList from './CommunityMembersList';

interface CommunityMembersModalProps {
    communityId: string;
    onClose: () => void;
}

const CommunityMembersModal = ({ communityId, onClose }: CommunityMembersModalProps) => {
    const { 
        community, 
        members,
        isLoading, 
        isModifying,
        handleRemoveMember,
        isAdmin,
        user
    } = useCommunityDetails(communityId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-text">{UI_TEXT.COMMUNITY_MEMBERS_TITLE}</h2>
                        <p className="text-sm text-textSecondary">{members?.length || 0} {UI_TEXT.MEMBERS_COUNT_SUFFIX}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-textSecondary"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    <StatusHandler isLoading={isLoading} isEmpty={!members || members.length === 0}>
                        {community && (
                            <CommunityMembersList 
                                members={members}
                                isLoading={isModifying}
                                isAdmin={isAdmin}
                                currentUser={user}
                                onRemove={handleRemoveMember}
                            />
                        )}
                    </StatusHandler>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border bg-gray-50/50 flex justify-end">
                    <Button onClick={onClose} variant="secondary">
                        {UI_TEXT.CLOSE_LABEL}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommunityMembersModal;
