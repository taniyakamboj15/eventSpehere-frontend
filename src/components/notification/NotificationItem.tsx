import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { NOTIFICATION_STYLES } from '../../constants/style.constants';
import type { NotificationItemProps } from '../../types/notification.types';

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    return (
        <div 
            onClick={() => onClick(notification)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? NOTIFICATION_STYLES.ITEM_UNREAD : ''}`}
        >
            <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? NOTIFICATION_STYLES.TEXT_UNREAD : NOTIFICATION_STYLES.TEXT_READ}`}>
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                </div>
                {!notification.isRead && (
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
