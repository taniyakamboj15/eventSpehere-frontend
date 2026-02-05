import type { RsvpStatus } from './rsvp.types';

export const EventVisibility = {
  PUBLIC: 'PUBLIC',
  COMMUNITY_ONLY: 'COMMUNITY_ONLY',
  PRIVATE_INVITE: 'PRIVATE_INVITE',
} as const;

export type EventVisibility = typeof EventVisibility[keyof typeof EventVisibility];

export const EventCategory = {
  MUSIC: 'MUSIC',
  TECH: 'TECH',
  SPORTS: 'SPORTS',
  EDUCATION: 'EDUCATION',
  SOCIAL: 'SOCIAL',
  MEETUP: 'MEETUP',
  BUSINESS: 'BUSINESS',
  NEIGHBORHOOD: 'NEIGHBORHOOD',
  OTHER: 'OTHER',
} as const;

export type EventCategory = typeof EventCategory[keyof typeof EventCategory];

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [long, lat]
  address: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  visibility: EventVisibility;
  startDateTime: string;
  endDateTime: string;
  location: ILocation;
  capacity: number;
  attendeeCount: number;
  organizer: string | { _id: string; name: string }; // Populated or ID
  community?: string;
  photos: string[];
  googleCalendarLink?: string;
  userRsvpStatus?: RsvpStatus | null;
  recurringRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval: number;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}
