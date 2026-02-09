import { type ActionFunctionArgs } from 'react-router-dom';
import { communityApi } from '../../services/api/community.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const createCommunityAction = async ({ request }: ActionFunctionArgs) => {
    try {
        const data = await request.json();
        await communityApi.create(data);
        toast.success('Community created successfully!');
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data?.message || 'Failed to create community' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
