import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { userApi } from '../services/api/user.api';
import { rsvpApi } from '../services/api/rsvp.api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/authSlice';
import { type IRsvp, RsvpStatus } from '../types/rsvp.types';

export const useAttendeeDashboard = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [myRsvps, setMyRsvps] = useState<IRsvp[]>([]);
    const [loadingRsvps, setLoadingRsvps] = useState(true);

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
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const upcoming = (myRsvps || []).filter((r: any) => 
        r && r.status === RsvpStatus.GOING || r && r.status === RsvpStatus.MAYBE
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
