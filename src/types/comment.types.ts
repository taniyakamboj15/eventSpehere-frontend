import type { IUser } from './auth.types';

export interface IComment {
    _id: string;
    message: string;
    user: IUser;
    event: string;
    parentId?: string | null;
    replies?: IComment[];
    createdAt: string;
    updatedAt: string;
}
