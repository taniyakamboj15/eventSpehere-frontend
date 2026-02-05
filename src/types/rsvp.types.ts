import type { IUser } from './auth.types';
import type { IEvent } from './event.types';

export const RsvpStatus = {
    GOING: 'GOING',
    MAYBE: 'MAYBE',
    NOT_GOING: 'NOT_GOING'
} as const;

export type RsvpStatus = typeof RsvpStatus[keyof typeof RsvpStatus];

export interface IRsvp {
    _id: string;
    event: string | IEvent;
    user: string | IUser;
    status: RsvpStatus;
    checkedIn: boolean;
    checkInTime?: string;
    ticketCode?: string;
    createdAt: string;
    updatedAt: string;
}
