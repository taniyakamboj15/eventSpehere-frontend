import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink } from 'lucide-react';
import { configureLeafletIcons } from '../../utils/map.utils';
import { MAP_CONFIG } from '../../constants/map.constants';
import { UI_TEXT } from '../../constants/text.constants';
import type { EventMapProps } from '../../types/map.types';

configureLeafletIcons();

const EventMap = ({ latitude, longitude, address }: EventMapProps) => {
    const googleMapsUrl = `${MAP_CONFIG.GOOGLE_MAPS_BASE_URL}&query=${latitude},${longitude}`;

    return (
        <div className="space-y-4">
            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                <MapContainer
                    center={[latitude, longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution={MAP_CONFIG.ATTRIBUTION}
                        url={MAP_CONFIG.TILE_LAYER_URL}
                    />
                    <Marker position={[latitude, longitude]}>
                        <Popup>
                            {address}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-gray-50 border border-border rounded-xl text-sm font-bold transition-all text-primary hover:shadow-md"
            >
                <ExternalLink className="w-4 h-4" />
                {UI_TEXT.OPEN_IN_GOOGLE_MAPS}
            </a>
        </div>
    );
};

export default EventMap;
