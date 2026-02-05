import { useState, useEffect } from 'react';
import { useForm, useWatch, type FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import * as Yup from 'yup';

import { eventSchema, type EventFormData } from '../../validators/event.schema';
import { eventApi } from '../../services/api/event.api';
import { communityApi } from '../../services/api/community.api';
import { EventCategory, EventVisibility, type IEvent } from '../../types/event.types';
import { type ICommunity } from '../../types/community.types';
import { ROUTES } from '../../constants/routes';
import { ERROR_MESSAGES } from '../../constants/text.constants';


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
        resolver: yupResolver(eventSchema) as any, 
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
    const getError = (path: string): FieldError | undefined => {
        const parts = path.split('.');
        let current: unknown = errors;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = (current as Record<string, unknown>)[part];
            } else {
                return undefined;
            }
        }
        return current as FieldError | undefined;
    };

    const onSubmit = async (data: EventFormData) => {
        try {
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
                    frequency: (data.recurringRule.frequency || 'WEEKLY') as 'DAILY' | 'WEEKLY' | 'MONTHLY',
                    interval: data.recurringRule.interval || 1,
                    endDate: data.recurringRule.endDate
                } : undefined,
                community: data.communityId || undefined, 
                inviteEmails: data.inviteEmails ? data.inviteEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e) : [],
            };
            
            if (isEditing && initialData?._id) {
                await eventApi.update(initialData._id, payload);
                toast.success(ERROR_MESSAGES.EVENT_UPDATED);
            } else {
                await eventApi.create(payload); 
                toast.success(ERROR_MESSAGES.EVENT_CREATED);
            }
            navigate(ROUTES.DASHBOARD);
        } catch (error: unknown) {
            console.error('Event save error:', error);
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || ERROR_MESSAGES.EVENT_SAVE_ERROR;
                toast.error(message);
            } else {
                toast.error(ERROR_MESSAGES.GENERIC_ERROR);
            }
        }
    };

    return {
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
        onSubmit
    };
};
