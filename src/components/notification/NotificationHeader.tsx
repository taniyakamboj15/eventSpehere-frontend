import { memo } from 'react';
import { UI_TEXT } from '../../constants/text.constants';

interface NotificationHeaderProps {
    unreadCount: number;
    onMarkAllAsRead: (e: React.MouseEvent) => void;
}

const NotificationHeader = memo(({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) => {
    return (
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{UI_TEXT.NOTIFICATIONS_TITLE}</h3>
            {unreadCount > 0 && (
                <button 
                    onClick={onMarkAllAsRead}
                    className="text-xs text-primary hover:text-primary-dark font-bold"
                >
                    {UI_TEXT.MARK_ALL_READ}
                </button>
            )}
        </div>
    );
});

NotificationHeader.displayName = 'NotificationHeader';

export default NotificationHeader;
