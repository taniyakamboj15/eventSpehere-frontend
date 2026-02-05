import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { IUser } from '../../types/auth.types';
import CommunityMemberItem from './CommunityMemberItem';

interface CommunityMembersListProps {
    members: IUser[];
    isLoading: boolean;
    isAdmin: boolean;
    currentUser: IUser | null;
    onRemove: (id: string) => void;
}

const CommunityMembersList: React.FC<CommunityMembersListProps> = ({ members, isLoading, isAdmin, currentUser, onRemove }) => {
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
                    placeholder="Search members..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading...</div>
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
                        <div className="text-center py-4 text-gray-500 text-sm">No members found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommunityMembersList;
