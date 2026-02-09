import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import Button from '../common/Button';
import Input from '../forms/Input';
import { communityApi } from '../../services/api/community.api';
import { UI_TEXT, ERROR_MESSAGES, BUTTON_TEXT } from '../../constants/text.constants';
import type { CommunityInviteFormProps } from '../../types/community.types';

const inviteSchema = Yup.object({
    email: Yup.string().email(ERROR_MESSAGES.EMAIL_INVALID).required(ERROR_MESSAGES.EMAIL_REQUIRED),
});

const buttonTextLookup = {
    true: BUTTON_TEXT.SENDING,
    false: BUTTON_TEXT.SEND_INVITATION
} as const;

const CommunityInviteForm = ({ communityId }: CommunityInviteFormProps) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(inviteSchema)
    });

    const onInvite = async (data: { email: string }) => {
        try {
            await communityApi.invite(communityId, data.email);
            toast.success(`${UI_TEXT.INVITATION_SENT_TO} ${data.email}`);
            reset();
        } catch (error: unknown) {
             const message = error instanceof AxiosError 
                ? error.response?.data?.message 
                : ERROR_MESSAGES.INVITE_FAILED;
             toast.error(message);
        }
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <p>{UI_TEXT.INVITE_PEOPLE_HINT}</p>
            </div>

            <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
                <Input 
                    label={UI_TEXT.AUTH_EMAIL_LABEL} 
                    name="email" 
                    type="email" 
                    placeholder={UI_TEXT.PLACEHOLDER_FRIEND_EMAIL}
                    register={register}
                    error={errors.email} 
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Mail className="w-4 h-4 mr-2" />
                    {buttonTextLookup[String(isSubmitting) as 'true' | 'false']}
                </Button>
            </form>
        </div>
    );
};

export default CommunityInviteForm;
