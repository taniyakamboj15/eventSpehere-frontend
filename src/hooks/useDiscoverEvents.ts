import { useState, useEffect, useCallback } from 'react';
import { eventApi, type GetEventsParams } from '../services/api/event.api';
import { EventCategory, type IEvent } from '../types/event.types';
import { toast } from 'react-hot-toast';

export const useDiscoverEvents = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    
    // Unified Filter State
    const [filters, setFilters] = useState<{
        search: string;
        category: EventCategory | null;
        location: { lat: number; lng: number; radius: number; name?: string } | null;
    }>({
        search: '',
        category: null,
        location: null
    });

    const fetchEvents = useCallback(async (pageNum = 1, reset = false) => {
        try {
            setIsLoading(true);
            const params: GetEventsParams = {
                page: pageNum,
                limit: 12
            };
            
            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.location) {
                params.lat = filters.location.lat;
                params.lng = filters.location.lng;
                params.radius = filters.location.radius;
            }

            const response = await eventApi.getAll(params);
            
            const newEvents = response.data?.data || [];
            const meta = response.data?.meta;

            if (reset || pageNum === 1) {
                setEvents(newEvents);
            } else {
                setEvents(prev => [...prev, ...newEvents]);
            }
            
            setHasMore(pageNum < (meta?.totalPages || 1));
            setPage(pageNum);
            setError(null);
        } catch (err) {
            setError('Failed to load events');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]); // Re-create when filters change

    // Reset and fetch when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => fetchEvents(1, true), 300);
        return () => clearTimeout(timeoutId);
    }, [fetchEvents]); 

    // Infinite Scroll Handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                if (hasMore && !isLoading) {
                    fetchEvents(page + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoading, page, fetchEvents]);

    const handleLocationClick = useCallback(() => {
        if (navigator.geolocation) {
            setIsLoading(true);
            toast.loading('Getting your location...', { id: 'geo' });
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    let locationName = 'Current Location';

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        if (data && data.address) {
                            locationName = data.address.city || data.address.town || data.address.village || data.address.county || 'Nearby';
                        }
                    } catch (e) {
                        console.error('Reverse geocoding failed', e);
                    }

                    toast.dismiss('geo');
                    toast.success(`Found you in ${locationName}!`);
                    
                    setFilters(prev => ({
                        ...prev,
                        location: {
                            lat: latitude,
                            lng: longitude,
                            radius: 10,
                            name: locationName
                        }
                    }));
                },
                (_err) => {
                    toast.dismiss('geo');
                    toast.error('Could not get location. Check permissions.');
                    setIsLoading(false);
                }
            );
        } else {
            toast.error('Geolocation not supported');
        }
    }, []);

    const clearLocation = useCallback(() => {
        setFilters(prev => ({ ...prev, location: null }));
        toast.success('Location filter cleared');
    }, []);

    return {
        events,
        isLoading,
        error,
        filters,
        setFilters,
        handleLocationClick,
        clearLocation
    };
};
