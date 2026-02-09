import type { IUser } from './auth.types';

export interface IComment {
  _id: string;
  user: IUser;
  event: string;
  message: string;
  replies?: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentSectionProps {
  eventId: string;
}
