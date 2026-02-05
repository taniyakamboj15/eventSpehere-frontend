import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';

export const useOrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanningEventId, setScanningEventId] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
    try {
        const userId = user?._id || user?.id;
        
        if (!userId) {
            console.warn('User ID not found in dashboard');
            return;
        }

        const response = await eventApi.getAll({ organizer: userId, limit: 100, time: 'ALL' }); 
        setEvents(response.data?.data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [fetchMyEvents, user]);

  return {
    events,
    isLoading,
    scanningEventId,
    setScanningEventId,
    fetchMyEvents
  };
};
