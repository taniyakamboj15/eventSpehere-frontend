import { memo } from 'react';
import type { INotification } from '../../types/notification.types';
import { UI_TEXT } from '../../constants/text.constants';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
    notifications: INotification[];
    onNotificationClick: (notification: INotification) => void;
}

const NotificationList = memo(({ notifications, onNotificationClick }: NotificationListProps) => {
    if (notifications.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 text-sm">
                <p>{UI_TEXT.NO_NOTIFICATIONS}</p>
            </div>
        );
    }

    return (
        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {notifications.map(notification => (
                <NotificationItem 
                    key={notification._id} 
                    notification={notification} 
                    onClick={onNotificationClick} 
                />
            ))}
        </div>
    );
});

NotificationList.displayName = 'NotificationList';

export default NotificationList;
