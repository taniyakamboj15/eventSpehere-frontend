import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, useWatch, type FieldError, type Resolver, type FieldPath } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSubmit, useActionData, useNavigate } from 'react-router-dom';
import { getNestedError } from '../../utils/form.utils';

import { eventSchema, type EventFormData } from '../../validators/event.schema';
import { communityApi } from '../../services/api/community.api';
import { EventCategory, EventVisibility, type IEvent } from '../../types/event.types';
import { type ICommunity } from '../../types/community.types';
import { ROUTES } from '../../constants/routes';


interface UseEventFormProps {
    initialData?: IEvent;
    isEditing?: boolean;
    initialCommunityId?: string;
}

export const useEventForm = ({ initialData, isEditing = false, initialCommunityId }: UseEventFormProps) => {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>(initialData?.photos?.[0] || '');
    const [communities, setCommunities] = useState<ICommunity[]>([]);

    useEffect(() => {
        if (initialData?.photos?.[0]) {
            setImageUrl(initialData.photos[0]);
        }
    }, [initialData]);

    const form = useForm<EventFormData>({
        resolver: yupResolver(eventSchema) as unknown as Resolver<EventFormData>, 
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
                ? (typeof initialData.community === 'string' ? initialData.community : (initialData.community as ICommunity)._id) 
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

    const { control, formState: { errors } } = form;
    
    // Watchers
    const visibility = useWatch({ control, name: 'visibility' });
    const watchCommunityId = useWatch({ control, name: 'communityId' });
    const isRecurring = useWatch({ control, name: 'isRecurring' });
    const latitude = useWatch({ control, name: 'location.latitude' });
    const longitude = useWatch({ control, name: 'location.longitude' });

    const isCommunityOnly = visibility === EventVisibility.COMMUNITY_ONLY;

    // Fetch user's communities
    useEffect(() => {
        const fetchCommunities = async () => {
             try {
                const myCommunities = await communityApi.getAll({ memberId: 'me' });
                setCommunities(myCommunities);
             } catch (err) {
                 console.error('Failed to load communities', err);
             }
        };
        fetchCommunities();
    }, []);

    // Helper for safe error access
    const getError = useCallback((path: string): FieldError | undefined => {
        return getNestedError(errors, path);
    }, [errors]);

    const submit = useSubmit();
    const actionData = useActionData() as { success?: boolean; error?: string; fieldErrors?: Record<string, string> };
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (actionData?.success) {
            navigate(ROUTES.DASHBOARD);
        } else if (actionData?.success === false) {
            if (actionData.fieldErrors) {
                Object.keys(actionData.fieldErrors).forEach((field) => {
                    form.setError(field as FieldPath<EventFormData>, {
                        type: 'server',
                        message: actionData.fieldErrors![field],
                    });
                });
            }
            setServerError(actionData.error || 'Operation failed');
        }
    }, [actionData, navigate, form]);

    const onSubmit = useCallback(async (data: EventFormData) => {
        setServerError(null);
        const payload = {
            ...data,
            category: data.category as EventCategory,
            visibility: data.visibility as EventVisibility,
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
                frequency: (data.recurringRule.frequency || 'WEEKLY') as 'DAILY' | 'WEEKLY' | 'MONTHLY',
                interval: data.recurringRule.interval || 1,
                endDate: data.recurringRule.endDate
            } : undefined,
            community: data.communityId || undefined, 
            inviteEmails: data.inviteEmails ? data.inviteEmails.split(',').map((e) => e.trim()).filter((e) => e) : [],
        };
        
        submit(payload as unknown as Record<string, string>, { 
            method: "post", 
            action: isEditing ? `/events/${initialData?._id}/edit` : ROUTES.CREATE_EVENT,
            encType: "application/json" 
        });
    }, [submit, isEditing, initialData?._id, imageUrl]);

    return useMemo(() => ({
        form,
        imageUrl,
        setImageUrl,
        communities,
        visibility,
        watchCommunityId,
        isRecurring,
        isCommunityOnly,
        latitude,
        longitude,
        getError,
        onSubmit,
        serverError
    }), [
        form, imageUrl, communities, visibility, watchCommunityId, 
        isRecurring, isCommunityOnly, latitude, longitude, getError, 
        onSubmit, serverError
    ]);
};
