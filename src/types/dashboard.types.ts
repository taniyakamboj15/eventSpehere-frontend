import type { IEvent } from './event.types';
import type { ICommunity } from './community.types';

export interface OrganizerDashboardProps {
    initialData?: {
        events: IEvent[];
        communities: ICommunity[];
    };
}

export interface OrganizerDashboardData {
  totalEvents: number;
  activeEvents: number;
  totalAttendees: number;
  upcomingEvents: IEvent[];
}

export interface AttendeeDashboardProps {
    initialData?: {
        events: IEvent[];
        communities: ICommunity[];
    };
}

export interface AttendeeDashboardData {
  joinedEvents: IEvent[];
  nearbyEvents: IEvent[];
}

export interface DashboardData {
    events: IEvent[];
    communities: ICommunity[];
}
