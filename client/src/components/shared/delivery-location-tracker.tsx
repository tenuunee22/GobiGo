import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigation, MapPin, Clock, Loader2 } from 'lucide-react';

// Define map container style for the square map
const mapContainerStyle = {
  width: '100%',
  height: '200px',
  aspectRatio: '1/1',
};

// Define marker icons - will be created after Google Maps API is loaded
let originIcon: any;
let destinationIcon: any;

// Animation timing
const ANIMATION_INTERVAL = 1000; // Update every second
const FULL_ROUTE_DURATION = 60; // Consider the route takes 60 steps to complete

interface DeliveryLocationTrackerProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  estimatedTime?: string;
  className?: string;
  deliveryPersonName?: string;
}

export function DeliveryLocationTracker({
  origin,
  destination,
  estimatedTime = '15-20 мин',
  className = '',
  deliveryPersonName = 'Жолооч'
}: DeliveryLocationTrackerProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentPosition, setCurrentPosition] = useState(origin);
  const [progress, setProgress] = useState(0);
  const [routePoints, setRoutePoints] = useState<google.maps.LatLng[]>([]);
  
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"],
  });

  // Initialize icons and handle route calculation
  useEffect(() => {
    if (!isLoaded) return;
    
    // Initialize marker icons after Google Maps is loaded
    originIcon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(32, 32),
    };
    
    destinationIcon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(32, 32),
    };
    
    try {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            
            // Extract route points for animation
            if (result.routes.length > 0 && result.routes[0].overview_path.length > 0) {
              setRoutePoints(result.routes[0].overview_path);
            }
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }, [isLoaded, origin, destination]);
  
  // Animate delivery person moving along the route
  useEffect(() => {
    if (routePoints.length === 0) return;
    
    const intervalId = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (1 / FULL_ROUTE_DURATION);
        
        if (newProgress >= 1) {
          clearInterval(intervalId);
          return 1;
        }
        
        // Calculate position along the route
        const pointIndex = Math.min(
          Math.floor(newProgress * (routePoints.length - 1)), 
          routePoints.length - 1
        );
        
        // If we're at the end, use destination
        if (pointIndex >= routePoints.length - 1) {
          setCurrentPosition(destination);
          return newProgress;
        }
        
        // Interpolate between points for smoother animation
        const currentPoint = routePoints[pointIndex];
        const nextPoint = routePoints[Math.min(pointIndex + 1, routePoints.length - 1)];
        
        const fracBetweenPoints = 
          (newProgress * (routePoints.length - 1)) - pointIndex;
        
        const position = {
          lat: currentPoint.lat() + (nextPoint.lat() - currentPoint.lat()) * fracBetweenPoints,
          lng: currentPoint.lng() + (nextPoint.lng() - currentPoint.lng()) * fracBetweenPoints
        };
        
        setCurrentPosition(position);
        return newProgress;
      });
    }, ANIMATION_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [routePoints, destination]);
  
  // Display error if Maps API fails to load
  if (loadError) {
    return (
      <Card className={className}>
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
  
  // Loading state
  if (!isLoaded) {
    return (
      <Card className={className}>
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
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Navigation className="mr-2 h-5 w-5 text-primary" />
              {deliveryPersonName} замд яваа
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="mr-1 h-4 w-4" /> 
              Хүрэх хугацаа: {estimatedTime}
            </CardDescription>
          </div>
          
          {/* Progress indicator */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-primary">
              {Math.round(progress * 100)}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md overflow-hidden border">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentPosition}
            zoom={14}
            options={{
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              zoomControl: false,
            }}
          >
            {/* Origin marker (restaurant/business) */}
            <Marker 
              position={origin}
              icon={originIcon}
              title="Хүргэлтийн эх газар"
            />
            
            {/* Destination marker (customer) */}
            <Marker 
              position={destination}
              icon={destinationIcon}
              title="Хүргэлтийн хаяг"
            />
            
            {/* Current position of delivery person */}
            <Marker 
              position={currentPosition}
              icon={{
                path: 'M8 12l-4.7023 2.4721.898-5.236L.3917 5.5279l5.2656-.7653L8 0l2.3427 4.7626 5.2656.7653-3.804 3.7082.898 5.236z',
                fillColor: '#3b82f6',
                fillOpacity: 1,
                scale: 1.5,
                strokeColor: '#1d4ed8',
                strokeWeight: 1,
                rotation: 0,
                anchor: new google.maps.Point(8, 8),
              }}
              animation={google.maps.Animation.BOUNCE}
              title={deliveryPersonName}
            />
            
            {/* Display route */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#3b82f6',
                    strokeWeight: 4,
                    strokeOpacity: 0.7,
                  }
                }}
              />
            )}
          </GoogleMap>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Эх газар</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>Жолооч</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Хүргэх хаяг</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}