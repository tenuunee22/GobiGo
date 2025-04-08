import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigation, MapPin, Clock, Loader2 } from 'lucide-react';
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};
let originIcon: any;
let destinationIcon: any;
const ANIMATION_INTERVAL = 1000;
const FULL_ROUTE_DURATION = 60;
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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"],
  });
  useEffect(() => {
    if (!isLoaded) return;
    originIcon = {
      url: 'https:
      scaledSize: new google.maps.Size(32, 32),
    };
    destinationIcon = {
      url: 'https:
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
  useEffect(() => {
    if (routePoints.length === 0) return;
    const intervalId = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (1 / FULL_ROUTE_DURATION);
        if (newProgress >= 1) {
          clearInterval(intervalId);
          return 1;
        }
        const pointIndex = Math.min(
          Math.floor(newProgress * (routePoints.length - 1)), 
          routePoints.length - 1
        );
        if (pointIndex >= routePoints.length - 1) {
          setCurrentPosition(destination);
          return newProgress;
        }
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
    <Card className={`${className} fade-in dashboard-card-hover`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="slide-in-left">
            <CardTitle className="flex items-center">
              <Navigation className="mr-2 h-5 w-5 text-primary wiggle" />
              {deliveryPersonName} <span className="ml-1 text-primary">замд яваа</span> <span className="ml-2 tada">🚗</span>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="mr-1 h-4 w-4 pulse" /> 
              Хүрэх хугацаа: <span className="font-medium ml-1">{estimatedTime}</span> <span className="ml-1 heartbeat">⏱️</span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-center slide-in-right">
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
        <div className="rounded-md overflow-hidden border shadow-md delivery-pulse">
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
            <Marker 
              position={origin}
              icon={originIcon}
              title="Хүргэлтийн эх газар"
            />
            <Marker 
              position={destination}
              icon={destinationIcon}
              title="Хүргэлтийн хаяг"
            />
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
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500 bounce-in">
          <div className="flex items-center bg-white shadow-sm rounded-full px-2 py-1 transition-all hover:bg-gray-50">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1 pulse"></div>
            <span>Эх газар</span>
            <span className="ml-1 jelly">🍽️</span>
          </div>
          <div className="flex items-center bg-white shadow-sm rounded-full px-2 py-1 transition-all hover:bg-gray-50">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1 pulse"></div>
            <span>Жолооч</span>
            <span className="ml-1 wobble">🚚</span>
          </div>
          <div className="flex items-center bg-white shadow-sm rounded-full px-2 py-1 transition-all hover:bg-gray-50">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1 pulse"></div>
            <span>Хүргэх хаяг</span>
            <span className="ml-1 bounce-soft">📍</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 slide-in-left">
          <div className="bg-blue-50 rounded-lg p-3 text-sm shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-medium text-blue-800 mb-1 flex items-center">
              <span className="tada">🧾</span>
              <span className="ml-2">Захиалгын дугаар</span>
            </h4>
            <p className="text-blue-600">#{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-sm shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-medium text-green-800 mb-1 flex items-center">
              <span className="wiggle">🚦</span>
              <span className="ml-2">Төлөв</span>
            </h4>
            <p className="text-green-600">Хүргэлтэнд гарсан</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-sm shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-medium text-purple-800 mb-1 flex items-center">
              <span className="jelly">💰</span>
              <span className="ml-2">Төлбөр</span>
            </h4>
            <p className="text-purple-600">Төлсөн</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-sm shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-medium text-amber-800 mb-1 flex items-center">
              <span className="spin-slow">🍔</span>
              <span className="ml-2">Бүтээгдэхүүн</span>
            </h4>
            <p className="text-amber-600">3 төрөл</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
