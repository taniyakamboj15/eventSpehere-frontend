import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    initialLocation?: Location;
    onChange: (location: Location) => void;
}

const LocationPicker = ({ initialLocation, onChange }: LocationPickerProps) => {
    const [position, setPosition] = useState<Location>(initialLocation || { lat: 51.505, lng: -0.09 });

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
            </MapContainer>
            <p className="text-xs text-textSecondary mt-1 px-2">Click on the map to set event location</p>
        </div>
    );
};

export default LocationPicker;
