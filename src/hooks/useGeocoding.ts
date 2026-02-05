import { useState, useCallback } from 'react';
import axios from 'axios';

interface Coordinates {
    lat: number;
    lng: number;
}

export const useGeocoding = () => {
    const [isLoading, setIsLoading] = useState(false);

    const searchAddress = useCallback(async (address: string): Promise<Coordinates | null> => {
        if (!address.trim()) return null;
        
        setIsLoading(true);
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1,
                }
            });

            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { lat: parseFloat(lat), lng: parseFloat(lon) };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            // Don't toast on simple type errors, only real failures if needed
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getAddressFromCoordinates = useCallback(async (lat: number, lng: number): Promise<string | null> => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    lat,
                    lon: lng,
                    format: 'json',
                }
            });

            if (response.data && response.data.display_name) {
                return response.data.display_name;
            }
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        searchAddress,
        getAddressFromCoordinates,
        isLoading
    };
};
