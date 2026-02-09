import type { IEvent } from '../../types/event.types';

export interface EventImageProps {
    event: IEvent;
    isJoined?: boolean;
}

export interface EventInfoProps {
    event: IEvent;
}

export interface EventCardProps {
    event: IEvent;
}
