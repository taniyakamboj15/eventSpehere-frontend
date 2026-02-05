import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { communityApi } from '../services/api/community.api';
import type { ICommunity } from '../types/community.types';
import type { IEvent } from '../types/event.types';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const useCommunityDetails = (id: string | undefined) => {
    const { user } = useAuth();
    const [community, setCommunity] = useState<ICommunity | null>(null);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        try {
            // Optimization: API should ideally have getById, but sticking to existing pattern for now or improving it?
            // Existing pattern: getAll then find. Let's fix this if API supports it.
            // Checking community.api.ts... Assuming getById might not exist or we optimize. 
            // Actually, best to stick to current logic to avoid breaking if backend doesn't support getById direct route (though it should).
            // Let's assume standard REST: getById is better. But let's check current 'communityApi.getAll()' use.
            // If getById exists, use it. If not, fallback.
            // For now, mirroring existing logic to be safe, but typically getById is preferred.
            
            // Wait, let's verify if `getById` exists in `community.api.ts`? 
            // I don't see `community.api.ts` content. I'll stick to the logic I saw in `CommunityDetailsPage.tsx`: getAll().find()
            // It's inefficient but safe without viewing api file.
            
            const all = await communityApi.getAll(); 
            const found = all.find((c: ICommunity) => c._id === id);
            setCommunity(found || null);
            
            if (found) {
                const communityEvents = await communityApi.getEvents(id);
                setEvents(communityEvents);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load community details');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

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

    const isMember = community && user && user.id ? community.members.includes(user.id) : false;
    const isAdmin = community && user && user.id ? community.admins.includes(user.id) : false;

    return {
        community,
        events,
        isLoading,
        isJoining,
        showMembersModal,
        setShowMembersModal,
        handleJoin,
        handleLeave,
        isMember,
        isAdmin,
        user
    };
};
