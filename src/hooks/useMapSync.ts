import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { Location } from '../types/map.types';

export const useMapSync = (position: Location) => {
    const map = useMap();
    
    useEffect(() => {
        if (position) {
            map.flyTo([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);

    return null;
};
