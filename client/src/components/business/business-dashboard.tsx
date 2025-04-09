import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessOrders, getBusinessProducts, updateOrderStatus, addProduct, updateProduct, deleteProduct, logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderItem } from "@/components/business/order-item";
import { ProductForm } from "@/components/business/product-form";
import { Button } from "@/components/ui/button";
import { BarChart3, Book, Building2, CalendarDays, ChevronRight, GanttChartSquare, LineChart, ListOrdered, LogOut, MapPin, Package, PackageCheck, Phone, Plus, Search, Settings, ShoppingBag, Ticket, TrendingUp, Trash2, Truck, Users, Wrench, RefreshCw, Clipboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryLocationTracker } from "@/components/shared/delivery-location-tracker";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "wouter";
const salesData = [
  { name: 'Даваа', sales: 120000, orders: 14 },
  { name: 'Мягмар', sales: 98000, orders: 12 },
  { name: 'Лхагва', sales: 156000, orders: 19 },
  { name: 'Пүрэв', sales: 137000, orders: 16 },
  { name: 'Баасан', sales: 185000, orders: 22 },
  { name: 'Бямба', sales: 210000, orders: 25 },
  { name: 'Ням', sales: 164000, orders: 20 },
];
const categoryData = [
  { name: 'Хоол', value: 42 },
  { name: 'Ундаа', value: 28 },
  { name: 'Амттан', value: 18 },
  { name: 'Бусад', value: 12 },
];
const timeData = [
  { time: '8:00', orders: 2 },
  { time: '10:00', orders: 5 },
  { time: '12:00', orders: 15 },
  { time: '14:00', orders: 12 },
  { time: '16:00', orders: 8 },
  { time: '18:00', orders: 13 },
  { time: '20:00', orders: 10 },
  { time: '22:00', orders: 3 },
];
const topProducts = [
  { name: 'Төмсний зутан', sales: 76, amount: 684000, growth: 12 },
  { name: 'Бүхэлдээ шарсан тахиа', sales: 62, amount: 868000, growth: 8 },
  { name: 'Итали пицца', sales: 55, amount: 825000, growth: -3 },
  { name: 'Кола 0.5л', sales: 52, amount: 234000, growth: 5 },
  { name: 'Имбирний цай', sales: 48, amount: 192000, growth: 22 },
];
const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];
export function BusinessDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
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
  const [currentTab, setCurrentTab] = useState("overview");
  const [activePeriod, setActivePeriod] = useState("week");
  const [productViewType, setProductViewType] = useState("grid");
  const [currentDate] = useState(new Date());
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null as any });
  const [, setLocation] = useLocation();
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Системээс гарлаа",
        description: "Та амжилттай системээс гарлаа",
      });
      setLocation("/login");
    } catch (error: any) {
      toast({
        title: "Алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const formattedDate = new Intl.DateTimeFormat('mn-MN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const ordersData = await getBusinessOrders(user.uid);
        const productsData = await getBusinessProducts(user.uid);
        const sortedOrders = ordersData.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        setProducts(productsData);
        setFilteredProducts(productsData);
        calculateStats(sortedOrders);
      } catch (error: any) {
        console.error("Error fetching business data:", error);
        toast({
          title: "Мэдээлэл авахад алдаа гарлаа",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, toast]);
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  const calculateStats = (ordersData: any[]) => {
    const totalEarnings = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = ordersData.length > 0 ? totalEarnings / ordersData.length : 0;
    const dailySales = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const dayOrders = ordersData.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === dayStr;
      });
      const daySales = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      return {
        date: dayStr,
        sales: daySales,
        orders: dayOrders.length
      };
    }).reverse();
    setStats({
      earnings: totalEarnings,
      ordersCount: ordersData.length,
      avgOrder: avgOrderValue,
      recentSales: dailySales
    });
  };
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: "Төлөв шинэчлэгдлээ",
        description: `Захиалгын төлөв ${newStatus} болж өөрчлөгдлөө`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Төлөв шинэчлэхэд алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const handleAddProduct = async (productData: any) => {
    try {
      if (!user?.uid) throw new Error("User not authenticated");
      await addProduct(user.uid, productData);
      const updatedProducts = await getBusinessProducts(user.uid);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setShowProductForm(false);
      setSelectedProduct(null);
      toast({
        title: "Бүтээгдэхүүн нэмэгдлээ",
        description: "Бүтээгдэхүүн амжилттай нэмэгдлээ",
      });
    } catch (error: any) {
      toast({
        title: "Бүтээгдэхүүн нэмэхэд алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const handleUpdateProduct = async (productData: any) => {
    try {
      if (!selectedProduct?.id) throw new Error("Product ID not found");
      await updateProduct(selectedProduct.id, productData);
      const updatedProducts = await getBusinessProducts(user!.uid);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setShowProductForm(false);
      setSelectedProduct(null);
      toast({
        title: "Бүтээгдэхүүн шинэчлэгдлээ",
        description: "Бүтээгдэхүүний мэдээлэл амжилттай шинэчлэгдлээ",
      });
    } catch (error: any) {
      toast({
        title: "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = await getBusinessProducts(user!.uid);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      toast({
        title: "Бүтээгдэхүүн устгагдлаа",
        description: "Бүтээгдэхүүн амжилттай устгагдлаа",
      });
    } catch (error: any) {
      toast({
        title: "Бүтээгдэхүүн устгахад алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };
  const handleOpenDeleteDialog = (product: any) => {
    setDeleteDialog({ open: true, product });
  };
  const handleSaveProduct = (productData: any) => {
    if (selectedProduct) {
      handleUpdateProduct(productData);
    } else {
      handleAddProduct(productData);
    }
  };
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const processingOrders = orders.filter(order => order.status === "processing").length;
  const deliveredOrders = orders.filter(order => order.status === "delivered").length;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Мэдээлэл ачааллаж байна...
          </motion.p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
              <ShoppingBag className="h-7 w-7 text-amber-500" />
              <span>{user?.businessName || "Миний дэлгүүр"}</span>
              <span className="text-2xl tada">✨</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              {formattedDate} | <span className="text-amber-600 font-medium">Сайн байна уу, {user?.name || "Дэлгүүрийн эзэн"}!</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/dashboard/business/analytics">
                <Button variant="outline" className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100">
                  <BarChart3 className="h-4 w-4 mr-2 text-amber-600" /> Дэлгэрэнгүй статистик
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/settings">
                <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <Tabs
          defaultValue="overview"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full space-y-6"
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-1 border border-amber-100">
            <TabsList className="grid grid-cols-5 bg-transparent gap-1 h-auto p-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 py-2.5 data-[state=active]:text-white rounded-lg data-[state=active]:shadow-md"
              >
                <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <GanttChartSquare className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Хянах самбар</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 py-2.5 data-[state=active]:text-white rounded-lg data-[state=active]:shadow-md"
              >
                <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <ListOrdered className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Захиалгууд</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 py-2.5 data-[state=active]:text-white rounded-lg data-[state=active]:shadow-md"
              >
                <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <Package className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Бүтээгдэхүүн</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="delivery" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 py-2.5 data-[state=active]:text-white rounded-lg data-[state=active]:shadow-md"
              >
                <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Хүргэлт</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 py-2.5 data-[state=active]:text-white rounded-lg data-[state=active]:shadow-md"
              >
                <span className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <Wrench className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Тохиргоо</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden"
                >
                  <motion.div 
                    className="absolute top-0 right-0 bg-white/10 rounded-bl-xl p-2" 
                    whileHover={{ rotate: 5 }}
                  >
                    <TrendingUp className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold mb-1 text-white/90 text-sm">Нийт борлуулалт</h3>
                  <p className="text-2xl font-bold">{stats.earnings.toLocaleString()}₮</p>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-2">
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">+13.2%</span>
                    <span>Өмнөх 7 хоногоос</span>
                  </div>
                  <motion.div 
                    className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
                {}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100 relative overflow-hidden"
                >
                  <motion.div 
                    className="absolute top-0 right-0 bg-amber-100 rounded-bl-xl p-2 text-amber-700" 
                    whileHover={{ rotate: 5 }}
                  >
                    <Clipboard className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold mb-1 text-gray-500 text-sm">Нийт захиалга</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.ordersCount}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700">+8.3%</span>
                    <span>Өмнөх 7 хоногоос</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Гүйцэтгэл</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-1.5 bg-gray-100" />
                  </div>
                </motion.div>
                {}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100 relative overflow-hidden"
                >
                  <motion.div 
                    className="absolute top-0 right-0 bg-green-100 rounded-bl-xl p-2 text-green-700" 
                    whileHover={{ rotate: 5 }}
                  >
                    <LineChart className="h-6 w-6" />
                  </motion.div>
                  <h3 className="font-semibold mb-1 text-gray-500 text-sm">Дундаж захиалга</h3>
                  <p className="text-2xl font-bold text-gray-800">{Math.round(stats.avgOrder).toLocaleString()}₮</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700">+5.1%</span>
                    <span>Өмнөх 7 хоногоос</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="h-1.5 bg-amber-100 rounded-full"></div>
                    <div className="h-1.5 bg-amber-300 rounded-full"></div>
                    <div className="h-1.5 bg-amber-500 rounded-full"></div>
                  </div>
                </motion.div>
                {}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-md border border-amber-100"
                >
                  <h3 className="font-semibold mb-3 text-amber-800 text-sm flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Түргэн үйлдлүүд
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-white text-left px-3 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2 text-sm hover:border-amber-200 transition-colors"
                      onClick={() => {
                        setShowProductForm(true);
                        setSelectedProduct(null);
                      }}
                    >
                      <Plus className="h-4 w-4 text-amber-600" />
                      <span>Шинэ бүтээгдэхүүн нэмэх</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full bg-white text-left px-3 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2 text-sm hover:border-amber-200 transition-colors"
                      onClick={() => setCurrentTab("orders")}
                    >
                      <PackageCheck className="h-4 w-4 text-amber-600" />
                      <span>Захиалга шалгах</span>
                      {pendingOrders > 0 && (
                        <Badge className="ml-auto bg-amber-500">{pendingOrders}</Badge>
                      )}
                    </motion.button>
                    <Link href="/dashboard/business/analytics">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-white text-left px-3 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2 text-sm hover:border-amber-200 transition-colors"
                      >
                        <BarChart3 className="h-4 w-4 text-amber-600" />
                        <span>Дэлгэрэнгүй тайлан</span>
                        <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
              {}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden lg:col-span-2"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-amber-500" />
                          <span>Борлуулалтын тойм</span>
                        </span>
                      </h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`text-xs py-1 px-3 h-auto ${activePeriod === 'week' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}`}
                          onClick={() => setActivePeriod('week')}
                        >
                          7 хоног
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`text-xs py-1 px-3 h-auto ${activePeriod === 'month' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}`}
                          onClick={() => setActivePeriod('month')}
                        >
                          Сарын
                        </Button>
                      </div>
                    </div>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis
                            tickFormatter={(value) => `${value / 1000}K`}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toLocaleString()}₮`, 'Борлуулалт']}
                            labelFormatter={(name) => `${name} гараг`}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: 'none' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#f59e0b" 
                            fillOpacity={1} 
                            fill="url(#salesGradient)" 
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      <span className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        <span>Бүтээгдэхүүний ангилал</span>
                      </span>
                    </h3>
                    <div className="h-[250px] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">142</p>
                          <p className="text-sm text-gray-500">Нийт бүтээгдэхүүн</p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                            labelLine={false}
                            startAngle={90}
                            endAngle={-270}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value}%`, 'Хувь']}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: 'none' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categoryData.map((category, index) => (
                        <div key={category.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-xs text-gray-700">{category.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
              {}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">
                        <span className="flex items-center gap-2">
                          <Clipboard className="h-5 w-5 text-amber-500" />
                          <span>Сүүлийн захиалгууд</span>
                        </span>
                      </h3>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => setCurrentTab("orders")}
                        >
                          Бүгдийг харах 
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </motion.div>
                    </div>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {orders.slice(0, 5).map((order, index) => (
                        <motion.div
                          key={order.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg border hover:border-amber-200 transition-colors flex justify-between items-center gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-amber-100">
                              <AvatarFallback className="text-amber-700 text-xs">{order.customerName?.substring(0, 2).toUpperCase() || "ХЭ"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm text-gray-900">{order.customerName || "Хэрэглэгч"}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString()} | {order.items?.length || 0} бүтээгдэхүүн
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-right text-gray-900">{order.total?.toLocaleString() || 0}₮</div>
                            <Badge className={`text-xs ${
                              order.status === "pending" ? "bg-yellow-500" : 
                              order.status === "processing" ? "bg-blue-500" : 
                              order.status === "delivered" ? "bg-green-500" : 
                              "bg-gray-500"
                            }`}>
                              {order.status === "pending" ? "Хүлээгдэж буй" : 
                               order.status === "processing" ? "Бэлтгэж буй" : 
                               order.status === "delivered" ? "Хүргэгдсэн" : 
                               "Бусад"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                      {orders.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                          <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                            <Clipboard className="h-8 w-8 text-gray-400" />
                          </div>
                          <p>Захиалга байхгүй байна</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5 text-amber-500" />
                          <span>Шилдэг бүтээгдэхүүн</span>
                        </span>
                      </h3>
                      <div className="flex gap-2">
                        <Select value="week" onValueChange={() => {}}>
                          <SelectTrigger className="h-8 text-xs border-gray-200 w-[120px]">
                            <SelectValue placeholder="7 хоног" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">Өнөөдөр</SelectItem>
                            <SelectItem value="week">7 хоног</SelectItem>
                            <SelectItem value="month">Сарын</SelectItem>
                            <SelectItem value="year">Жилийн</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-10 text-xs text-gray-500 pb-2 px-3">
                        <div className="col-span-5">Бүтээгдэхүүн</div>
                        <div className="col-span-2 text-right">Зарагдсан</div>
                        <div className="col-span-2 text-right">Орлого</div>
                        <div className="col-span-1 text-right">Өсөлт</div>
                      </div>
                      {topProducts.map((product, index) => (
                        <motion.div
                          key={product.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="grid grid-cols-10 items-center p-3 rounded-lg border hover:border-amber-200 transition-colors"
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="bg-gradient-to-r from-amber-100 to-amber-200 h-9 w-9 rounded-md flex items-center justify-center">
                              <span className="text-amber-700 text-sm font-semibold">#{index+1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.sales} ширхэг</div>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">{product.sales} ш</div>
                          <div className="col-span-2 text-right font-semibold">{product.amount.toLocaleString()}₮</div>
                          <div className={`col-span-1 text-right ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'} text-xs font-medium`}>
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="orders" className="space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-amber-500" />
                  <span>Захиалгууд</span>
                  <Badge className="ml-2 bg-amber-500">{orders.length}</Badge>
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Захиалга хайх..." 
                      className="pl-9 border-gray-200 focus:border-amber-300"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] border-gray-200">
                      <SelectValue placeholder="Бүх захиалга" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Бүх захиалга</SelectItem>
                      <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
                      <SelectItem value="processing">Бэлтгэж буй</SelectItem>
                      <SelectItem value="delivered">Хүргэгдсэн</SelectItem>
                      <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                <Card className="border-l-4 border-l-amber-500 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Хүлээгдэж буй</p>
                        <p className="text-2xl font-bold">{pendingOrders}</p>
                      </div>
                      <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Бэлтгэж буй</p>
                        <p className="text-2xl font-bold">{processingOrders}</p>
                      </div>
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Хүргэгдсэн</p>
                        <p className="text-2xl font-bold">{deliveredOrders}</p>
                      </div>
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCheck className="h-5 w-5 text-green-700" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-medium">Сүүлийн захиалгууд</h3>
                  <Button variant="outline" size="sm" className="text-xs">Экспортлох</Button>
                </div>
                <div className="divide-y">
                  {orders.slice(0, 8).map((order) => (
                    <OrderItem
                      key={order.id}
                      id={order.id}
                      orderNumber={order.id.substring(0, 8).toUpperCase()}
                      customerName={order.customerName || "Үл мэдэгдэх"}
                      items={order.items || []}
                      total={order.total || 0}
                      status={order.status || "pending"}
                      address={order.address || "Хаяг оруулаагүй"}
                      requestedTime={order.requestedTime || "Аль болох хурдан"}
                      onStatusChange={() => handleStatusChange(order.id, order.status === "pending" ? "processing" : "delivered")}
                    />
                  ))}
                  {orders.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                      <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                        <Clipboard className="h-8 w-8 text-gray-400" />
                      </div>
                      <p>Одоогоор захиалга байхгүй байна</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="products" className="space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-500" />
                  <span>Бүтээгдэхүүнүүд</span>
                  <Badge className="ml-2 bg-amber-500">{products.length}</Badge>
                </h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Бүтээгдэхүүн хайх..." 
                      className="pl-9 border-gray-200 focus:border-amber-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] border-gray-200">
                      <SelectValue placeholder="Бүх ангилал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Бүх ангилал</SelectItem>
                      <SelectItem value="food">Хоол</SelectItem>
                      <SelectItem value="drink">Ундаа</SelectItem>
                      <SelectItem value="dessert">Амттан</SelectItem>
                      <SelectItem value="other">Бусад</SelectItem>
                    </SelectContent>
                  </Select>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                      onClick={() => {
                        setShowProductForm(true);
                        setSelectedProduct(null);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Бүтээгдэхүүн нэмэх
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Нийт <span className="font-semibold text-amber-600">{filteredProducts.length}</span> бүтээгдэхүүн
                    {searchQuery && <span> - Хайлт: <span className="font-medium">"{searchQuery}"</span></span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className={`p-1.5 rounded-md cursor-pointer ${productViewType === 'grid' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}
                    onClick={() => setProductViewType('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                  <div 
                    className={`p-1.5 rounded-md cursor-pointer ${productViewType === 'list' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}
                    onClick={() => setProductViewType('list')}
                  >
                    <List className="h-4 w-4" />
                  </div>
                </div>
              </div>
              {productViewType === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="relative h-40 bg-gray-100">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50">
                            <Package className="h-12 w-12 text-amber-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedProduct(product);
                                setShowProductForm(true);
                              }}>
                                <Pencil className="h-4 w-4 mr-2" /> Засах
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleOpenDeleteDialog(product)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Устгах
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.category || "Ангилалгүй"}</p>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{product.price?.toLocaleString()}₮</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description || "Тайлбаргүй"}</p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            {product.lastSold ? (
                              <span>Сүүлд: {new Date(product.lastSold).toLocaleDateString()}</span>
                            ) : (
                              <span>Зарагдаагүй</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {product.inStock ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Нөөцтэй</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Дууссан</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 p-3 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
                    <div className="col-span-5">Бүтээгдэхүүн</div>
                    <div className="col-span-2">Ангилал</div>
                    <div className="col-span-2 text-right">Үнэ</div>
                    <div className="col-span-2 text-center">Нөөц</div>
                    <div className="col-span-1 text-right">Үйлдэл</div>
                  </div>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-12 p-3 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50">
                              <Package className="h-5 w-5 text-amber-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-gray-800">{product.name}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{product.description || "Тайлбаргүй"}</p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{product.category || "Ангилалгүй"}</Badge>
                      </div>
                      <div className="col-span-2 text-right font-medium">{product.price?.toLocaleString()}₮</div>
                      <div className="col-span-2 text-center">
                        {product.inStock ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Нөөцтэй</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Дууссан</Badge>
                        )}
                      </div>
                      <div className="col-span-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedProduct(product);
                              setShowProductForm(true);
                            }}>
                              <Pencil className="h-4 w-4 mr-2" /> Засах
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleOpenDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Устгах
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                      <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p>Бүтээгдэхүүн олдсонгүй</p>
                      {searchQuery && (
                        <p className="mt-1 text-sm">Хайлт: "{searchQuery}"</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="delivery" className="space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-amber-500" />
                  <span>Хүргэлтийн хяналт</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden border-amber-100">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-4">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-amber-500" />
                        <span>Хүргэлтийн байршил</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="h-[400px] relative bg-gray-100">
                        <DeliveryLocationTracker 
                          origin={{ lat: 47.9184676, lng: 106.9177016 }}
                          destination={{ lat: 47.9234676, lng: 106.9237016 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="overflow-hidden border-amber-100">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-4">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-5 w-5 text-amber-500" />
                        <span>Хүргэлтийн ажилтнууд</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {[
                          { id: 1, name: "Батболд", phone: "9911-2233", status: "active", orders: 2 },
                          { id: 2, name: "Цэцэг", phone: "8822-1144", status: "busy", orders: 3 },
                          { id: 3, name: "Болд", phone: "9955-6677", status: "offline", orders: 0 },
                        ].map((driver) => (
                          <motion.div
                            key={driver.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-200 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-white bg-amber-100">
                                  <AvatarFallback className="bg-amber-100 text-amber-700">
                                    {driver.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                                  driver.status === "active" ? "bg-green-500" : 
                                  driver.status === "busy" ? "bg-amber-500" : 
                                  "bg-gray-400"
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{driver.name}</div>
                                <div className="text-xs text-gray-500">{driver.orders} захиалга</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden border-amber-100 mt-5">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 p-4">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <span>Хүргэлтийн статистик</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis 
                              tick={{ fontSize: 10 }} 
                              axisLine={false} 
                              tickLine={false} 
                              width={20}
                            />
                            <Tooltip 
                              formatter={(value: number) => [`${value}`, 'Захиалга']}
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: 'none' }}
                            />
                            <Bar 
                              dataKey="orders" 
                              fill="#f59e0b" 
                              radius={[4, 4, 0, 0]} 
                              barSize={15}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-gray-500">Дундаж хүргэлтийн хугацаа:</span>
                          </div>
                          <div>
                            <span className="font-semibold text-amber-600">28 минут</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-6 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-amber-500" />
                  <span>Дэлгүүрийн тохиргоо</span>
                </h2>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Системээс гарах
                  </Button>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden border-amber-100">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-amber-500" />
                      <span>Дэлгүүрийн мэдээлэл</span>
                    </CardTitle>
                    <CardDescription>
                      Дэлгүүрийн үндсэн мэдээллийг удирдах
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-name" className="text-sm font-medium">Дэлгүүрийн нэр</Label>
                        <Input id="business-name" defaultValue={user?.businessName || ''} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="business-type" className="text-sm font-medium">Дэлгүүрийн төрөл</Label>
                        <Select defaultValue={user?.businessType || "restaurant"}>
                          <SelectTrigger id="business-type" className="mt-1">
                            <SelectValue placeholder="Дэлгүүрийн төрөл сонгох" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="restaurant">Ресторан</SelectItem>
                            <SelectItem value="grocery">Хүнсний дэлгүүр</SelectItem>
                            <SelectItem value="retail">Жижиглэн худалдааны дэлгүүр</SelectItem>
                            <SelectItem value="other">Бусад</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-phone" className="text-sm font-medium">Утасны дугаар</Label>
                        <Input id="business-phone" defaultValue={user?.phone || ''} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="business-email" className="text-sm font-medium">Имэйл хаяг</Label>
                        <Input id="business-email" defaultValue={user?.email || ''} className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="business-description" className="text-sm font-medium">Дэлгүүрийн тайлбар</Label>
                      <textarea 
                        id="business-description" 
                        className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        rows={3}
                        defaultValue={user?.description || ''}
                      ></textarea>
                    </div>
                    <div>
                      <Label htmlFor="business-address" className="text-sm font-medium">Хаяг</Label>
                      <textarea 
                        id="business-address" 
                        className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                        rows={2}
                        defaultValue={user?.address || ''}
                      ></textarea>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 bg-gray-50 p-6">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                        Мэдээлэл хадгалах
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
                <div className="space-y-6">
                  <Card className="overflow-hidden border-amber-100">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-5 w-5 text-amber-500" />
                        <span>Ажлын цаг</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'].map((day, i) => (
                        <div key={day} className="flex items-center justify-between">
                          <div className="font-medium text-sm">{day}</div>
                          <div className="flex items-center gap-2">
                            <Select defaultValue={i < 5 ? "09:00" : (i === 5 ? "10:00" : "closed")}>
                              <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue placeholder="Нээх цаг" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="closed">Хаалттай</SelectItem>
                                <SelectItem value="09:00">09:00</SelectItem>
                                <SelectItem value="10:00">10:00</SelectItem>
                                <SelectItem value="11:00">11:00</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-gray-500">-</span>
                            <Select defaultValue={i < 5 ? "21:00" : (i === 5 ? "18:00" : "closed")}>
                              <SelectTrigger className="w-[100px] h-8 text-xs">
                                <SelectValue placeholder="Хаах цаг" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="closed">Хаалттай</SelectItem>
                                <SelectItem value="18:00">18:00</SelectItem>
                                <SelectItem value="20:00">20:00</SelectItem>
                                <SelectItem value="21:00">21:00</SelectItem>
                                <SelectItem value="22:00">22:00</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="border-t border-gray-100 bg-gray-50 p-3 flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs">
                        Хадгалах
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden border-amber-100">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Settings className="h-5 w-5 text-amber-500" />
                        <span>Дэлгүүрийн тохиргоо</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Захиалга авах</p>
                          <p className="text-xs text-gray-500">Дэлгүүрийн захиалга авах боломж</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Хүргэлтийн үйлчилгээ</p>
                          <p className="text-xs text-gray-500">Хүргэлтийн үйлчилгээ идэвхжүүлэх</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Захиалга баталгаажуулалт</p>
                          <p className="text-xs text-gray-500">Захиалга автоматаар зөвшөөрөх</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
      {}
      <AnimatePresence>
        {showProductForm && (
          <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct 
                    ? "Бүтээгдэхүүний мэдээллийг шинэчлэнэ" 
                    : "Шинэ бүтээгдэхүүний мэдээллийг оруулна"}
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                product={selectedProduct} 
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowProductForm(false);
                  setSelectedProduct(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
      {}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Бүтээгдэхүүн устгах</DialogTitle>
            <DialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Та "{deleteDialog.product?.name}" бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-end mt-5">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, product: null })}>
              Цуцлах
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.product && handleDeleteProduct(deleteDialog.product.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import {
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  MoreVertical,
  Clock,
  CheckCheck,
  Info
} from "lucide-react";