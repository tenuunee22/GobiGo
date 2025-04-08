import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
};

// Default center - Ulaanbaatar
const defaultCenter = {
  lat: 47.9184676,
  lng: 106.917693,
};

interface MapViewProps {
  location?: { lat: number; lng: number; address?: string };
  businessName?: string;
  isInteractive?: boolean;
  zoom?: number;
}

export function MapView({
  location = defaultCenter,
  businessName = "Байршил",
  isInteractive = false,
  zoom = 15
}: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && location) {
      map.panTo(location);
    }
  }, [map, location]);

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Газрын зураг ачаалахад алдаа гарлаа</CardTitle>
          <CardDescription>Google Maps-тэй холбогдоход асуудал гарлаа</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Та дараа дахин оролдоно уу.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Газрын зураг ачаалж байна</CardTitle>
          <CardDescription>Түр хүлээнэ үү</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {businessName}
        </CardTitle>
        <CardDescription>
          {location?.address || "Байршлын хаяг оруулаагүй"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              fullscreenControl: isInteractive,
              mapTypeControl: isInteractive,
              streetViewControl: isInteractive,
              zoomControl: isInteractive,
              draggable: isInteractive
            }}
          >
            <Marker position={location} />
          </GoogleMap>
        </div>
      </CardContent>
    </Card>
  );
}