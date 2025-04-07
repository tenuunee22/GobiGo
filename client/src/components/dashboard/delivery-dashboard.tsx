import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getAvailableOrders, getDriverOrders } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { OrderCard } from "@/components/delivery/order-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Navigation, Phone } from "lucide-react";

export function DeliveryDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [earnings, setEarnings] = useState({
    today: 58.25,
    deliveries: 5,
    progress: 65
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.uid) return;
      
      try {
        setLoading(true);
        
        // Fetch available orders
        const fetchedAvailableOrders = await getAvailableOrders();
        setAvailableOrders(fetchedAvailableOrders);
        
        // Fetch driver's current orders
        const driverOrders = await getDriverOrders(user.uid);
        const activeOrder = driverOrders.find(order => 
          order.status === "picked_up" || order.status === "on-the-way"
        );
        
        if (activeOrder) {
          setCurrentOrder(activeOrder);
        } else {
          setCurrentOrder(null);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Failed to load orders",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, [user, toast]);

  const handleOrderStatusChange = () => {
    // Refetch orders when status changes
    if (user && user.uid) {
      setLoading(true);
      
      Promise.all([
        getAvailableOrders(),
        getDriverOrders(user.uid)
      ])
        .then(([available, driverOrders]) => {
          setAvailableOrders(available);
          
          const activeOrder = driverOrders.find(order => 
            order.status === "picked_up" || order.status === "on-the-way"
          );
          
          if (activeOrder) {
            setCurrentOrder(activeOrder);
          } else {
            setCurrentOrder(null);
          }
          
          setLoading(false);
        })
        .catch(error => {
          console.error("Error refreshing orders:", error);
          setLoading(false);
        });
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast({
      title: !isOnline ? "You are now online" : "You are now offline",
      description: !isOnline 
        ? "You can now receive delivery requests" 
        : "You will not receive new delivery requests",
    });
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Delivery overview section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || "Driver"}</p>
        </div>
        
        {/* Status toggle switch */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Your Status</h2>
              <p className="text-sm text-gray-500 mt-1">Toggle your availability for deliveries</p>
            </div>
            <div className="flex items-center">
              <span className={`mr-3 text-sm font-medium ${isOnline ? "text-green-600" : "text-gray-500"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch 
                checked={isOnline} 
                onCheckedChange={toggleOnlineStatus}
                className={isOnline ? "bg-green-500" : ""}
              />
            </div>
          </div>
        </div>
        
        {/* Today's earnings */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Earnings</h2>
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-3xl font-bold text-gray-900">${earnings.today.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">From {earnings.deliveries} deliveries</p>
            </div>
            <div className="w-1/2">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary rounded-full h-4 transition-all duration-500 ease-in-out" 
                  style={{ width: `${earnings.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{earnings.progress}% of daily goal</p>
            </div>
          </div>
        </div>
        
        {/* Available orders and current delivery */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Available orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Available Orders</h2>
            
            <div className="flow-root">
              {loading ? (
                <div className="animate-pulse space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 h-20 rounded-md"></div>
                  ))}
                </div>
              ) : availableOrders.length > 0 ? (
                <ul className="-my-5 divide-y divide-gray-200">
                  {availableOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      id={order.id}
                      restaurant={{
                        name: order.businessName || "Restaurant",
                        distance: order.pickupDistance || "3.2 mi",
                        imageUrl: order.businessImageUrl
                      }}
                      deliveryDistance={order.deliveryDistance || "1.5 mi"}
                      estimatedEarnings={order.driverEarnings || 7.50}
                      isAvailable={true}
                      onStatusChange={handleOrderStatusChange}
                    />
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No available orders at the moment.</p>
                  <p className="text-gray-500 text-sm mt-1">Check back later or adjust your location.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Current delivery */}
          {currentOrder ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Delivery</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Order #{currentOrder.orderNumber || currentOrder.id.slice(-6)} • {currentOrder.items?.length || 2} items</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                    On the way
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-10 w-10">
                    {currentOrder.businessImageUrl ? (
                      <img className="h-10 w-10 rounded-full" src={currentOrder.businessImageUrl} alt="Restaurant" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        R
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{currentOrder.businessName || "Restaurant"}</p>
                    <p className="text-xs text-gray-500">Pickup: {currentOrder.pickupAddress || "123 Restaurant St"}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {currentOrder.customerImageUrl ? (
                        <img className="h-10 w-10 rounded-full" src={currentOrder.customerImageUrl} alt="Customer" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{currentOrder.customerName || "Customer"}</p>
                    <p className="text-xs text-gray-500">Delivery: {currentOrder.deliveryAddress || "456 Customer Ave, Apt 2B"}</p>
                  </div>
                </div>
              </div>
              
              {/* Map placeholder */}
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Google Maps would be integrated here with the delivery route
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleOrderStatusChange();
                  }}
                >
                  Complete Delivery
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <div className="p-6 rounded-full bg-gray-100 mb-4">
                <Navigation className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Delivery</h3>
              <p className="text-gray-500 max-w-xs">
                When you accept a delivery order, you will see the details and navigation here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
