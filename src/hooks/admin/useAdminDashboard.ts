import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { userApi } from '../../services/api/user.api';
import type { IUser } from '../../types/auth.types';
import { UI_TEXT } from '../../constants/text.constants';

export const useAdminDashboard = () => {
    const [requests, setRequests] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await userApi.getPendingRequests();
            setRequests(data as IUser[]); 
        } catch (error) {
            toast.error(UI_TEXT.ADMIN_LOAD_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            await userApi.approveUpgrade(userId);
            toast.success(UI_TEXT.ADMIN_APPROVE_SUCCESS);
            setRequests(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        } catch (error) {
            toast.error(UI_TEXT.ADMIN_APPROVE_ERROR);
        }
    };

    const handleReject = async (userId: string) => {
        try {
            await userApi.rejectUpgrade(userId);
            toast.success(UI_TEXT.ADMIN_REJECT_SUCCESS);
            setRequests(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        } catch (error) {
            toast.error(UI_TEXT.ADMIN_REJECT_ERROR);
        }
    };

    return {
        requests,
        isLoading,
        handleApprove,
        handleReject
    };
};
