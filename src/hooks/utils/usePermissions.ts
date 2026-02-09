import { useMemo, useCallback } from 'react';
import { useAuth } from '../useAuth';
import type { IEvent } from '../../types/event.types';
import type { ICommunity } from '../../types/community.types';

export const usePermissions = () => {
    const { user } = useAuth();

    const getEventPermissions = useCallback((event: IEvent | null, rsvpStatus?: string) => {
        if (!event || !user || !user.id) {
            return { 
                canManage: false, 
                isOrganizer: false, 
                canUpload: false, 
                isEventEnded: event ? new Date() > new Date(event.endDateTime) : false 
            };
        }

        const isOrganizer = typeof event.organizer === 'string' 
            ? event.organizer === user.id 
            : event.organizer._id === user.id;

        const isCommunityAdmin = event.community && 
            typeof event.community !== 'string' && 
            'admins' in (event.community as unknown as ICommunity) && 
            (event.community as unknown as ICommunity).admins?.includes(user.id);

        const canManage = isOrganizer || isCommunityAdmin;
        const isEventEnded = new Date() > new Date(event.endDateTime);
        const isAttendee = rsvpStatus === 'GOING';

        return {
            isOrganizer,
            canManage,
            isEventEnded,
            canUpload: isEventEnded && (canManage || isAttendee)
        };
    }, [user]);

    const getCommunityPermissions = useCallback((community: ICommunity | null) => {
        if (!community || !user || !user.id) return { isAdmin: false, isMember: false };

        const isAdmin = community.admins.includes(user.id);
        const isMember = community.members.includes(user.id);

        return { isAdmin, isMember };
    }, [user]);

    return useMemo(() => ({ 
        getEventPermissions, 
        getCommunityPermissions, 
        user 
    }), [getEventPermissions, getCommunityPermissions, user]);
};
