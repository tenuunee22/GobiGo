import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  isAvailable = true,
  status,
  customer,
  onStatusChange,
}: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await updateOrderStatus(id, "picked_up", { driverId: "current-driver-id" });
      toast({
        title: "Order accepted",
        description: "You have accepted this delivery order",
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: "Failed to accept order",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await updateOrderStatus(id, "delivered");
      toast({
        title: "Delivery completed",
        description: "The delivery has been marked as completed",
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: "Failed to complete delivery",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="py-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {restaurant.name} → {restaurant.distance} away
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {deliveryDistance} delivery distance
          </p>
          <div className="mt-2 flex">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              ${estimatedEarnings.toFixed(2)} Estimated earnings
            </span>
          </div>
          
          {!isAvailable && customer && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900">
                {customer.name}
              </p>
              <p className="text-xs text-gray-500">
                Delivery: {customer.address}
              </p>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          {isAvailable ? (
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              size="sm"
            >
              Accept
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              Complete Delivery
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
