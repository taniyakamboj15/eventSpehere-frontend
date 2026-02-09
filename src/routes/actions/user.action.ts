import { type ActionFunctionArgs } from 'react-router-dom';
import { userApi } from '../../services/api/user.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const updateProfileAction = async ({ request }: ActionFunctionArgs) => {
    try {
        const data = await request.json();
        const user = await userApi.updateProfile(data);
        toast.success('Profile updated successfully!');
        return { success: true, user };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data?.message || 'Failed to update profile' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
