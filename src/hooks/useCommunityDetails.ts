import { useState, useEffect, useCallback, useMemo } from 'react';
import { communityApi } from '../services/api/community.api';
import type { ICommunity } from '../types/community.types';
import type { IEvent } from '../types/event.types';
import type { IUser } from '../types/auth.types';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { usePermissions } from './utils/usePermissions';

interface CommunityLoaderData {
    community: ICommunity;
    events: IEvent[];
    members: { members: IUser[], admins: IUser[] };
}

export const useCommunityDetails = (id: string | undefined, initialData?: CommunityLoaderData) => {
    const [community, setCommunity] = useState<ICommunity | null>(initialData?.community || null);
    const [events, setEvents] = useState<IEvent[]>(initialData?.events || []);
    const [members, setMembers] = useState<IUser[]>(initialData?.members?.members || []);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [isJoining, setIsJoining] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [isModifying, setIsModifying] = useState(false);
    
    const { getCommunityPermissions, user } = usePermissions();

    const fetchData = useCallback(async () => {
        if (!id) return;
        if (initialData) {
            setIsLoading(false);
            return;
        }

        try {
            const found = await communityApi.getById(id);
            setCommunity(found);
            
            const communityEvents = await communityApi.getEvents(id);
            setEvents(communityEvents);

            const membersData = await communityApi.getMembers(id);
            setMembers(membersData.members);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load community details');
        } finally {
            setIsLoading(false);
        }
    }, [id, initialData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleJoin = useCallback(async () => {
        if (!id || !user) {
            toast.error('Please login to join');
            return;
        }
        setIsJoining(true);
        try {
            await communityApi.join(id);
            toast.success('Joined community!');
            setCommunity(prev => prev && user && user.id ? { ...prev, members: [...prev.members, user.id] } : null);
        } catch (error: unknown) {
             if (error instanceof AxiosError) {
                 toast.error(error.response?.data?.message || 'Failed to join');
             } else {
                 toast.error('Failed to join');
             }
             setIsJoining(false);
        }
    }, [id, user]);

    const handleLeave = useCallback(async () => {
        if (!id || !user) return;
        setIsJoining(true);
        try {
            await communityApi.leave(id);
            toast.success('Left community');
            setCommunity(prev => prev && user ? { ...prev, members: prev.members.filter(m => m !== user.id) } : null);
        } catch (error: unknown) {
             if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to leave');
             } else {
                toast.error('Failed to leave');
             }
             setIsJoining(false);
        }
    }, [id, user]);

    const handleRemoveMember = useCallback(async (memberId: string) => {
        if (!id || !user) return;
        setIsModifying(true);
        try {
            await communityApi.removeMember(id, memberId);
            toast.success('Member removed');
            setCommunity(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    members: prev.members.filter((m: any) => (m._id || m.id || m) !== memberId)
                };
            });
        } catch (error: unknown) {
             if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to remove member');
             } else {
                toast.error('Failed to remove member');
             }
        } finally {
            setIsModifying(false);
        }
    }, [id, user]);

    const { isAdmin, isMember } = useMemo(() => getCommunityPermissions(community), [community, getCommunityPermissions]);

    return {
        community,
        events,
        members,
        isLoading,
        isJoining,
        showMembersModal,
        setShowMembersModal,
        handleJoin,
        handleLeave,
        isMember,
        isAdmin,
        user,
        handleRemoveMember,
        isModifying
    };
};
