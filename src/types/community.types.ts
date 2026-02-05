export const CommunityType = {
    NEIGHBORHOOD: 'NEIGHBORHOOD',
    HOBBY: 'HOBBY',
    BUSINESS: 'BUSINESS',
} as const;

export type CommunityType = typeof CommunityType[keyof typeof CommunityType];

export interface ICommunity {
    _id: string;
    name: string;
    type: CommunityType;
    description: string;
    location: {
        type: 'Point';
        coordinates: number[]; // [lng, lat]
        address?: string; // Optional if backend supports it or we augment on frontend
    };
    members: string[]; // IDs
    admins: string[]; // IDs
    createdAt: string;
    updatedAt: string;
}
