import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/forms/Input';
import Button from '../components/common/Button';
import { useSubmit, useActionData } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Mail, Shield, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { setCredentials } from '../store/authSlice';
import { UI_TEXT, BUTTON_TEXT } from '../constants/text.constants';
import type { ProfileFormData } from '../types/form.types';
import type { AuthActionData } from '../types/action.types';

import StatusHandler from '../components/common/StatusHandler';

const UserProfilePage = () => {
    const { user, accessToken } = useAuth();
    const dispatch = useDispatch();
    const submit = useSubmit();
    const actionData = useActionData() as AuthActionData;
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormData>({
        defaultValues: {
            name: user?.name,
            email: user?.email,
        }
    });

    useEffect(() => {
        if (actionData?.success && actionData.user) {
            dispatch(setCredentials({ 
                user: actionData.user, 
                accessToken: accessToken || '' 
            }));
            setIsEditing(false);
        }
    }, [actionData, dispatch, accessToken]);

    const onSubmit = (data: ProfileFormData) => {
        submit(data as unknown as Record<string, string>, { 
            method: "post", 
            action: "/profile",
            encType: "application/json" 
        });
    };

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <StatusHandler isLoading={false} isEmpty={!user} emptyTitle="Profile not found">
                {user && (
                    <>
                        <h1 className="text-3xl font-bold text-text mb-8">{UI_TEXT.NAV_DASHBOARD === 'Dashboard' ? 'My Profile' : UI_TEXT.NAV_DASHBOARD}</h1>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* ID Card */}
                            <div className="md:col-span-1">
                                <div className="bg-surface rounded-3xl p-8 border border-border shadow-lg relative overflow-hidden text-center">
                                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-primary/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-bold text-text mb-1">{user.name}</h2>
                                    <span className="inline-block px-3 py-1 bg-gray-100 text-textSecondary text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                                        {user.role}
                                    </span>
                                    <div className="pt-6 border-t border-border flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-sm text-textSecondary">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-textSecondary">
                                            <Shield className="w-4 h-4" />
                                            <span>ID: {user._id?.slice(-6) || '...'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="md:col-span-2 space-y-8">
                                <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-text">Account Details</h3>
                                        <Button 
                                            variant={isEditing ? 'secondary' : 'outline'} 
                                            size="sm" 
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            {isEditing ? BUTTON_TEXT.CANCEL : 'Edit Profile'}
                                        </Button>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {actionData?.error && (
                                            <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
                                                {actionData.error}
                                            </div>
                                        )}
                                        <Input
                                            label={UI_TEXT.LABEL_FULL_NAME}
                                            name="name"
                                            register={register}
                                            disabled={!isEditing}
                                            icon={<User className="w-4 h-4 text-textSecondary" />}
                                        />
                                        <Input
                                            label={UI_TEXT.LABEL_EMAIL_ADDRESS}
                                            name="email"
                                            register={register}
                                            disabled={!isEditing}
                                            icon={<Mail className="w-4 h-4 text-textSecondary" />}
                                        />
                                        {isEditing && (
                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" isLoading={isSubmitting}>{BUTTON_TEXT.SAVE_CHANGES}</Button>
                                            </div>
                                        )}
                                    </form>
                                </div>

                                {/* Upgrade Status */}
                                {user.role === 'ATTENDEE' && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-blue-900 mb-2">Organizer Status</h3>
                                                {(() => {
                                                    const statusConfigs: Record<string, React.ReactNode> = {
                                                        'PENDING': (
                                                            <p className="text-blue-700">
                                                                Your application is currently <strong>Under Review</strong>. You will be notified once an admin processes your request.
                                                            </p>
                                                        ),
                                                        'REJECTED': (
                                                            <p className="text-red-700">
                                                                Your application was not approved. Please contact support for more information.
                                                            </p>
                                                        ),
                                                        'DEFAULT': (
                                                            <div>
                                                                <p className="text-blue-700 mb-4">
                                                                    Want to host your own events? Upgrade your account to become an community organizer.
                                                                </p>
                                                            </div>
                                                        )
                                                    };
                                                    return statusConfigs[user.upgradeStatus || 'DEFAULT'] || statusConfigs['DEFAULT'];
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </StatusHandler>
        </div>
    );
};

export default UserProfilePage;
