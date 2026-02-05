import React from 'react';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import Button from '../Button';
import Input from '../Input';
import { communityApi } from '../../services/api/community.api';

interface CommunityInviteFormProps {
    communityId: string;
}

const inviteSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const CommunityInviteForm: React.FC<CommunityInviteFormProps> = ({ communityId }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(inviteSchema)
    });

    const onInvite = async (data: { email: string }) => {
        try {
            await communityApi.invite(communityId, data.email);
            toast.success(`Invitation sent to ${data.email}`);
            reset();
        } catch (error: unknown) {
             const message = error instanceof AxiosError 
                ? error.response?.data?.message 
                : 'Failed to send invite';
             toast.error(message);
        }
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <p>Invite people to your community via email. They will receive an email invitation and an in-app notification if they are already registered.</p>
            </div>

            <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
                <Input 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    placeholder="friend@example.com"
                    register={register}
                    error={errors.email} 
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Mail className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button>
            </form>
        </div>
    );
};

export default CommunityInviteForm;
