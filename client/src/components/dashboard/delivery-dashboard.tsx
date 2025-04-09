import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getAvailableOrders, getDriverOrders } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { OrderCard } from "@/components/delivery/order-card";
import { WelcomeBanner } from "@/components/shared/welcome-banner";
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
        {/* Welcome Banner */}
        {user && <WelcomeBanner className="mb-6" />}
      
        {/* Delivery overview section */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
            <span className="mr-3 text-indigo-500 tada text-2xl">🚚</span>
            Delivery Dashboard 
          </h1>
          <p className="text-gray-600 mt-2">Хүргэлтийн мэдээлэл, <span className="font-semibold text-indigo-600">{user?.name || "Driver"}</span></p>
        </div>
        
        {/* Status toggle switch */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 slide-in-left dashboard-card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                <span className={`mr-2 text-sm ${isOnline ? "bounce-soft" : "pulse"}`}>
                  {isOnline ? "🟢" : "🔴"}
                </span>
                Your Status
              </h2>
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
        <div className="bg-white shadow rounded-lg p-6 mb-8 slide-in-right dashboard-card-hover">
          <h2 className="text-lg font-medium bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent flex items-center mb-4">
            <span className="mr-2 wiggle">💰</span>
            Today's Earnings
          </h2>
          <div className="flex items-center">
            <div className="flex-1 bounce-in">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                ${earnings.today.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                From {earnings.deliveries} deliveries <span className="ml-1 bounce-soft">🚚</span>
              </p>
            </div>
            <div className="w-1/2 fade-in">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full h-4 transition-all duration-500 ease-in-out progress-loading" 
                  style={{ width: `${earnings.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <span className="pulse mr-1">🎯</span> {earnings.progress}% of daily goal
              </p>
            </div>
          </div>
        </div>
        
        {/* Available orders and current delivery */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Available orders */}
          <div className="bg-white shadow rounded-lg p-6 slide-in-left dashboard-card-hover">
            <h2 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center mb-4">
              <span className="mr-2 jelly">📋</span>
              Available Orders
            </h2>
            
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
            <div className="bg-white shadow rounded-lg p-6 slide-in-right dashboard-card-hover">
              <h2 className="text-lg font-medium bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent flex items-center mb-4">
                <span className="mr-2 delivery-pulse">🚚</span>
                Current Delivery
              </h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Order #{currentOrder.orderNumber || currentOrder.id.slice(-6)} • {currentOrder.items?.length || 2} items</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800 pulse">
                    <span className="mr-1 text-xs">🚗</span> On the way
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
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    // Open Google Maps with the delivery coordinates
                    const customerLat = currentOrder.deliveryLat || 47.9234676;
                    const customerLng = currentOrder.deliveryLng || 106.9237016;
                    // Create Google Maps URL with the destination coordinates
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLng}`;
                    window.open(mapsUrl, '_blank');
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2 bounce-soft" />
                  <span className="flex items-center">
                    Navigate <span className="ml-1 text-xs pulse">🧭</span>
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-indigo-200 hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="h-4 w-4 mr-2 wiggle" />
                  <span className="flex items-center">
                    Contact <span className="ml-1 text-xs jelly">📱</span>
                  </span>
                </Button>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    handleOrderStatusChange();
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-xs tada">✅</span>
                    Complete Delivery
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center slide-in-right dashboard-card-hover">
              <div className="p-6 rounded-full bg-gradient-to-r from-gray-50 to-blue-50 mb-4 shadow-sm">
                <Navigation className="h-10 w-10 text-indigo-400 pulse" />
              </div>
              <h3 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center">
                <span className="mr-2 bounce-soft">🔍</span> No Active Delivery
              </h3>
              <p className="text-gray-500 max-w-xs">
                When you accept a delivery order, you will see the details and navigation here. <span className="text-xs jelly inline-block ml-1">👇</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
