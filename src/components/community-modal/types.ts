import type { IUser } from '../../types/auth.types';

export type TabType = 'members' | 'invite';

export interface TabNavigationProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    memberCount: number;
    isAdmin: boolean;
}

export interface CommunityInviteFormProps {
    communityId: string;
}

export interface ModalProps {
    communityId: string;
    currentUser: IUser | null;
    isAdmin: boolean;
}

export interface CommunityMembersListProps {
    members: IUser[];
    isLoading: boolean;
    isAdmin: boolean;
    currentUser: IUser | null;
    onRemove: (id: string) => void;
}

export interface CommunityMemberItemProps {
    member: IUser;
    isAdmin: boolean;
    isCurrentUser: boolean;
    onRemove: (id: string) => void;
}

export interface InviteFormData {
    email: string;
}
