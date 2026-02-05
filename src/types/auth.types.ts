export const UserRole = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  ATTENDEE: 'ATTENDEE',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type UpgradeStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IUser {
  _id?: string; // MongoDB ID from some endpoints
  id?: string;  // Flattened ID from auth endpoints
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
  isVerified?: boolean;
  avatar?: string;
  upgradeStatus?: UpgradeStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}
