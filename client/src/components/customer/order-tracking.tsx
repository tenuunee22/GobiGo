import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  ChefHat, 
  Package, 
  MapPin, 
  Phone,
  Navigation
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Driver {
  id: string;
  name: string;
  imageUrl?: string;
  arrivalTime: string;
}

interface OrderTrackingProps {
  orderId: string;
  status: "placed" | "preparing" | "on-the-way" | "delivered";
  driver?: Driver;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  destination?: {
    lat: number;
    lng: number;
  };
}

export function OrderTracking({
  orderId,
  status,
  driver,
  items,
  subtotal,
  deliveryFee,
  total,
  currentLocation,
  destination
}: OrderTrackingProps) {
  const [expanded, setExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "on-the-way" && timeRemaining > 0) {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }
      
      if (status !== "delivered") {
        setElapsedTime(prev => prev + 1);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [status, timeRemaining]);
  
  const getStatusIcon = (
    currentStatus: string,
    checkStatus: string,
    icon: React.ReactNode,
    text: string
  ) => {
    const statusIndex = {
      placed: 0,
      preparing: 1,
      "on-the-way": 2,
      delivered: 3
    };
    
    const currentIdx = statusIndex[currentStatus as keyof typeof statusIndex];
    const checkIdx = statusIndex[checkStatus as keyof typeof statusIndex];
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
            ${currentIdx >= checkIdx 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-400'}`}
        >
          {icon}
        </div>
        <span className={`text-xs font-medium ${currentIdx >= checkIdx ? 'text-green-600' : 'text-gray-400'}`}>
          {text}
        </span>
      </div>
    );
  };
  
  const getDeliveryProgress = () => {
    switch (status) {
      case "placed":
        return 0;
      case "preparing":
        return 33;
      case "on-the-way":
        return 66;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };
  
  const progressValue = getDeliveryProgress();
  
  return (
    <div className="mb-4">
      <Card className="border border-amber-200 overflow-hidden">
        <CardHeader className="bg-amber-50 p-4 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <CardTitle className="text-base font-medium flex items-center text-amber-800">
              <Package className="h-5 w-5 mr-2 text-amber-600" />
              Захиалга #{orderId}
            </CardTitle>
            <Badge className={`${status === "delivered" ? "bg-green-600" : "bg-amber-500"}`}>
              {status === "placed" && "Захиалга хүлээн авсан"}
              {status === "preparing" && "Бэлтгэж байна"}
              {status === "on-the-way" && "Хүргэлтэнд гарсан"}
              {status === "delivered" && "Хүргэгдсэн"}
            </Badge>
          </div>
          <div className="mt-2 relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex justify-between w-full">
                {getStatusIcon("placed", "placed", <CheckCircle className="h-5 w-5" />, "Хүлээн авсан")}
                {getStatusIcon(status, "preparing", <ChefHat className="h-5 w-5" />, "Бэлтгэж байна")}
                {getStatusIcon(status, "on-the-way", <Truck className="h-5 w-5" />, "Хүргэлтэнд гарсан")}
                {getStatusIcon(status, "delivered", <CheckCircle className="h-5 w-5" />, "Хүргэгдсэн")}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          {status === "on-the-way" && driver && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300">
                      {driver.imageUrl ? (
                        <img 
                          src={driver.imageUrl} 
                          alt={driver.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                          <Truck className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {driver.arrivalTime}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                  <Phone className="h-4 w-4 mr-2" />
                  Залгах
                </Button>
              </div>
            </motion.div>
          )}
          
          <div 
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Захиалгын дэлгэрэнгүй</span>
              <svg
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1">
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div>{(item.price * item.quantity).toLocaleString()}₮</div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Дүн:</span>
                      <span>{subtotal.toLocaleString()}₮</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Хүргэлтийн төлбөр:</span>
                      <span>{deliveryFee.toLocaleString()}₮</span>
                    </div>
                    <div className="flex justify-between font-bold mt-1">
                      <span>Нийт дүн:</span>
                      <span>{total.toLocaleString()}₮</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {(currentLocation && destination) && (
            <div className="mt-3 rounded-lg overflow-hidden h-48 bg-blue-50 flex items-center justify-center">
              <div className="text-blue-500 flex flex-col items-center">
                <Navigation className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Хүргэлтийн явцыг харах</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}