import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { userApi } from '../../services/api/user.api';
import { rsvpApi } from '../../services/api/rsvp.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import { type IRsvp, RsvpStatus } from '../../types/rsvp.types';
import { ERROR_MESSAGES } from '../../constants/text.constants';

import type { IEvent } from '../../types/event.types';
import type { ICommunity } from '../../types/community.types';

interface AttendeeDashboardData {
    events: IEvent[];
    communities: ICommunity[];
}

export const useAttendeeDashboard = (_initialData?: AttendeeDashboardData) => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [myRsvps, setMyRsvps] = useState<IRsvp[]>([]);
    const [loadingRsvps, setLoadingRsvps] = useState(true);

    // Note: Dashboard loader fetches *suggested* events, not RSVPs. 
    // We might want to add RSVPs to dashboard loader later.
    // For now, we accept initialData to match the pattern, even if unused for RSVPs.
    // actually, we can use events from initialData if relevant.

    const fetchRsvps = useCallback(async () => {
        try {
            const data = await rsvpApi.getMyRsvps();
            setMyRsvps(data);
        } catch (error) {
            console.error('Failed to fetch RSVPs', error);
        } finally {
            setLoadingRsvps(false);
        }
    }, []);

    useEffect(() => {
        fetchRsvps();
    }, [fetchRsvps]);

    const handleUpgradeRequest = useCallback(async () => {
        try {
            setIsLoading(true);
            await userApi.requestUpgrade();
            dispatch(updateUser({ upgradeStatus: 'PENDING' }));
            toast.success('Upgrade request submitted! An admin will review it shortly.');
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || 'Failed to submit request');
            } else {
                 toast.error(ERROR_MESSAGES.GENERIC_ERROR);
            }
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const upcoming = myRsvps.filter(r => 
        r.status === RsvpStatus.GOING || r.status === RsvpStatus.MAYBE
    );

    return {
        user,
        isLoading,
        myRsvps,
        loadingRsvps,
        upcoming,
        handleUpgradeRequest
    };
};
