import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, MapPin } from 'lucide-react';
const defaultCenter = {
  lat: 47.9184676,
  lng: 106.917693,
};
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  businessName?: string;
}
export function LocationPicker({ 
  initialLocation = defaultCenter, 
  onLocationChange,
  businessName = "Таны бизнес" 
}: LocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [address, setAddress] = useState<string>("");
  const [searchBoxRef, setSearchBoxRef] = useState<google.maps.places.SearchBox | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"],
  });
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBoxRef(ref);
  }, []);
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPosition);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Хаяг олдсонгүй");
        }
      });
    }
  }, []);
  const onPlacesChanged = () => {
    if (searchBoxRef) {
      const places = searchBoxRef.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setMarkerPosition(newPosition);
          setAddress(place.formatted_address || "");
          if (map) {
            map.panTo(newPosition);
            map.setZoom(16);
          }
        }
      }
    }
  };
  const handleSaveLocation = () => {
    setLoading(true);
    setTimeout(() => {
      onLocationChange({
        ...markerPosition,
        address: address
      });
      setLoading(false);
    }, 500);
  };
  useEffect(() => {
    if (initialLocation) {
      setMarkerPosition(initialLocation);
      if (isLoaded) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: initialLocation }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address);
          }
        });
      }
    }
  }, [initialLocation, isLoaded]);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {businessName} - Байршил сонгох
        </CardTitle>
        <CardDescription>
          Зурган дээр дарж байршил сонгох эсвэл хайх талбарт хаяг оруулна уу
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative mb-4">
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Байршил хайх..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </StandaloneSearchBox>
        </div>
        <div className="rounded-md overflow-hidden border h-80">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition}
            zoom={15}
            onLoad={onMapLoad}
            onClick={onMapClick}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </div>
        <div>
          <p className="text-sm font-medium">Сонгосон хаяг:</p>
          <p className="text-sm mt-1">{address || "Хаяг сонгоогүй байна"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleSaveLocation}
          disabled={!address || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Хадгалж байна...
            </>
          ) : (
            "Байршил хадгалах"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}