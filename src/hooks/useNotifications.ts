import { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationApi } from '../services/api/notification.api';
import type { INotification } from '../types/notification.types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await notificationApi.getAll();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationApi.markAllAsRead();
            await fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    }, [fetchNotifications]);

    return useMemo(() => ({
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    }), [notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead]);
};
