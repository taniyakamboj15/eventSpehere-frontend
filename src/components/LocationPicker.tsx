import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { configureLeafletIcons } from '../utils/map.utils';

// Fix for default marker icon in leaflet
configureLeafletIcons();

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    initialLocation?: Location;
    onChange: (location: Location) => void;
    forcePosition?: Location | null; // New prop to force update
}

const MapUpdater = ({ position }: { position: Location }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([position.lat, position.lng], map.getZoom());
    }, [position, map]);
    return null;
};

const LocationPicker = ({ initialLocation, onChange, forcePosition }: LocationPickerProps) => {
    const [position, setPosition] = useState<Location>(initialLocation || { lat: 51.505, lng: -0.09 });

    // Sync state with forcePosition prop
    useEffect(() => {
        if (forcePosition) {
            setPosition(forcePosition);
        }
    }, [forcePosition]);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
                setPosition(newPos);
                onChange(newPos);
            },
        });

        return position ? <Marker position={[position.lat, position.lng]} /> : null;
    };

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border mt-2">
            <MapContainer
                center={[position.lat, position.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
                <MapUpdater position={position} />
            </MapContainer>
            <p className="text-xs text-textSecondary mt-1 px-2">Click on the map to set event location</p>
        </div>
    );
};

export default LocationPicker;
