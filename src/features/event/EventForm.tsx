import { useState, useEffect } from 'react';
import { useForm, useWatch, type FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { eventSchema } from '../../validators/event.schema';
import { eventApi } from '../../services/api/event.api';
import { EventCategory, EventVisibility, type IEvent } from '../../types/event.types';
import { type ICommunity } from '../../types/community.types';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Button from '../../components/Button';
import ImageUpload from '../../components/ImageUpload';
import LocationPicker from '../../components/LocationPicker';
import { AxiosError } from 'axios';

type EventFormData = Yup.InferType<typeof eventSchema>;

interface EventFormProps {
    initialData?: IEvent;
    isEditing?: boolean;
    initialCommunityId?: string;
}

const EventForm = ({ initialData, isEditing = false, initialCommunityId }: EventFormProps) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>(initialData?.photos?.[0] || '');

    useEffect(() => {
        if (initialData?.photos?.[0]) {
            setImageUrl(initialData.photos[0]);
        }
    }, [initialData]);

    const [communities, setCommunities] = useState<ICommunity[]>([]);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EventFormData>({
        resolver: yupResolver(eventSchema) as any, // Cast resolver due to RHF/Yup version mismatch often causing type issues, but safer than ts-ignore
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            category: (initialData?.category as EventCategory) || EventCategory.MEETUP,
            visibility: (initialData?.visibility as EventVisibility) || (initialCommunityId ? EventVisibility.COMMUNITY_ONLY : EventVisibility.PUBLIC),
            startDateTime: initialData?.startDateTime || '',
            endDateTime: initialData?.endDateTime || '',
            capacity: initialData?.capacity || 50,
            isRecurring: !!initialData?.recurringRule,
            communityId: initialData?.community 
                ? (typeof initialData.community === 'string' ? initialData.community : (initialData.community as any)._id) 
                : (initialCommunityId || ''),
            location: {
                address: initialData?.location?.address || '',
                latitude: initialData?.location?.coordinates?.[1] || 51.505,
                longitude: initialData?.location?.coordinates?.[0] || -0.09
            },
            recurringRule: initialData?.recurringRule ? {
                frequency: initialData.recurringRule.frequency,
                interval: initialData.recurringRule.interval,
                endDate: initialData.recurringRule.endDate
            } : undefined
        },
    });

    const visibility = useWatch({ control, name: 'visibility' });
    const watchCommunityId = useWatch({ control, name: 'communityId' });
    const isCommunityOnly = visibility === EventVisibility.COMMUNITY_ONLY;
    const isRecurring = useWatch({ control, name: 'isRecurring' });

    // Fetch user's communities to populate dropdown
    useEffect(() => {
        const fetchCommunities = async () => {
             try {
                // Determine if we should show ALL communities user is member of, 
                // or only ones where they are admin? 
                // For now, let's assume organizers can post events to any community they are part of 
                // (or we can filter for 'admin' role if needed later).
                // Using the specific 'my' endpoint we just fixed.
                const { communityApi } = await import('../../services/api/community.api');
                const myCommunities = await communityApi.getAll({ memberId: 'me' });
                setCommunities(myCommunities);
             } catch (err) {
                 console.error('Failed to load communities', err);
             }
        };
        fetchCommunities();
    }, []);

    // Helper for safe error access
    const getError = (path: string): FieldError | undefined => {
        const parts = path.split('.');
        let current: any = errors;
        for (const part of parts) {
            current = current?.[part];
        }
        return current as FieldError | undefined;
    };

    const onSubmit = async (data: EventFormData) => {
        try {
            // Flatten payload for backend
            
            // Explicitly cast or construct to match backend expectation
            // Data is strictly typed from form, but we need to massage it to IEvent payload
            
            // Create a payload that extends IEvent with form-specific fields like inviteEmails
            const payload = {
                title: data.title,
                description: data.description,
                category: data.category as EventCategory,
                visibility: data.visibility as EventVisibility,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                capacity: data.capacity,
                location: {
                    address: data.location?.address || '',
                    type: 'Point' as const,
                    coordinates: [
                         Number(data.location?.longitude || '-0.09'),
                         Number(data.location?.latitude || '51.505')
                    ] as [number, number]
                },
                photos: imageUrl ? [imageUrl] : [],
                recurringRule: data.isRecurring && data.recurringRule ? {
                    frequency: (data.recurringRule.frequency || 'WEEKLY') as 'DAILY' | 'WEEKLY' | 'MONTHLY', // Default or handle undefined
                    interval: data.recurringRule.interval || 1,
                    endDate: data.recurringRule.endDate
                } : undefined,
                community: data.communityId || undefined, 
                inviteEmails: data.inviteEmails ? data.inviteEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e) : [],
            };
            
            if (isEditing && initialData?._id) {
                await eventApi.update(initialData._id, payload);
                toast.success('Event updated successfully!');
            } else {
                await eventApi.create(payload); 
                toast.success('Event created successfully!');
            }
            navigate(ROUTES.DASHBOARD);
        } catch (error: unknown) {
            console.error('Event save error:', error);
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || 'Failed to save event.';
                toast.error(message);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-surface p-8 rounded-xl border border-border shadow-sm mb-12">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-text">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
                <p className="text-textSecondary text-sm">{isEditing ? 'Update your event details below.' : 'Fill in the details below to host your event.'}</p>
            </div>

            <Input
                label="Event Title"
                name="title"
                type="text"
                register={register}
                error={errors.title}
                placeholder="e.g., Annual Block Party"
            />

            <div className="mb-6">
                 <label className="block text-sm font-medium text-textSecondary mb-2">Event Cover Image</label>
                 <ImageUpload onUpload={setImageUrl} defaultImage={imageUrl} />
            </div>

            <Textarea
                label="Description"
                name="description"
                register={register}
                error={errors.description}
                placeholder="Describe your event..."
                rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Category"
                    name="category"
                    register={register}
                    error={errors.category}
                    options={Object.values(EventCategory).map(c => ({ value: c, label: c }))}
                />

                {/* Visibility & Community Selection */}
                <div className="space-y-4 md:col-span-2">
                     <Select
                        label="Visibility"
                        name="visibility"
                        register={register}
                        error={errors.visibility}
                        options={[
                            { value: EventVisibility.PUBLIC, label: 'Public (Everyone)' },
                            { value: EventVisibility.COMMUNITY_ONLY, label: 'Community Members Only' },
                            { value: EventVisibility.PRIVATE_INVITE, label: 'Private (Invite Only)' },
                        ]}
                    />

                    {/* Show Community Select if we have communities */}
                    {visibility === EventVisibility.COMMUNITY_ONLY && communities.length > 0 && (
                        <div className="form-control w-full">
                            <label className="label block text-sm font-medium text-textSecondary mb-2">
                                <span className="label-text">Host Community</span>
                            </label>
                            <select 
                                {...register('communityId')}
                                className="select select-bordered w-full p-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="">Select a Community</option>
                                {communities.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.communityId && <p className="text-red-500 text-xs mt-1">{errors.communityId.message}</p>}
                        </div>
                    )}

                    {/* Invite Emails Input */}
                    {(visibility === EventVisibility.PRIVATE_INVITE || visibility === EventVisibility.PUBLIC || visibility === EventVisibility.COMMUNITY_ONLY) && (
                         <div className="form-control w-full"> 
                             {/* Always allow inviting, but enforce for PRIVATE */}
                             <Textarea
                                label={visibility === EventVisibility.PRIVATE_INVITE ? "Invitee Emails (Required)" : "Invite People (Optional)"}
                                name="inviteEmails"
                                register={register}
                                error={errors.inviteEmails}
                                placeholder="Enter email addresses separated by commas (e.g., alice@example.com, bob@example.com)"
                                rows={3}
                            />
                            {visibility === EventVisibility.PRIVATE_INVITE && (
                                <p className="text-xs text-textSecondary mt-1">
                                    For private events, only people with these email addresses will be able to see and join the event.
                                </p>
                            )}
                         </div>
                    )}
                </div>

                </div>

                {isCommunityOnly && !watchCommunityId && (
                     <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                        <span>⚠️</span>
                        <span>You selected "Community Members Only". Please select a community to associate this event with, or it will not be visible to the right people.</span>
                     </div>
                )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Start Date & Time"
                    name="startDateTime"
                    type="datetime-local"
                    register={register}
                    error={errors.startDateTime}
                />

                <Input
                    label="End Date & Time"
                    name="endDateTime"
                    type="datetime-local"
                    register={register}
                    error={errors.endDateTime}
                />
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-lg">Location Details</h3>
                
                <Input
                    label="Venue Address"
                    name="location.address"
                    type="text"
                    register={register}
                    error={errors.location?.address}
                    placeholder="123 Main St, City"
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-textSecondary">Pick Location on Map</label>
                    <LocationPicker 
                        onChange={(pos) => {
                            setValue('location.latitude', pos.lat);
                            setValue('location.longitude', pos.lng);
                        }}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">
                            Lat: <span className="font-mono">{useWatch({ control, name: 'location.latitude' }) || '51.505'}</span>
                        </div>
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">
                            Lng: <span className="font-mono">{useWatch({ control, name: 'location.longitude' }) || '-0.09'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
                <h3 className="font-semibold text-lg">Additional Settings</h3>
                
                <Input
                    label="Capacity"
                    name="capacity"
                    type="number"
                    register={register}
                    error={errors.capacity}
                    min={1}
                />

                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                     <input 
                        type="checkbox" 
                        id="isRecurring"
                        {...register('isRecurring')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                     />
                     <label htmlFor="isRecurring" className="text-sm font-medium text-text">This is a recurring event</label>
                </div>

                {isRecurring && (
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Frequency"
                                name="recurringRule.frequency"
                                register={register}
                                error={getError('recurringRule.frequency')}
                                options={[
                                    { value: 'DAILY', label: 'Daily' },
                                    { value: 'WEEKLY', label: 'Weekly' },
                                    { value: 'MONTHLY', label: 'Monthly' },
                                ]}
                            />
                             <Input
                                label="Interval"
                                name="recurringRule.interval"
                                type="number"
                                register={register}
                                error={getError('recurringRule.interval')}
                                min={1}
                            />
                        </div>
                         <Input
                            label="End Date"
                            name="recurringRule.endDate"
                            type="date"
                            register={register}
                            error={getError('recurringRule.endDate')}
                        />
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full py-4 text-lg" isLoading={isSubmitting}>
                {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
        </form>
    );
};

export default EventForm;
