export const NotificationType = {
    COMMUNITY_INVITE: 'COMMUNITY_INVITE',
    EVENT_INVITE: 'EVENT_INVITE',
    GENERAL: 'GENERAL'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationStatus = {
    PENDING: 'PENDING',
    DELIVERED: 'DELIVERED',
    READ: 'READ'
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];

export interface INotification {
    _id: string;
    recipient?: string;
    recipientEmail: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    status: NotificationStatus;
    createdAt: string;
    updatedAt: string;
}
