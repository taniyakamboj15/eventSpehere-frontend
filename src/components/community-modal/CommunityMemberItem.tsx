import React from 'react';
import { UserMinus } from 'lucide-react';
import type { IUser } from '../../types/auth.types';

interface CommunityMemberItemProps {
    member: IUser;
    isAdmin: boolean;
    isCurrentUser: boolean;
    onRemove: (id: string) => void;
}

const CommunityMemberItem: React.FC<CommunityMemberItemProps> = ({ member, isAdmin, isCurrentUser, onRemove }) => {
    // Handle both _id and id
    const memberId = member._id || member.id;
    if (!memberId) return null;

    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-medium text-sm text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                </div>
            </div>
            {isAdmin && !isCurrentUser && (
                <button 
                    onClick={() => onRemove(memberId)}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                    title="Remove Member"
                >
                    <UserMinus className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default CommunityMemberItem;
