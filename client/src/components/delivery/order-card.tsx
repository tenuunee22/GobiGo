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
    // Get emoji for button
    const getButtonEmoji = () => {
      if (isAvailable) {
        return needsPreparation ? "🍽️" : "🛒";
      }
      
      switch (status) {
        case "ready":
        case "ready_for_pickup": return "🍽️";
        case "shopping": return "🛒";
        case "items_collected": return "📦";
        case "on-the-way": return "🚚";
        case "delivered": return "✅";
        case "completed": return "🎉";
        default: return "➡️";
      }
    };
    
    // Get gradient for button
    const getButtonGradient = () => {
      if (isAvailable) {
        return "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600";
      }
      
      switch (status) {
        case "ready":
        case "ready_for_pickup":
          return "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600";
        case "on-the-way":
          return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
        case "delivered":
          return "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600";
        case "completed":
          return "bg-gradient-to-r from-gray-400 to-slate-400";
        default:
          return "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600";
      }
    };
    
    if (isAvailable) {
      // Different button text based on business type
      return (
        <Button 
          onClick={onStatusChange} 
          className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
        >
          <span className="flex items-center">
            <span className="mr-2 jelly">{getButtonEmoji()}</span>
            <span>
              {needsPreparation ? 'Хоол авах' : 'Худалдан авах'}
            </span>
            <span className="ml-2 text-xs bounce-soft">👈</span>
          </span>
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
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <Navigation className="mr-2 h-4 w-4 bounce-soft" />
                <span>Хоол авах</span>
                <span className="ml-2 text-xs tada">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "on-the-way":
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 pulse" />
                <span>Хүргэлт хийсэн</span>
                <span className="ml-2 text-xs jelly">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "delivered":
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 wiggle text-xs">✨</span>
                <span>Дуусгах</span>
                <span className="ml-2 text-xs tada">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "completed":
          return (
            <Button 
              disabled 
              className={`w-full shadow-md transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 text-xs bounce-soft">{getButtonEmoji()}</span>
                <span>Дууссан</span>
              </span>
            </Button>
          );
        default:
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 pulse text-xs">➡️</span>
                <span>Үргэлжлүүлэх</span>
              </span>
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
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 jelly text-xs">📦</span>
                <span>Бараа цуглуулсан</span>
              </span>
            </Button>
          );
        case "items_collected":
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <Navigation className="mr-2 h-4 w-4 wiggle" />
                <span>Хүргэлтэнд гарах</span>
                <span className="ml-2 text-xs bounce-soft">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "on-the-way":
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 pulse" />
                <span>Хүргэлт хийсэн</span>
                <span className="ml-2 text-xs tada">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "delivered":
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 text-xs wiggle">✨</span>
                <span>Дуусгах</span>
                <span className="ml-2 text-xs jelly">{getButtonEmoji()}</span>
              </span>
            </Button>
          );
        case "completed":
          return (
            <Button 
              disabled 
              className={`w-full shadow-md transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 text-xs bounce-soft">{getButtonEmoji()}</span>
                <span>Дууссан</span>
              </span>
            </Button>
          );
        default:
          return (
            <Button 
              onClick={onStatusChange} 
              className={`w-full shadow-md hover:shadow-lg transition-all ${getButtonGradient()}`}
            >
              <span className="flex items-center">
                <span className="mr-2 pulse text-xs">➡️</span>
                <span>Үргэлжлүүлэх</span>
              </span>
            </Button>
          );
      }
    }
  };
  
  // Get business type emoji
  const getBusinessEmoji = () => {
    switch(businessType) {
      case "grocery": return "🛒";
      case "pharmacy": return "💊";
      default: return "🍔";
    }
  };
  
  // Get status emoji
  const getStatusEmoji = () => {
    if (isAvailable) return "🆕";
    
    switch(status) {
      case "ready":
      case "ready_for_pickup": return "✅";
      case "shopping": return "🛍️";
      case "items_collected": return "📦";
      case "on-the-way": return "🚚";
      case "delivered": return "🏠";
      case "completed": return "🎉";
      default: return "📋";
    }
  };
  
  // Get the background gradient based on status
  const getCardBackground = () => {
    if (isAvailable) return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-amber-100";
    
    switch(status) {
      case "ready":
      case "ready_for_pickup": 
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-green-100";
      case "on-the-way": 
        return "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-blue-100";
      case "delivered":
      case "completed": 
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:shadow-gray-100";
      default: 
        return "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-indigo-100";
    }
  };

  return (
    <Card className={`overflow-hidden border hover:shadow-lg transition-all duration-300 ${getCardBackground()}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              {/* Restaurant Image with animation */}
              <div className="w-14 h-14 bg-white rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-gray-100 jelly">
                {restaurant.imageUrl ? (
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bounce-soft">
                    {getBusinessEmoji()}
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">{restaurant.name}</span>
                  {/* Status badge with emoji */}
                  <div className="relative">
                    {getStatusBadge()}
                    <span className="absolute -top-1 -right-1 text-xs tada">{getStatusEmoji()}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="mr-1 h-4 w-4 text-indigo-400 wiggle" />
                  <span>{restaurant.distance} зайтай</span>
                </div>
                {/* Show business type */}
                <div className="text-xs text-indigo-500 mt-1 flex items-center">
                  <span className="mr-1">{getBusinessEmoji()}</span>
                  <span>
                    {businessType === "grocery" ? "Дэлгүүр" : 
                      businessType === "pharmacy" ? "Эмийн сан" : "Хоолны газар"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 inline-block">#{id.substring(0, 6)}</div>
              <div className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent flex items-center justify-end mt-1">
                <span className="text-sm text-green-500 mr-1 wiggle">💰</span>
                <span>{estimatedEarnings.toLocaleString()}₮</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white rounded-md p-3 shadow-sm border border-gray-100 slide-in-left">
              <div className="text-xs text-gray-500 flex items-center">
                <span className="text-indigo-400 mr-1 bounce-soft">🗺️</span>
                <span>Зам</span>
              </div>
              <div className="font-medium text-indigo-700">{deliveryDistance}</div>
            </div>
            <div className="bg-white rounded-md p-3 shadow-sm border border-gray-100 slide-in-right">
              <div className="text-xs text-gray-500 flex items-center">
                <span className="text-amber-400 mr-1 pulse">⏱️</span>
                <span>Хугацаа</span>
              </div>
              <div className="font-medium text-amber-600">15-20 мин</div>
            </div>
          </div>
          
          {!isAvailable && customer && (
            <>
              <Separator className="my-3" />
              
              <div className="space-y-3 mb-3 fade-in">
                <div className="flex items-start gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5 jelly" />
                  <div>
                    <div className="text-sm font-medium flex items-center">
                      <span>Хүргэлтийн хаяг</span>
                      <span className="ml-1 text-xs bounce-soft">📍</span>
                    </div>
                    <div className="text-sm text-gray-600">{customer.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                  <PhoneCall className="h-5 w-5 text-green-500 wiggle" />
                  <div>
                    <div className="text-sm font-medium flex items-center">
                      <span>{customer.name}</span>
                      <span className="ml-1 text-xs pulse">📞</span>
                    </div>
                    <div className="text-xs text-gray-500">9911****</div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Action button with animation */}
          <div className="mt-4 fade-in-delayed">
            {getActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}