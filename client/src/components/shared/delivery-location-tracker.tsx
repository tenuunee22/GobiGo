import React, { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, RefreshCw } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface DeliveryLocationTrackerProps {
  currentLocation?: Location;
  destination?: Location;
  height?: string;
  className?: string;
}

export function DeliveryLocationTracker({
  currentLocation,
  destination,
  height = "400px",
  className = ""
}: DeliveryLocationTrackerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);
  const destinationIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    scaledSize: { width: 32, height: 32 }
  };
  const originIcon = {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    scaledSize: { width: 32, height: 32 }
  };

  const onLoad = useCallback((map: any) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  const calculateRoute = useCallback(() => {
    if (!isLoaded || !currentLocation || !destination) return;
    
    try {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(currentLocation);
      bounds.extend(destination);
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [isLoaded, map, currentLocation, destination]);

  useEffect(() => {
    if (isLoaded && currentLocation && destination && map) {
      calculateRoute();
    }
  }, [isLoaded, calculateRoute, currentLocation, destination, map]);

  if (!currentLocation || !destination) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div
          className="flex items-center justify-center bg-blue-50"
          style={{ height }}
        >
          <div className="text-center p-4">
            <Navigation className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-blue-800 font-medium">
              Байршил мэдээлэл боломжгүй байна
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Хүргэлтийн байршлыг харуулах боломжгүй
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <div
          ref={ref}
          style={{ height }}
          className="w-full bg-blue-50 flex items-center justify-center"
        >
          <div className="text-center p-4">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-spin" />
            <p className="text-blue-800 font-medium">Карт ачаалж байна...</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white shadow-md"
            onClick={calculateRoute}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Шинэчлэх
          </Button>
        </div>
      </div>
    </Card>
  );
}