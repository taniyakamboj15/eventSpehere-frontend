import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { configureLeafletIcons } from '../../utils/map.utils';
import { MAP_CONFIG, DEFAULT_LOCATION } from '../../constants/map.constants';
import type { LocationPickerProps } from '../../types/map.types';

configureLeafletIcons();

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPicker = ({ initialLocation, onChange, forcePosition }: LocationPickerProps) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(
    initialLocation || forcePosition || DEFAULT_LOCATION
  );

  useEffect(() => {
    if (forcePosition) {
        setPosition(forcePosition);
    }
  }, [forcePosition]);

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        className="h-full w-full"
        key={`${position.lat}-${position.lng}`}
      >
        <TileLayer
            attribution={MAP_CONFIG.ATTRIBUTION}
            url={MAP_CONFIG.TILE_LAYER_URL}
        />
        <MapEvents onLocationSelect={(lat, lng) => {
            const newPos = { lat, lng };
            setPosition(newPos);
            onChange(newPos);
        }} />
        <Marker position={[position.lat, position.lng]} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
