import { type IUser } from './auth.types';

export interface ActionData<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: Record<string, string>;
    message?: string;
}

export interface AuthActionData extends ActionData {
    user?: IUser;
    accessToken?: string;
    email?: string;
}
