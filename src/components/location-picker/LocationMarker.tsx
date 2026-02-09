import { Marker, useMapEvents } from 'react-leaflet';
import type { LocationMarkerProps } from '../../types/map.types';

const LocationMarker = ({ position, setPosition, onChange }: LocationMarkerProps) => {
    useMapEvents({
        click(e) {
            const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
            setPosition(newPos);
            onChange(newPos);
        },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

export default LocationMarker;
