import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type INotification, NotificationType } from '../types/notification.types';
import { notificationApi } from '../services/api/notification.api';
import { UI_TEXT } from '../constants/text.constants';
import NotificationItem from './notification/NotificationItem';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getAll();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const handleNotificationClick = async (notification: INotification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        if (notification.type === NotificationType.COMMUNITY_INVITE && notification.data?.communityId) {
            navigate(`/communities/${notification.data.communityId}`);
        } else if (notification.type === NotificationType.EVENT_INVITE && notification.data?.eventId) {
            navigate(`/events/${notification.data.eventId}`);
        }
        
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={UI_TEXT.NOTIFICATIONS_TITLE}
            >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">{UI_TEXT.NOTIFICATIONS_TITLE}</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await notificationApi.markAllAsRead();
                                    fetchNotifications();
                                }}
                                className="text-xs text-primary hover:text-primary-dark"
                            >
                                {UI_TEXT.MARK_ALL_READ}
                            </button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                <p>{UI_TEXT.NO_NOTIFICATIONS}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notification => (
                                    <NotificationItem 
                                        key={notification._id} 
                                        notification={notification} 
                                        onClick={handleNotificationClick} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
