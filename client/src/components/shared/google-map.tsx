import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};
const defaultCenter = {
  lat: 47.9184676,
  lng: 106.9177016
};
interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    icon?: string;
    title?: string;
  }>;
  directions?: google.maps.DirectionsResult | null;
  zoom?: number;
  showDirections?: boolean;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}
export function GoogleMapComponent({
  center = defaultCenter,
  markers = [],
  directions = null,
  zoom = 15,
  showDirections = false,
  onMapLoad,
  className = ''
}: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"]
  });
  const options = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  }), []);
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onMapLoad) onMapLoad(map);
  }, [onMapLoad]);
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`} style={mapContainerStyle}>
        Газрын зураг ачааллахад алдаа гарлаа. Дахин оролдоно уу.
      </div>
    );
  }
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`} style={mapContainerStyle}>
        Газрын зураг ачааллаж байна...
      </div>
    );
  }
  return (
    <div className={`${className}`} style={mapContainerStyle}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
            title={marker.title}
          />
        ))}
        {}
        {directions && showDirections && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true, 
              polylineOptions: {
                strokeColor: '#1976D2',
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}