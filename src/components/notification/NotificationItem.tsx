import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { type INotification } from '../../types/notification.types';

interface NotificationItemProps {
    notification: INotification;
    onClick: (notification: INotification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    return (
        <div 
            onClick={() => onClick(notification)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
        >
            <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
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
