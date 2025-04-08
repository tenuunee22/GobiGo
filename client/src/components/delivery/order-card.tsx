import React from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  Building, 
  PhoneCall, 
  CheckCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderCardProps {
  id: string;
  restaurant: {
    name: string;
    distance: string;
    imageUrl?: string;
  };
  deliveryDistance: string;
  estimatedEarnings: number;
  isAvailable?: boolean;
  status?: string;
  needsPreparation?: boolean; // Is this a restaurant order (true) or grocery/pharmacy (false)
  businessType?: string; // restaurant, grocery, pharmacy
  customer?: {
    name: string;
    address: string;
  };
  onStatusChange: () => void;
}

export function OrderCard({
  id,
  restaurant,
  deliveryDistance,
  estimatedEarnings,
  isAvailable = false,
  status,
  needsPreparation = true,
  businessType = "restaurant",
  customer,
  onStatusChange
}: OrderCardProps) {
  
  const getStatusBadge = () => {
    if (isAvailable) {
      // Show if this order is for pickup (restaurant) or shopping (grocery/pharmacy)
      if (needsPreparation) {
        return <Badge variant="secondary">Хоол авах</Badge>;
      } else {
        return <Badge variant="secondary">Худалдан авах</Badge>;
      }
    }
    
    let variant: "default" | "secondary" | "outline" = "default";
    let label = "";
    
    switch (status) {
      case "ready":
      case "ready_for_pickup":
        variant = "secondary";
        label = "Бэлэн болсон";
        break;
      case "shopping":
        variant = "secondary";
        label = "Худалдан авалт";
        break;
      case "items_collected":
        variant = "secondary";
        label = "Цуглуулсан";
        break;
      case "on-the-way":
        variant = "default";
        label = "Хүргэлтэнд гарсан";
        break;
      case "delivered":
        variant = "outline";
        label = "Хүргэгдсэн";
        break;
      case "completed":
        variant = "outline";
        label = "Дууссан";
        break;
      default:
        variant = "outline";
        label = status || "Бэлэн";
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  const getActionButton = () => {
    if (isAvailable) {
      // Different button text based on business type
      return (
        <Button onClick={onStatusChange} className="w-full">
          {needsPreparation ? 'Хоол авах' : 'Худалдан авах'}
        </Button>
      );
    }
    
    // Different flow based on whether this is restaurant or grocery/pharmacy
    if (needsPreparation) {
      // Restaurant flow
      switch (status) {
        case "ready":
        case "ready_for_pickup":
          return (
            <Button onClick={onStatusChange} className="w-full">
              <Navigation className="mr-2 h-4 w-4" />
              Хоол авах
            </Button>
          );
        case "on-the-way":
          return (
            <Button onClick={onStatusChange} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Хүргэлт хийсэн
            </Button>
          );
        case "delivered":
          return (
            <Button onClick={onStatusChange} className="w-full">
              Дуусгах
            </Button>
          );
        case "completed":
          return (
            <Button disabled className="w-full">
              Дууссан
            </Button>
          );
        default:
          return (
            <Button onClick={onStatusChange} className="w-full">
              Үргэлжлүүлэх
            </Button>
          );
      }
    } else {
      // Grocery/Pharmacy flow
      switch (status) {
        case "new":
        case "accepted":
        case "shopping":
          return (
            <Button onClick={onStatusChange} className="w-full">
              Бараа цуглуулсан
            </Button>
          );
        case "items_collected":
          return (
            <Button onClick={onStatusChange} className="w-full">
              <Navigation className="mr-2 h-4 w-4" />
              Хүргэлтэнд гарах
            </Button>
          );
        case "on-the-way":
          return (
            <Button onClick={onStatusChange} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Хүргэлт хийсэн
            </Button>
          );
        case "delivered":
          return (
            <Button onClick={onStatusChange} className="w-full">
              Дуусгах
            </Button>
          );
        case "completed":
          return (
            <Button disabled className="w-full">
              Дууссан
            </Button>
          );
        default:
          return (
            <Button onClick={onStatusChange} className="w-full">
              Үргэлжлүүлэх
            </Button>
          );
      }
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              {/* Restaurant Image */}
              <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {restaurant.imageUrl ? (
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Зураггүй
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{restaurant.name}</span>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="mr-1 h-4 w-4" />
                  <span>{restaurant.distance} зайтай</span>
                </div>
                {/* Show business type */}
                <div className="text-xs text-gray-500 mt-1">
                  {businessType === "grocery" ? "Дэлгүүр" : 
                    businessType === "pharmacy" ? "Эмийн сан" : "Хоолны газар"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">Захиалга #{id.substring(0, 6)}</div>
              <div className="font-semibold">{estimatedEarnings.toLocaleString()}₮</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-md p-2">
              <div className="text-xs text-gray-500">Зай</div>
              <div className="font-medium">{deliveryDistance}</div>
            </div>
            <div className="bg-gray-50 rounded-md p-2">
              <div className="text-xs text-gray-500">Дундаж хугацаа</div>
              <div className="font-medium">15-20 мин</div>
            </div>
          </div>
          
          {!isAvailable && customer && (
            <>
              <Separator className="my-3" />
              
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Хүргэлтийн хаяг</div>
                    <div className="text-sm text-gray-600">{customer.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">{customer.name} - 9911****</div>
                </div>
              </div>
            </>
          )}
          
          {/* Action button */}
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
}