import type { IUser } from '../../types/auth.types';

export interface ModalProps {
    communityId: string;
    currentUser: IUser | null;
    isAdmin: boolean;
}
