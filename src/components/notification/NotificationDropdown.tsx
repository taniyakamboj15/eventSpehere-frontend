import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';
import { UI_TEXT } from '../../constants/text.constants';

const NotificationDropdown = () => {
    const { 
        notifications, 
        unreadCount, 
        markAllAsRead,
        markAsRead
    } = useNotifications();
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-textSecondary hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-surface rounded-3xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={markAllAsRead} />
                    
                    <div className="max-h-[450px] overflow-y-auto">
                        <NotificationList 
                            notifications={notifications}
                            onNotificationClick={(notification) => {
                                markAsRead(notification._id);
                                // Optional: navigate to specific page?
                            }}
                        />
                    </div>

                    <div className="p-4 bg-gray-50/50 border-t border-border text-center">
                        <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                            {UI_TEXT.NOTIFICATIONS_TITLE}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
