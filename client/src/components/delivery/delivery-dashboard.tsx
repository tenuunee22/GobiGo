import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getAvailableOrders, getDriverOrders, updateOrderStatus, logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/delivery/order-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map, ChevronDown, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    distance: 0,
    completed: 0
  });
  
  // Handle logout and redirect to login page
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Системээс гарлаа",
        description: "Та амжилттай системээс гарлаа",
      });
      // Redirect to login page after logout
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        
        // Fetch available orders
        const availableOrders = await getAvailableOrders();
        setAllOrders(availableOrders);
        
        // Fetch orders assigned to this driver
        const driverOrders = await getDriverOrders(user.uid);
        setMyOrders(driverOrders);
        
        // Calculate earnings and stats
        let todayEarnings = 0;
        let weekEarnings = 0;
        let monthEarnings = 0;
        let totalDistance = 0;
        let completedOrders = 0;
        
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        
        driverOrders.forEach(order => {
          const orderDate = new Date(order.createdAt || new Date());
          const earnings = order.deliveryFee || 0;
          
          // Today's earnings
          if (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          ) {
            todayEarnings += earnings;
          }
          
          // This week's earnings
          if (orderDate >= weekAgo) {
            weekEarnings += earnings;
          }
          
          // This month's earnings
          if (orderDate >= monthAgo) {
            monthEarnings += earnings;
          }
          
          // Total distance (in km)
          totalDistance += parseFloat(order.distance || "0");
          
          // Count completed orders
          if (order.status === "delivered" || order.status === "completed") {
            completedOrders++;
          }
        });
        
        setEarnings({
          today: todayEarnings,
          week: weekEarnings,
          month: monthEarnings,
          distance: totalDistance,
          completed: completedOrders
        });
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        toast({
          title: "Өгөгдөл ачааллахад алдаа гарлаа",
          description: "Дахин оролдоно уу",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleStatusChange = async (orderId: string) => {
    try {
      // Find the order to update
      const order = [...myOrders, ...allOrders].find(o => o.id === orderId);
      if (!order) return;
      
      let newStatus: string;
      
      // Determine next status based on current status
      switch (order.status) {
        case "ready":
          newStatus = "on-the-way";
          break;
        case "on-the-way":
          newStatus = "delivered";
          break;
        case "delivered":
          newStatus = "completed";
          break;
        default:
          newStatus = "on-the-way";
      }
      
      // Update order status
      await updateOrderStatus(orderId, newStatus, user?.uid);
      
      // Update local state
      const updateOrderInList = (list: any[]) => 
        list.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      
      setAllOrders(prev => updateOrderInList(prev));
      setMyOrders(prev => updateOrderInList(prev));
      
      toast({
        title: "Захиалгын төлөв шинэчлэгдлээ",
        description: `Захиалга ${getStatusText(newStatus)} төлөвт оруулав`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Төлөв шинэчлэхэд алдаа гарлаа",
        description: "Дахин оролдоно уу",
        variant: "destructive"
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "placed": return "Хүлээн авсан";
      case "preparing": return "Бэлтгэж байна";
      case "ready": return "Бэлэн болсон";
      case "on-the-way": return "Хүргэлтэнд гарсан";
      case "delivered": return "Хүргэгдсэн";
      case "completed": return "Гүйцэтгэсэн";
      case "cancelled": return "Цуцлагдсан";
      default: return status;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Update order status and assign driver
      await updateOrderStatus(orderId, "on-the-way", user?.uid);
      
      // Move order from available to my orders
      const order = allOrders.find(o => o.id === orderId);
      if (order) {
        const updatedOrder = { ...order, status: "on-the-way", driverId: user?.uid };
        setMyOrders(prev => [...prev, updatedOrder]);
        setAllOrders(prev => prev.filter(o => o.id !== orderId));
      }
      
      toast({
        title: "Захиалга хүлээн авлаа",
        description: "Та энэ захиалгыг хүргэх болно",
      });
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Захиалга хүлээн авахад алдаа гарлаа",
        description: "Дахин оролдоно уу",
        variant: "destructive"
      });
    }
  };
  
  // Filter orders by search query and status
  const filterOrders = (orderList: any[]) => {
    return orderList.filter(order => {
      // Filter by search query
      const matchesQuery = !searchQuery || 
        (order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.address?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status
      const matchesStatus = !filterStatus || order.status === filterStatus;
      
      return matchesQuery && matchesStatus;
    });
  };
  
  const filteredAllOrders = filterOrders(allOrders);
  const filteredMyOrders = filterOrders(myOrders);
  
  // Sort orders by creation date (newest first)
  const sortOrders = (orders: any[]) => {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  };
  
  const sortedAllOrders = sortOrders(filteredAllOrders);
  const sortedMyOrders = sortOrders(filteredMyOrders);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold slide-in-left flex items-center">
          <span className="bg-gradient-to-r from-indigo-600 to-red-600 text-transparent bg-clip-text">Хүргэлтийн жолооч</span>
          <span className="ml-3 tada text-xl">🚚</span>
        </h1>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 transition-all slide-in-right"
          onClick={handleLogout}
        >
          <span className="text-xs jelly">👋</span>
          <span>Гарах</span>
          <LogOut className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bounce-in">
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-green-500 slide-in-bottom" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-green-500 wiggle">💰</span>
              Өнөөдрийн орлого
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text flex items-center">
              {earnings.today.toLocaleString()}₮
              <span className="ml-2 text-sm text-green-500 pulse">↑</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-blue-500 slide-in-bottom" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-blue-500 heartbeat">💸</span>
              7 хоногийн орлого
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              {earnings.week.toLocaleString()}₮
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-amber-500 slide-in-bottom" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-amber-500 tada">🚚</span>
              Нийт хүргэлт
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text">
              {earnings.completed}
              <span className="ml-2 text-sm text-gray-400">{earnings.completed > 0 ? "хүргэлт" : ""}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-indigo-500 slide-in-bottom" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-indigo-500 jelly">🛣️</span>
              Нийт зам (км)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              {earnings.distance.toFixed(1)} км
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 slide-in-right">
        <div className="relative">
          <Input
            type="text"
            placeholder="Хайлт (ресторан, хаяг)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 pl-10 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-300 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400 wiggle" />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
              <span className="bounce-soft">🔍</span> {searchQuery}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200 hover:bg-blue-100 transition-all hover:shadow">
                <span className="text-indigo-600 mr-1 jelly text-xs">🔍</span>
                Төлөв: {filterStatus ? getStatusText(filterStatus) : "Бүгд"}
                <ChevronDown className="ml-2 h-4 w-4 text-indigo-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus(null)} className="flex items-center">
                <span className="text-indigo-500 mr-2 text-xs">✨</span> Бүгд
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ready")} className="flex items-center">
                <span className="text-green-500 mr-2 text-xs">🍽️</span> Бэлэн болсон
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("on-the-way")} className="flex items-center">
                <span className="text-amber-500 mr-2 text-xs">🚚</span> Хүргэлтэнд гарсан
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delivered")} className="flex items-center">
                <span className="text-blue-500 mr-2 text-xs">📦</span> Хүргэгдсэн
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")} className="flex items-center">
                <span className="text-green-500 mr-2 text-xs">✅</span> Дууссан
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-md">
            <Map className="h-4 w-4 bounce-soft" />
            <span className="flex items-center">
              <span>Газрын зураг</span>
              <span className="ml-1 text-xs jelly">🗺️</span>
            </span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="my-orders" className="fade-in" style={{ animationDelay: "0.3s" }}>
        <TabsList className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="my-orders" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs bounce-soft">🚚</span>
              <span>Миний хүргэлтүүд</span>
              {sortedMyOrders.length > 0 && (
                <span className="bg-white text-indigo-600 text-xs px-1.5 rounded-full ml-1">
                  {sortedMyOrders.length}
                </span>
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="available-orders"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg transition-all"  
          >
            <span className="flex items-center gap-2">
              <span className="text-xs tada">📦</span>
              <span>Боломжтой хүргэлтүүд</span>
              {sortedAllOrders.length > 0 && (
                <span className="bg-white text-orange-600 text-xs px-1.5 rounded-full ml-1 pulse">
                  {sortedAllOrders.length}
                </span>
              )}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-orders" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-t-4 border-indigo-500 rounded-full animate-spin mb-2"></div>
                <p className="text-indigo-600">Хүргэлтүүд ачааллаж байна...</p>
              </div>
            </div>
          ) : sortedMyOrders.length > 0 ? (
            sortedMyOrders.map((order, index) => (
              <div className="slide-in-right" style={{ animationDelay: `${index * 0.1}s` }} key={order.id}>
                <OrderCard
                  id={order.id}
                  restaurant={{
                    name: order.businessName || "Ресторан",
                    distance: order.businessDistance || "1 км",
                    imageUrl: order.businessImageUrl
                  }}
                  deliveryDistance={order.distance || "3 км"}
                  estimatedEarnings={order.deliveryFee || 3000}
                  status={order.status}
                  customer={{
                    name: order.customerName || "Хэрэглэгч",
                    address: order.address || "Хаяг байхгүй"
                  }}
                  onStatusChange={() => handleStatusChange(order.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm fade-in">
              <div className="w-16 h-16 mx-auto mb-3 text-4xl bounce-soft">🚫</div>
              <p className="text-indigo-700 font-medium mb-4">Танд одоогоор хүргэлт байхгүй байна</p>
              <p className="text-sm text-indigo-500 mb-4">
                "Боломжтой хүргэлтүүд" хэсгээс захиалга хүлээн авна уу
              </p>
              <Button 
                variant="outline" 
                className="mt-2 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => {
                // Switch to available orders tab programmatically
                const tabs = document.querySelectorAll("button[role='tab']");
                // Find the second tab (Available Orders) and click it
                if (tabs.length > 1) {
                  (tabs[1] as HTMLElement).click();
                }
              }}
              >
                <span className="flex items-center">
                  <span className="mr-2 text-xs jelly">🔎</span>
                  <span>Боломжтой хүргэлтүүд харах</span>
                </span>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available-orders" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-t-4 border-amber-500 rounded-full animate-spin mb-2"></div>
                <p className="text-amber-600">Боломжтой хүргэлтүүд ачааллаж байна...</p>
              </div>
            </div>
          ) : sortedAllOrders.length > 0 ? (
            sortedAllOrders.map((order, index) => (
              <div className="slide-in-left" style={{ animationDelay: `${index * 0.1}s` }} key={order.id}>
                <OrderCard
                  id={order.id}
                  restaurant={{
                    name: order.businessName || "Ресторан",
                    distance: order.businessDistance || "1 км",
                    imageUrl: order.businessImageUrl
                  }}
                  deliveryDistance={order.distance || "3 км"}
                  estimatedEarnings={order.deliveryFee || 3000}
                  isAvailable={true}
                  onStatusChange={() => handleAcceptOrder(order.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-sm fade-in">
              <div className="w-16 h-16 mx-auto mb-3 text-4xl bounce-soft">🔍</div>
              <p className="text-amber-700 font-medium">Одоогоор боломжтой хүргэлт байхгүй байна</p>
              <p className="text-sm text-amber-600 mt-2">
                Шинэ захиалга гарахыг хүлээнэ үү
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}