import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface OrderItemProps {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  address: string;
  requestedTime: string;
  onStatusChange: () => void;
}

export function OrderItem({
  id,
  orderNumber,
  customerName,
  items,
  total,
  status,
  address,
  requestedTime,
  onStatusChange,
}: OrderItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, "accepted");
      toast({
        title: "Order accepted",
        description: `Order #${orderNumber} has been accepted`,
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: "Failed to accept order",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecline = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, "declined");
      toast({
        title: "Order declined",
        description: `Order #${orderNumber} has been declined`,
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: "Failed to decline order",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReadyForPickup = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, "ready");
      toast({
        title: "Order ready for pickup",
        description: `Order #${orderNumber} is ready for pickup`,
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: "Failed to update order",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className="py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary bg-opacity-10">
              <span className="text-primary font-semibold text-lg">#{orderNumber.slice(-2)}</span>
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Order #{orderNumber}</h3>
            <p className="text-sm text-gray-500">{customerName} • {items.length} items • ${total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "new" && (
            <>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                New Order
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAccept}
                  disabled={isUpdating}
                >
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDecline}
                  disabled={isUpdating}
                >
                  Decline
                </Button>
              </div>
            </>
          )}
          
          {status === "accepted" && (
            <>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Preparing
              </span>
              <Button 
                size="sm" 
                onClick={handleReadyForPickup}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                Ready for Pickup
              </Button>
            </>
          )}
          
          {status === "ready" && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Ready for Pickup
            </span>
          )}
          
          {status === "picked_up" && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Out for Delivery
            </span>
          )}
          
          {status === "delivered" && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Delivered
            </span>
          )}
          
          {status === "declined" && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Declined
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
          <div className="text-sm">
            <span className="font-medium text-gray-900">Delivery Address:</span>
            <p className="text-gray-500">{address}</p>
          </div>
          <div className="text-sm text-right">
            <span className="font-medium text-gray-900">Requested Time:</span>
            <p className="text-gray-500">{requestedTime}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
