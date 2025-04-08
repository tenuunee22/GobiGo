import { useState, useEffect, useCallback } from 'react';
import { GoogleMapComponent } from './google-map';
interface GoogleMapWithDirectionsProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  driverName?: string;
}
export function GoogleMapWithDirections({ 
  origin, 
  destination, 
  driverName = "Жолооч" 
}: GoogleMapWithDirectionsProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchDirections = useCallback(async () => {
    if (!window.google || !window.google.maps) {
      setError("Google Maps API ачааллагдаагүй байна");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirections(result);
      setIsLoading(false);
    } catch (err) {
      console.error("Directions API error:", err);
      setError("Чиглэл авахад алдаа гарлаа");
      setIsLoading(false);
    }
  }, [origin, destination]);
  useEffect(() => {
    fetchDirections();
    const interval = setInterval(() => {
      fetchDirections();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchDirections]);
  const getEstimatedArrival = () => {
    if (!directions || !directions.routes || !directions.routes[0]) {
      return "Тооцоолж байна...";
    }
    const route = directions.routes[0];
    const duration = route.legs[0].duration?.text || "Тооцоолох боломжгүй";
    return duration;
  };
  const driverMarker = {
    position: origin,
    title: driverName,
    icon: "https:
  };
  const destinationMarker = {
    position: destination,
    title: "Хүргэлтийн хаяг",
  };
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
        {error}
      </div>
    );
  }
  return (
    <div className="w-full h-full relative">
      <GoogleMapComponent
        markers={[driverMarker, destinationMarker]}
        directions={directions}
        showDirections={true}
        center={origin}
        zoom={14}
      />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <p className="text-xs text-gray-500">Хүрэх хугацаа</p>
        <p className="font-medium">{getEstimatedArrival()}</p>
      </div>
    </div>
  );
}
