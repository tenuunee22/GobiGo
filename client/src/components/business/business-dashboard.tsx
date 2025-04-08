import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { 
  getBusinessOrders, 
  getBusinessProducts, 
  updateOrderStatus, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  subscribeToBusinessProducts
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderItem } from "@/components/business/order-item";
import { ProductForm } from "@/components/business/product-form";
import { Button } from "@/components/ui/button";
import { Plus, Search, Settings, TrendingUp, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function BusinessDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    earnings: 0,
    ordersCount: 0,
    avgOrder: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        
        // Fetch orders for this business
        const fetchedOrders = await getBusinessOrders(user.uid);
        setOrders(fetchedOrders);
        
        // Subscribe to real-time updates for products
        unsubscribe = subscribeToBusinessProducts(user.uid, (updatedProducts) => {
          setProducts(updatedProducts);
          setLoading(false);
        });
        
        // Calculate statistics
        let totalEarnings = 0;
        const last7days = Array(7).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return { date, earnings: 0, orders: 0 };
        });
        
        fetchedOrders.forEach(order => {
          // Calculate total earnings
          totalEarnings += order.totalAmount || 0;
          
          // Calculate daily stats for last 7 days
          const orderDate = new Date(order.createdAt || new Date());
          for (let i = 0; i < 7; i++) {
            const statsDate = last7days[i].date;
            if (
              orderDate.getDate() === statsDate.getDate() &&
              orderDate.getMonth() === statsDate.getMonth() &&
              orderDate.getFullYear() === statsDate.getFullYear()
            ) {
              last7days[i].earnings += order.totalAmount || 0;
              last7days[i].orders += 1;
              break;
            }
          }
        });
        
        // Format the statistics for display
        setStats({
          earnings: totalEarnings,
          ordersCount: fetchedOrders.length,
          avgOrder: fetchedOrders.length ? totalEarnings / fetchedOrders.length : 0,
          recentSales: last7days.map(day => ({
            date: `${day.date.getMonth() + 1}/${day.date.getDate()}`,
            revenue: day.earnings,
            orders: day.orders
          }))
        });
      } catch (error) {
        console.error("Error fetching business data:", error);
        toast({
          title: "Өгөгдөл ачааллахад алдаа гарлаа",
          description: "Дахин оролдоно уу",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchData();
    
    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, toast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Find the order to update
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        console.error("Order not found:", orderId);
        return;
      }
      
      // Get the business type
      const businessType = user?.businessType || "restaurant";
      
      // Additional data to include in the update
      const additionalData = {
        businessId: user?.uid,
        businessName: user?.businessName || user?.name || "Бизнес"
      };
      
      // For restaurant orders, when ready status is set, make the order available for drivers
      if (businessType.toLowerCase() === "restaurant" && newStatus === "ready") {
        additionalData.availableForDrivers = true;
      }
      
      // Update order status
      await updateOrderStatus(orderId, newStatus, additionalData);
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "Захиалгын төлөв шинэчлэгдлээ",
        description: `Захиалга #${orderId.substring(0, 6)} ${getStatusText(newStatus)} төлөвт оруулав`,
      });
      
      // Show additional information based on business type
      if (businessType.toLowerCase() === "restaurant" && newStatus === "ready") {
        toast({
          title: "Хүргэлтийн жолооч хайж байна",
          description: "Таны захиалга хүргэлтийн жолоочид санал болголоо",
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

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleProductSave = async (productData: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
        // We don't need to update the local state anymore as we are using real-time subscriptions
        
        toast({
          title: "Бүтээгдэхүүн шинэчлэгдлээ",
          description: `${productData.name} амжилттай шинэчлэгдлээ`,
        });
      } else {
        // Add new product
        await addProduct(user?.uid || "", productData);
        // We don't need to update the local state anymore as we are using real-time subscriptions
        
        toast({
          title: "Бүтээгдэхүүн нэмэгдлээ",
          description: `${productData.name} амжилттай нэмэгдлээ`,
        });
      }
      
      setShowProductForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Бүтээгдэхүүн хадгалахад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      // We don't need to update the local state anymore as we are using real-time subscriptions
      
      toast({
        title: "Бүтээгдэхүүн устгагдлаа",
        description: "Бүтээгдэхүүн амжилттай устгагдлаа",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Бүтээгдэхүүн устгахад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive"
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id?.toString().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      order.address?.toLowerCase().includes(searchLower)
    );
  });

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  // Sort orders by creation date (newest first)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Бизнес удирдлага</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт борлуулалт
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.earnings.toLocaleString()}₮</div>
            <p className="text-xs text-muted-foreground">
              +20.1% өнгөрсөн сараас
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт захиалга
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount}</div>
            <p className="text-xs text-muted-foreground">
              +12 өнгөрсөн долоо хоногоос
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Дундаж захиалга
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgOrder.toLocaleString()}₮
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% өнгөрсөн сараас
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Сүүлийн 7 хоногийн борлуулалт
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.recentSales}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Борлуулалт" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  name="Захиалга" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Захиалга болон бүтээгдэхүүн</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Захиалгууд</TabsTrigger>
          <TabsTrigger value="products">Бүтээгдэхүүн</TabsTrigger>
          <TabsTrigger value="settings">Тохиргоо</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          {loading ? (
            <div>Захиалга ачааллаж байна...</div>
          ) : sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <OrderItem
                key={order.id}
                id={order.id}
                orderNumber={`#${order.id.substring(0, 6)}`}
                customerName={order.customerName || "Хэрэглэгч"}
                items={(order.items || []).map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price
                }))}
                total={order.totalAmount || 0}
                status={order.status || "placed"}
                address={order.deliveryAddress || ""}
                requestedTime={order.requestedTime || "Аль болох хурдан"}
                onStatusChange={() => {
                  // Determine next status based on current status and business type
                  const businessType = user?.businessType || "restaurant";
                  const isRetailOrPharmacy = ["retail", "pharmacy", "shop", "store", "дэлгүүр", "эмийн сан"].some(
                    type => businessType.toLowerCase().includes(type)
                  );
                  
                  let nextStatus = "preparing";
                  
                  if (order.status === "placed") {
                    nextStatus = "preparing";
                  } else if (order.status === "preparing") {
                    nextStatus = isRetailOrPharmacy ? "ready_for_pickup" : "ready";
                  } else if (order.status === "ready_for_pickup") {
                    // Can't change from this state - driver needs to pick up
                    nextStatus = "ready_for_pickup";
                    
                    toast({
                      title: "Хүргэгчийг хүлээж байна",
                      description: "Энэ захиалгыг хүргэгч авах шаардлагатай"
                    });
                    
                    return; // Don't proceed with status change
                  } else if (order.status === "ready") {
                    nextStatus = "on-the-way";
                  } else if (order.status === "on-the-way") {
                    nextStatus = "delivered";
                  } else if (order.status === "delivered") {
                    nextStatus = "completed";
                  }
                  
                  handleStatusChange(order.id, nextStatus);
                }}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Одоогоор захиалга байхгүй байна</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="products">
          <div className="mb-4">
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" /> Бүтээгдэхүүн нэмэх
            </Button>
          </div>
          
          {showProductForm && (
            <div className="mb-6">
              <ProductForm 
                product={selectedProduct} 
                onSave={handleProductSave} 
                onCancel={() => setShowProductForm(false)} 
              />
            </div>
          )}
          
          {loading ? (
            <div>Бүтээгдэхүүн ачааллаж байна...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div 
                    className="h-40 bg-center bg-cover" 
                    style={{ 
                      backgroundImage: product.imageUrl 
                        ? `url(${product.imageUrl})` 
                        : "url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60)" 
                    }}
                  ></div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{product.price.toLocaleString()}₮</span>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEditProduct(product)}>
                          <Settings className="mr-2 h-4 w-4" /> Засах
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Устгах
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Одоогоор бүтээгдэхүүн байхгүй байна</p>
              <Button onClick={handleAddProduct} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Бүтээгдэхүүн нэмэх
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Бизнес тохиргоо</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Энэ хэсэгт та өөрийн бизнесийн үндсэн тохиргоог хийх боломжтой.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Бизнесийн нэр</label>
                  <Input 
                    type="text" 
                    value={user?.businessName || ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Хаяг</label>
                  <Input 
                    type="text" 
                    value={user?.address || ""}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Нээх цаг</label>
                    <Input 
                      type="time" 
                      defaultValue="10:00" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Хаах цаг</label>
                    <Input 
                      type="time" 
                      defaultValue="22:00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Хүргэлтийн төлбөр (₮)</label>
                  <Input 
                    type="number" 
                    defaultValue="3000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Үндсэн ангилал</label>
                  <Select defaultValue="restaurant">
                    <SelectTrigger>
                      <SelectValue placeholder="Ангилал сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Ресторан</SelectItem>
                      <SelectItem value="fastfood">Түргэн хоол</SelectItem>
                      <SelectItem value="cafe">Кафе</SelectItem>
                      <SelectItem value="bakery">Бэйкери</SelectItem>
                      <SelectItem value="grocery">Хүнсний дэлгүүр</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Логоны зураг</label>
                  <Input 
                    type="text" 
                    placeholder="https://example.com/logo.jpg" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Дэвсгэр зураг</label>
                  <Input 
                    type="text" 
                    placeholder="https://example.com/cover.jpg" 
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Тохиргоо хадгалагдлаа",
                        description: "Таны бизнесийн мэдээлэл амжилттай шинэчлэгдлээ",
                      });
                    }}
                  >
                    Тохиргоо хадгалах
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}