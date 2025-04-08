import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getAvailableOrders, getDriverOrders, updateOrderStatus } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/delivery/order-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map, ChevronDown } from "lucide-react";
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
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    distance: 0,
    completed: 0
  });

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
      let toastMessage: string;
      let additionalData: any = {
        driverId: user?.uid,
        driverName: user?.displayName || "Хүргэгч"
      };
      
      const businessType = order.businessType || "restaurant";
      const isRetailOrPharmacy = ["retail", "pharmacy", "shop", "store", "дэлгүүр", "эмийн сан"].some(
        type => businessType.toLowerCase().includes(type)
      );
      
      // Determine next status based on current status and business type
      switch (order.status) {
        case "ready":
          newStatus = "on-the-way";
          toastMessage = "Хүргэлтэнд гарсан";
          additionalData.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30min from now
          break;
        case "ready_for_pickup":
          newStatus = "on-the-way";
          toastMessage = "Захиалга авч, хүргэлтэнд гарсан";
          additionalData.pickedUpTime = new Date();
          additionalData.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30min from now
          break;
        case "preparing":
          // Only happens when driver is preparing retail/pharmacy orders
          newStatus = "ready_for_delivery";
          toastMessage = "Бараа бүтээгдэхүүн бэлэн болсон";
          break;
        case "ready_for_delivery":
          newStatus = "on-the-way";
          toastMessage = "Хүргэлтэнд гарсан";
          additionalData.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30min from now
          break;
        case "on-the-way":
          newStatus = "delivered";
          toastMessage = "Хүргэгдсэн";
          additionalData.deliveredTime = new Date();
          break;
        case "delivered":
          newStatus = "completed";
          toastMessage = "Гүйцэтгэсэн";
          additionalData.completedTime = new Date();
          break;
        default:
          // Fall back to standard flow
          newStatus = isRetailOrPharmacy ? "preparing" : "on-the-way";
          toastMessage = isRetailOrPharmacy ? "Бэлтгэж байна" : "Хүргэлтэнд гарсан";
      }
      
      // Update order status
      const updatedOrder = await updateOrderStatus(orderId, newStatus, additionalData);
      
      // Update local state
      const updateOrderInList = (list: any[]) => 
        list.map(o => o.id === orderId ? { ...o, status: newStatus, ...additionalData } : o);
      
      setAllOrders(prev => updateOrderInList(prev));
      setMyOrders(prev => updateOrderInList(prev));
      
      toast({
        title: "Захиалгын төлөв шинэчлэгдлээ",
        description: `Захиалга ${toastMessage} төлөвт оруулав`,
      });
      
      // Provide follow-up toast for retail/pharmacy order flow
      if (isRetailOrPharmacy && newStatus === "ready_for_delivery") {
        toast({
          title: "Бэлтгэл дууссан",
          description: "Та одоо захиалгыг хүргэх боломжтой",
        });
      } else if (newStatus === "delivered") {
        toast({
          title: "Хүргэлт амжилттай",
          description: "Захиалга хүргэгдсэн, төлбөр бүрэн хийгдсэн эсэхийг шалгана уу",
        });
      }
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
      // Find the order
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;
      
      // Check if we need to prepare this order (for retail/pharmacy)
      // or just pick it up (for restaurant)
      const businessType = order.businessType || "restaurant";
      let newStatus = "on-the-way";
      let toastMessage = "Та энэ захиалгыг хүргэх болно";
      
      // For retail/pharmacy, driver needs to prepare the order first
      if (businessType.toLowerCase() !== "restaurant") {
        newStatus = "preparing";
        toastMessage = "Та энэ захиалгын бараа бүтээгдэхүүнийг бэлтгэж, хүргэх болно";
      }
      
      // Update order status and assign driver
      await updateOrderStatus(orderId, newStatus, {
        driverId: user?.uid, 
        driverName: user?.displayName || "Хүргэгч"
      });
      
      // Move order from available to my orders
      if (order) {
        const updatedOrder = { ...order, status: newStatus, driverId: user?.uid };
        setMyOrders(prev => [...prev, updatedOrder]);
        setAllOrders(prev => prev.filter(o => o.id !== orderId));
      }
      
      toast({
        title: "Захиалга хүлээн авлаа",
        description: toastMessage,
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
      <h1 className="text-2xl font-bold mb-6">Хүргэлтийн жолооч</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Өнөөдрийн орлого
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.today.toLocaleString()}₮</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              7 хоногийн орлого
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.week.toLocaleString()}₮</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт хүргэлт
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт зам (км)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.distance.toFixed(1)} км</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Хайлт (ресторан, хаяг)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Төлөв: {filterStatus ? getStatusText(filterStatus) : "Бүгд"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                Бүгд
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ready")}>
                Бэлэн болсон
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("on-the-way")}>
                Хүргэлтэнд гарсан
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>
                Хүргэгдсэн
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Дууссан
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Газрын зураг
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="my-orders">
        <TabsList className="mb-4">
          <TabsTrigger value="my-orders">Миний хүргэлтүүд</TabsTrigger>
          <TabsTrigger value="available-orders">Боломжтой хүргэлтүүд</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-orders" className="space-y-4">
          {loading ? (
            <div>Хүргэлтүүд ачааллаж байна...</div>
          ) : sortedMyOrders.length > 0 ? (
            sortedMyOrders.map((order) => (
              <OrderCard
                key={order.id}
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
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">Танд одоогоор хүргэлт байхгүй байна</p>
              <p className="text-sm text-gray-400">
                "Боломжтой хүргэлтүүд" хэсгээс захиалга хүлээн авна уу
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="available-orders" className="space-y-4">
          {loading ? (
            <div>Боломжтой хүргэлтүүд ачааллаж байна...</div>
          ) : sortedAllOrders.length > 0 ? (
            sortedAllOrders.map((order) => (
              <OrderCard
                key={order.id}
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
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Одоогоор боломжтой хүргэлт байхгүй байна</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}