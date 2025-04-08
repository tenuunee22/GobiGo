import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const ulaanbaatarCenter = {
  lat: 47.9184676,
  lng: 106.917693,
};

const libraries: ("places")[] = ["places"];

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  businessName?: string;
}

export function LocationPicker({ 
  initialLocation = ulaanbaatarCenter, 
  onLocationChange,
  businessName = ''
}: LocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(initialLocation);
  const [marker, setMarker] = useState(initialLocation);
  const [address, setAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (initialLocation) {
      setCenter(initialLocation);
      setMarker(initialLocation);
      getAddressFromCoordinates(initialLocation);
    }
  }, [initialLocation]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLoc = { 
        lat: e.latLng.lat(), 
        lng: e.latLng.lng() 
      };
      setMarker(newLoc);
      getAddressFromCoordinates(newLoc);
    }
  };

  const getAddressFromCoordinates = async (location: { lat: number; lng: number }) => {
    if (!isLoaded || loadError) return;

    const geocoder = new google.maps.Geocoder();
    
    try {
      const response = await geocoder.geocode({ location });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address);
      } else {
        setAddress('Хаяг олдсонгүй');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('Хаяг олдсонгүй');
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim() || !isLoaded || loadError) return;
    
    setIsSearching(true);
    const geocoder = new google.maps.Geocoder();
    
    try {
      // Add city/country to bias search results to Mongolia/Ulaanbaatar
      const regionQuery = searchQuery + (
        searchQuery.toLowerCase().includes('улаанбаатар') || 
        searchQuery.toLowerCase().includes('ulaanbaatar') || 
        searchQuery.toLowerCase().includes('mongolia') || 
        searchQuery.toLowerCase().includes('монгол') 
          ? '' 
          : ', Улаанбаатар, Монгол'
      );
      
      const response = await geocoder.geocode({ address: regionQuery });
      
      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const newLoc = { 
          lat: location.lat(), 
          lng: location.lng() 
        };
        
        setCenter(newLoc);
        setMarker(newLoc);
        setAddress(response.results[0].formatted_address);
        
        if (map) {
          map.panTo(newLoc);
          map.setZoom(16);
        }
      } else {
        toast({
          title: "Хаяг олдсонгүй",
          description: "Өөр хаяг оруулж үзнэ үү",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Алдаа гарлаа",
        description: "Хайлт хийх үед алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSaveLocation = () => {
    onLocationChange({ 
      ...marker, 
      address
    });
    
    toast({
      title: "Байршил хадгалагдлаа",
      description: "Таны бизнесийн байршил амжилттай хадгалагдлаа",
    });
  };

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Алдаа гарлаа</CardTitle>
          <CardDescription>Google Maps ачаалахад алдаа гарлаа</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Газрын зургийг ачаалахад алдаа гарлаа. Та хуудсаа шинэчлэх буюу дараа дахин оролдоно уу.</p>
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
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {businessName ? `${businessName} - Байршил` : 'Бизнесийн байршил'}
        </CardTitle>
        <CardDescription>
          Бизнесийнхээ байршлыг газрын зураг дээр сонгоно уу
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Хаяг хайх (жиш: Сүхбаатарын талбай, Улаанбаатар)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Хайх
          </Button>
        </div>
        
        <div className="rounded-md overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
            }}
          >
            <Marker 
              position={marker} 
              draggable
              onDragEnd={(e) => {
                if (e.latLng) {
                  const newLoc = { 
                    lat: e.latLng.lat(), 
                    lng: e.latLng.lng() 
                  };
                  setMarker(newLoc);
                  getAddressFromCoordinates(newLoc);
                }
              }}
            />
          </GoogleMap>
        </div>
        
        <div className="pt-2">
          <Label htmlFor="address">Сонгосон хаяг:</Label>
          <div 
            id="address" 
            className="mt-1 p-2 border rounded-md bg-gray-50 min-h-10"
          >
            {address || "Газрын зураг дээр байршил сонгоно уу"}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          onClick={handleSaveLocation} 
          disabled={!address}
        >
          Байршил хадгалах
        </Button>
      </CardFooter>
    </Card>
  );
}