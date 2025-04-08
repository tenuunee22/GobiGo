import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessOrders, getBusinessProducts, updateOrderStatus, addProduct, updateProduct, deleteProduct } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderItem } from "@/components/business/order-item";
import { ProductForm } from "@/components/business/product-form";
import { Button } from "@/components/ui/button";
import { Phone, Plus, Search, Settings, TrendingUp, Trash2, Navigation, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLocationTracker } from "@/components/shared/delivery-location-tracker";
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
    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        
        // Fetch orders for this business
        const fetchedOrders = await getBusinessOrders(user.uid);
        setOrders(fetchedOrders);
        
        // Fetch products for this business
        const fetchedProducts = await getBusinessProducts(user.uid);
        setProducts(fetchedProducts);
        
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Update order status
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "Захиалгын төлөв шинэчлэгдлээ",
        description: `Захиалга #${orderId} ${getStatusText(newStatus)} төлөвт оруулав`,
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
        const updatedProduct = await updateProduct(selectedProduct.id, productData);
        
        // Update local state
        setProducts(prev => 
          prev.map(p => 
            p.id === selectedProduct.id ? { ...p, ...updatedProduct } : p
          )
        );
        
        toast({
          title: "Бүтээгдэхүүн шинэчлэгдлээ",
          description: `${productData.name} амжилттай шинэчлэгдлээ`,
        });
      } else {
        // Add new product
        const newProduct = await addProduct(user?.uid || "", productData);
        
        // Update local state
        setProducts(prev => [...prev, newProduct]);
        
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
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      
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
      <h1 className="text-2xl font-bold mb-6 slide-in-left flex items-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Бизнес удирдлага</span>
        <span className="ml-3 tada text-xl">🏪</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bounce-in">
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-blue-500 wiggle">💰</span>
              Нийт борлуулалт
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              {stats.earnings.toLocaleString()}₮
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 mr-1">↑</span>
              <span className="text-green-500 font-medium">+20.1%</span> өнгөрсөн сараас
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-purple-500 jelly">📦</span>
              Нийт захиалга
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {stats.ordersCount}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 mr-1">↑</span>
              <span className="text-green-500 font-medium">+12</span> өнгөрсөн долоо хоногоос
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 dashboard-card-hover overflow-hidden border-t-4 border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <span className="mr-2 text-amber-500 heartbeat">⭐</span>
              Дундаж захиалга
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-transparent bg-clip-text">
              {stats.avgOrder.toLocaleString()}₮
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 mr-1">↑</span>
              <span className="text-green-500 font-medium">+2.5%</span> өнгөрсөн сараас
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
          <TabsTrigger value="shop">Дэлгүүр</TabsTrigger>
          <TabsTrigger value="delivery-tracking" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 relative overflow-hidden border-b-4 border-indigo-700">
            <Navigation className="h-4 w-4 text-white wobble" />
            <span className="font-medium">Хүргэлт хянах</span>
            <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">3</span>
          </TabsTrigger>
          <TabsTrigger value="products">Бүтээгдэхүүн</TabsTrigger>
          <TabsTrigger value="earnings">Орлого</TabsTrigger>
          <TabsTrigger value="sales">Борлуулалт</TabsTrigger>
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
                  // Determine next status based on current status
                  let nextStatus = "preparing";
                  if (order.status === "placed") nextStatus = "preparing";
                  else if (order.status === "preparing") nextStatus = "ready";
                  else if (order.status === "ready") nextStatus = "on-the-way";
                  else if (order.status === "on-the-way") nextStatus = "delivered";
                  else if (order.status === "delivered") nextStatus = "completed";
                  
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
                    className="h-40 bg-center bg-cover bg-gray-100" 
                    style={{ 
                      backgroundImage: product.imageUrl 
                        ? `url(${product.imageUrl})` 
                        : "none"
                    }}
                  >
                    {!product.imageUrl && (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span>Зураггүй</span>
                      </div>
                    )}
                  </div>
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
        
        <TabsContent value="shop">
          <Card>
            <CardHeader>
              <CardTitle>Дэлгүүрийн хуудас</CardTitle>
              <p className="text-sm text-gray-500">Энэ хэсэгт таны дэлгүүрийн үзэгдэх байдал харагдана</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">{user?.businessName || "Танай дэлгүүр"}</h2>
                
                {user?.coverImage && (
                  <div className="relative w-full h-40 md:h-60 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={user.coverImage} 
                      alt={user?.businessName || "Дэлгүүрийн ковер зураг"} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{user?.businessName}</h3>
                      <p className="text-sm opacity-90">{user?.businessType || "Хоолны газар"}</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Дэлгүүрийн мэдээлэл</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Нэр:</span> {user?.businessName || "Тохируулаагүй"}</p>
                      <p><span className="font-medium">Төрөл:</span> {user?.businessType || "Тохируулаагүй"}</p>
                      <p><span className="font-medium">Ажиллах цаг:</span> 10:00 - 22:00</p>
                      <p><span className="font-medium">Утас:</span> {user?.phone || "Тохируулаагүй"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Байршил</h3>
                    {user?.location ? (
                      <div className="space-y-2 text-sm">
                        <p>{typeof user.location === 'string' ? user.location : 'Байршил оруулсан'}</p>
                        {user.locationLat && user.locationLng && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Координат:</span> {Number(user.locationLat).toFixed(6)}, {Number(user.locationLng).toFixed(6)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Байршил тохируулаагүй байна</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Үнэлгээ</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                        <span className="ml-2">4.3 / 5</span>
                      </div>
                      <p>Нийт үнэлгээ: 27</p>
                      <p>Сэтгэгдэл: 15</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Бүтээгдэхүүнүүд</h3>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredProducts.slice(0, 8).map((product) => (
                        <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
                          <div 
                            className="h-28 bg-center bg-cover" 
                            style={{ backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : "none" }}
                          >
                            {!product.imageUrl && (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="text-xs">Зураггүй</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500 h-8 overflow-hidden">{product.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium text-sm">{product.price?.toLocaleString()}₮</span>
                              <button className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                                Захиалах
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Одоогоор бүтээгдэхүүн байхгүй байна</p>
                      <Button onClick={handleAddProduct} size="sm" className="mt-2">
                        <Plus className="mr-1 h-3 w-3" /> Бүтээгдэхүүн нэмэх
                      </Button>
                    </div>
                  )}
                  
                  {filteredProducts.length > 8 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">
                        Бүгдийг харах ({filteredProducts.length})
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Сэтгэгдлүүд</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                          <div>
                            <p className="font-medium text-sm">Болд Бат</p>
                            <div className="flex text-yellow-400">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">2023-11-20</p>
                      </div>
                      <p className="text-sm">Маш амттай, үйлчилгээ түргэн шуурхай байсан. Хоолны амт чанар өндөр.</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                          <div>
                            <p className="font-medium text-sm">Оюун Дуламсүрэн</p>
                            <div className="flex text-yellow-400">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">2023-11-15</p>
                      </div>
                      <p className="text-sm">Нэг л удаа захиалсан, хоол амттай байсан ч, хүргэлт жоохон удсан.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Орлогын мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Орлогын хураангуй</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Өнөөдрийн орлого
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.recentSales[stats.recentSales.length - 1]?.revenue.toLocaleString()}₮
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.recentSales[stats.recentSales.length - 1]?.orders || 0} захиалга
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Өнгөрсөн 7 хоногийн орлого
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.recentSales.reduce((sum: number, day: any) => sum + day.revenue, 0).toLocaleString()}₮
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.recentSales.reduce((sum, day) => sum + day.orders, 0)} захиалга
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Нийт орлого
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.earnings.toLocaleString()}₮
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.ordersCount} захиалга
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Сүүлийн 7 хоногийн орлого</h3>
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
                        name="Борлуулалт (₮)" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        name="Захиалгын тоо" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Орлогын жагсаалт</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Огноо
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Захиалгын дугаар
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Хэрэглэгч
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Төлбөр
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Төлөв
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedOrders.filter(order => order.status === "completed").slice(0, 10).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt || new Date()).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.substring(0, 6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerName || "Хэрэглэгч"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {order.totalAmount ? order.totalAmount.toLocaleString() : 0}₮
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Гүйцэтгэсэн
                            </span>
                          </td>
                        </tr>
                      ))}
                      {sortedOrders.filter(order => order.status === "completed").length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            Одоогоор гүйцэтгэсэн захиалга байхгүй байна
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card className="border-t-4 border-indigo-500 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="mr-3 text-indigo-500 tada text-xl">📊</span>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">Бараа бүтээгдэхүүний борлуулалт</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 slide-in-left">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2 text-indigo-600 wiggle">📈</span>
                  Борлуулалтын тойм
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                      <span className="mr-2 text-blue-500 bounce-soft">🛒</span>
                      Нийт борлуулсан бүтээгдэхүүн
                    </h4>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                      {sortedOrders.reduce((sum, order) => {
                        return sum + (order.items || []).reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
                      }, 0)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                      <span className="mr-2 text-purple-500 jelly">🍽️</span>
                      Бүтээгдэхүүний төрөл
                    </h4>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                      {filteredProducts.length}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <h4 className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                      <span className="mr-2 text-amber-500 wobble">💲</span>
                      Дундаж үнэ</h4>
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                      {filteredProducts.length ? 
                        Math.round(filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0) / filteredProducts.length).toLocaleString() : 0}₮
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Хамгийн их зарагдсан</h4>
                    <div className="text-xl font-bold truncate">
                      {(() => {
                        // Бүх захиалгын item-уудыг нэгтгэж, хамгийн их зарагдсаныг олох
                        const allItems: { [key: string]: { name: string; quantity: number } } = {};
                        
                        sortedOrders.forEach(order => {
                          (order.items || []).forEach(item => {
                            if (!allItems[item.name]) {
                              allItems[item.name] = { name: item.name, quantity: 0 };
                            }
                            allItems[item.name].quantity += (item.quantity || 0);
                          });
                        });
                        
                        const itemsArray = Object.values(allItems);
                        if (itemsArray.length === 0) return "Байхгүй";
                        
                        const mostSold = itemsArray.reduce((max, item) => 
                          item.quantity > max.quantity ? item : max, itemsArray[0]);
                          
                        return mostSold.name;
                      })()}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Бүтээгдэхүүн
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Нийт зарагдсан
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Нийт орлого
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сүүлийн борлуулалт
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        // Бүх захиалгын item-уудыг нэгтгэж, бүтээгдэхүүн бүрээр нь ангилах
                        const soldItems: {
                          [key: string]: {
                            name: string;
                            quantity: number;
                            revenue: number;
                            lastSold?: Date;
                          }
                        } = {};
                        
                        sortedOrders.forEach(order => {
                          const orderDate = new Date(order.createdAt || new Date());
                          
                          (order.items || []).forEach(item => {
                            if (!soldItems[item.name]) {
                              soldItems[item.name] = {
                                name: item.name,
                                quantity: 0,
                                revenue: 0,
                                lastSold: undefined
                              };
                            }
                            
                            const currentItem = soldItems[item.name];
                            currentItem.quantity += (item.quantity || 0);
                            currentItem.revenue += ((item.price || 0) * (item.quantity || 0));
                            
                            // Сүүлийн зарагдсан хугацааг шинэчлэх
                            if (!currentItem.lastSold || orderDate > currentItem.lastSold) {
                              currentItem.lastSold = orderDate;
                            }
                          });
                        });
                        
                        // Массив болгож, борлуулалтын хэмжээгээр эрэмбэлэх
                        const sortedItems = Object.values(soldItems).sort((a, b) => b.quantity - a.quantity);
                        
                        if (sortedItems.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                Одоогоор бүтээгдэхүүн зарагдаагүй байна
                              </td>
                            </tr>
                          );
                        }
                        
                        return sortedItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity} ширхэг
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.revenue.toLocaleString()}₮
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.lastSold ? item.lastSold.toLocaleDateString() : "Тодорхойгүй"}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 mb-10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2 text-indigo-600 jelly">🔍</span>
                    Бүтээгдэхүүн хөрөнгийн дүн шинжилгээ
                  </h3>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm">
                    <h4 className="text-base font-medium mb-4 flex items-center">
                      <span className="mr-2 text-indigo-600 pulse">🍳</span>
                      Хамгийн их зарагдсан орц материал
                    </h4>
                    
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      {/* Онгоц хэлбэртэй визуализаци */}
                      <div className="relative h-60 w-full">
                        {/* Онгоцын их бие */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-1 bg-indigo-300 rounded"></div>
                        
                        {/* Орц бүрээр тойргууд үүсгэх */}
                        {['Гурил', 'Өндөг', 'Сүү', 'Мах', 'Төмс', 'Гоймон', 'Хиам', 'Байцаа', 'Лууван', 'Сонгино'].map((ingredient, index) => {
                          const size = 75 - (index * 5); // Их зарагдалттай нь том хэмжээтэй
                          const left = 10 + (index * 8.5) + '%';
                          const delay = index * 0.2;
                          const icons = ['🍞', '🥚', '🥛', '🥩', '🥔', '🍜', '🌭', '🥬', '🥕', '🧅'];
                          
                          return (
                            <div 
                              key={ingredient}
                              className="absolute bounce-ingredient rounded-full flex items-center justify-center shadow-md"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`, 
                                left,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: `hsla(${220 + index * 15}, 85%, 85%, 0.9)`,
                                border: `2px solid hsla(${220 + index * 15}, 85%, 75%, 1)`,
                                animationDelay: `${delay}s`,
                                zIndex: 10 - index, // Эрэмбээр давхарлах
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-xl mb-1 wiggle" style={{ animationDelay: `${delay + 0.5}s` }}>{icons[index % icons.length]}</span>
                                <span className="text-xs font-medium text-indigo-900">{ingredient}</span>
                                <span className="text-xs font-bold text-indigo-800">{Math.round(100 - (index * 8))}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-white hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <span className="mr-2 text-red-500 tada">🔴</span>
                            Хамгийн их дутагдалтай орц
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-medium">Сонгино</div>
                          <div className="text-sm text-gray-500">Нөөц: 15%</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <span className="mr-2 text-green-500 pulse">🟢</span>
                            Хамгийн их нөөцтэй орц
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-medium">Гурил</div>
                          <div className="text-sm text-gray-500">Нөөц: 87%</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <span className="mr-2 text-amber-500 wiggle">⚠️</span>
                            Дууссан орц
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-medium">Үхрийн мах</div>
                          <div className="text-sm text-gray-500">Шаардлагатай: 5 кг</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-white hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <span className="mr-2 text-blue-500 jelly">📊</span>
                            Зарцуулалтын өсөлт
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-medium">+23%</div>
                          <div className="text-sm text-gray-500">Өнгөрсөн 7 хоног</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="mr-2 text-indigo-600 float">📝</span>
                    Сүүлийн захиалгууд</h3>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Огноо
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Хэрэглэгч
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Бүтээгдэхүүн
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Төлбөр
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Төлөв
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedOrders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt || new Date()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.customerName || "Хэрэглэгч"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs truncate">
                                {(order.items || []).map(item => `${item.name} (${item.quantity})`).join(", ")}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.totalAmount?.toLocaleString()}₮
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${order.status === "completed" ? "bg-green-100 text-green-800" : 
                                  order.status === "on-the-way" ? "bg-blue-100 text-blue-800" : 
                                  order.status === "cancelled" ? "bg-red-100 text-red-800" : 
                                  "bg-yellow-100 text-yellow-800"}`}>
                                {getStatusText(order.status || "")}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {sortedOrders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                              Одоогоор захиалга байхгүй байна
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
        
        <TabsContent value="delivery-tracking">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="slide-in-left">
              <h3 className="mb-4 text-lg font-semibold flex items-center">
                <Navigation className="mr-2 h-5 w-5 text-primary wiggle" />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Хүргэлтийн байршил
                </span>
                <span className="ml-2 tada">🚚</span>
              </h3>
              <DeliveryLocationTracker
                origin={user?.location ? 
                  { 
                    lat: user.locationLat ? parseFloat(user.locationLat.toString()) : 47.9184676, 
                    lng: user.locationLng ? parseFloat(user.locationLng.toString()) : 106.917693 
                  } : 
                  { lat: 47.9184676, lng: 106.917693 }}
                destination={{ lat: 47.9234676, lng: 106.9237016 }}
                estimatedTime="15-20 мин"
                deliveryPersonName="Батаа"
              />
            </div>
            
            <div className="slide-in-right">
              <h3 className="mb-4 text-lg font-semibold flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary pulse" />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Хүргэлтийн дэлгэрэнгүй
                </span>
              </h3>
              <Card className="dashboard-card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    Хүргэлтийн мэдээлэл
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 bounce-in">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Захиалгын дугаар:</span>
                    <span className="font-medium">#AB1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хэрэглэгч:</span>
                    <span className="font-medium">Болд Очир</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хаяг:</span>
                    <span className="font-medium">Чингэлтэй 1-р хороо, 45-р байр</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Утас:</span>
                    <span className="font-medium">9911-2233</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Төлбөр:</span>
                    <span className="font-medium">45,000₮ (Карт)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Жолооч:</span>
                    <span className="font-medium">Батаа</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span className="font-medium">Одоогийн байршил:</span>
                    <span className="font-medium">1.5 км зайтай</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">Захиалгын бүтээгдэхүүнүүд:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2x Ангус бургер</span>
                      <span>30,000₮</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1x Пепси 0.5л</span>
                      <span>3,000₮</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>1x Төмсний чипс</span>
                      <span>7,000₮</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Хүргэлтийн төлбөр</span>
                      <span>5,000₮</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full" variant="default">
                    <Phone className="mr-2 h-4 w-4" />
                    Хэрэглэгчтэй холбогдох
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}