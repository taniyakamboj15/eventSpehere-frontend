export interface Location {
    lat: number;
    lng: number;
}

export interface EventMapProps {
    latitude: number;
    longitude: number;
    address: string;
}

export interface LocationPickerProps {
    initialLocation?: Location;
    onChange: (location: Location) => void;
    forcePosition?: Location | null;
}

export interface MapUpdaterProps {
    position: Location;
}

export interface LocationMarkerProps {
    position: Location;
    setPosition: (pos: Location) => void;
    onChange: (pos: Location) => void;
}
