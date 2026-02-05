import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { communityApi } from '../../services/api/community.api';
import { type ICommunity } from '../../types/community.types';
import { UI_TEXT } from '../../constants/text.constants';

export const useCommunityList = () => {
    const [communities, setCommunities] = useState<ICommunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const data = await communityApi.getAll(); 
                setCommunities(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    const handleJoin = async (id: string, onSuccess?: () => void) => {
        try {
            await communityApi.join(id);
            toast.success(UI_TEXT.COMMUNITY_JOIN_SUCCESS);
            if (onSuccess) onSuccess();
            
            // Optimistic update or refresh could go here
            setCommunities(prev => prev.map(c => 
                c._id === id ? { ...c, members: [...c.members, 'me'] } : c // weak optimistic update since we don't have user ID handy here easily without auth hook
            ));
            // Better to re-fetch or let component handle re-fetching if deeply needed, 
            // but for now simple success toast is enough as per original code.
        } catch (err: unknown) {
            const message = err instanceof AxiosError 
                ? err.response?.data?.message 
                : UI_TEXT.COMMUNITY_JOIN_FAILED;
            toast.error(message);
        }
    };

    return { communities, isLoading, handleJoin };
};
