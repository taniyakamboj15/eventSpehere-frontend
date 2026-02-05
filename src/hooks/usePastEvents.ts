import { useState, useEffect } from 'react';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';

export const usePastEvents = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    
    useEffect(() => {
        const loadMemories = async () => {
             try {
                const response = await eventApi.getAll({ time: 'PAST', limit: 4 });
                setEvents(response.data?.data || []);
             } catch (e) { 
                 console.error('Failed to load past events', e); 
             }
        };
        loadMemories();
    }, []);

    return { events };
};
