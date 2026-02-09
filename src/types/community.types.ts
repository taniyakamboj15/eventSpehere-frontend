export const CommunityType = {
    NEIGHBORHOOD: 'NEIGHBORHOOD',
    HOBBY: 'HOBBY',
    BUSINESS: 'BUSINESS',
} as const;

export type CommunityType = typeof CommunityType[keyof typeof CommunityType];

import type { IEvent } from './event.types';
import type { IUser } from './auth.types';

export interface ICommunityMember {
    user: IUser;
    role: 'admin' | 'member';
    joinedAt: string;
}

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

export interface ICommunity {
    _id: string;
    name: string;
    type: CommunityType;
    description: string;
    location: {
        type: 'Point';
        coordinates: number[]; 
        address?: string; 
    };
    members: string[]; 
    admins: string[]; 
    createdAt: string;
    updatedAt: string;
}

export interface CommunityLoaderData {
  community: ICommunity;
  events: IEvent[];
  members: { members: IUser[], admins: IUser[] };
}
