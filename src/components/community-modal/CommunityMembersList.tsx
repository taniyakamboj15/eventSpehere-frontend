import { useState } from 'react';
import { Search } from 'lucide-react';
import CommunityMemberItem from './CommunityMemberItem';
import { UI_TEXT } from '../../constants/text.constants';
import type { CommunityMembersListProps } from '../../types/community.types';

const CommunityMembersList = ({ members, isLoading, isAdmin, currentUser, onRemove }: CommunityMembersListProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = searchTerm 
        ? members.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : members;

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder={UI_TEXT.SEARCH_MEMBERS_PLACEHOLDER} 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8">{UI_TEXT.Loading}</div>
            ) : (
                <div className="space-y-3">
                    {filteredMembers.map(member => (
                        <CommunityMemberItem 
                            key={member._id || member.id} 
                            member={member} 
                            isAdmin={isAdmin}
                            isCurrentUser={currentUser?.id === (member.id || member._id) || currentUser?._id === (member._id || member.id)}
                            onRemove={onRemove}
                        />
                    ))}
                    {filteredMembers.length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">{UI_TEXT.NO_MEMBERS_FOUND}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommunityMembersList;
