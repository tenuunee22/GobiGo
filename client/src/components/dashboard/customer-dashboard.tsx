import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBusinesses, getCustomerOrders } from "@/lib/firebase";
import { CategoryCard } from "@/components/customer/category-card";
import { RestaurantCard } from "@/components/customer/restaurant-card";
import { OrderTracking } from "@/components/customer/order-tracking";
import { WelcomeBanner } from "@/components/shared/welcome-banner";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Search, ShoppingCart, PlusCircle, Pill, Utensils, Store, Grid3X3, CakeSlice, Coffee, ArrowRight, MapPin, Bookmark, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeRecommendationCarousel } from "@/components/customer/recipe-recommendation-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Add user location state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Mock driver location for the OrderTracking component
  const [driverLocation, setDriverLocation] = useState<{lat: number, lng: number}>({
    lat: 47.9184676,
    lng: 106.9177016
  });
  
  // Mock destination location (customer address)
  const destinationLocation = {
    lat: 47.9234676,
    lng: 106.9237016
  };
  
  // Test animation by changing status
  const [demoStatus, setDemoStatus] = useState<"placed" | "preparing" | "on-the-way" | "delivered">("placed");
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Байршил авахад алдаа гарлаа:", error);
          toast({
            title: "Байршил авах боломжгүй байна",
            description: "Та байршлаа идэвхжүүлнэ үү",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);
  
  // Simulate driver movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (demoStatus === "on-the-way") {
      interval = setInterval(() => {
        setDriverLocation(prev => ({
          lat: prev.lat + (destinationLocation.lat - prev.lat) * 0.1,
          lng: prev.lng + (destinationLocation.lng - prev.lng) * 0.1
        }));
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [demoStatus, destinationLocation.lat, destinationLocation.lng]);
  
  // Advance demo status
  useEffect(() => {
    const timer = setTimeout(() => {
      switch (demoStatus) {
        case "placed":
          setDemoStatus("preparing");
          break;
        case "preparing":
          setDemoStatus("on-the-way");
          break;
        case "on-the-way":
          setTimeout(() => {
            setDemoStatus("delivered");
          }, 15000);
          break;
        default:
          break;
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [demoStatus]);
  
  // Fetch businesses and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch businesses
        const businessesData = await getBusinesses();
        setBusinesses(businessesData);
        
        // Create a set of featured restaurants
        const featured = businessesData
          .filter((business: any) => business.rating >= 4.5)
          .slice(0, 5);
        setFeaturedRestaurants(featured);
        
        // Fetch active orders if user is logged in
        if (user?.uid) {
          const ordersData = await getCustomerOrders(user.uid);
          const active = ordersData.filter((order: any) => 
            order.status !== "delivered" && order.status !== "cancelled"
          );
          setActiveOrders(active);
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Өгөгдөл авахад алдаа гарлаа",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  // Sort restaurants based on rating
  const sortedRestaurants = [...businesses].sort((a, b) => b.rating - a.rating);
  
  // Filter restaurants based on category
  const filteredRestaurants = activeCategory
    ? sortedRestaurants.filter(restaurant => restaurant.category === activeCategory)
    : sortedRestaurants;
  
  // Filter restaurants based on search query
  const searchedRestaurants = searchQuery
    ? filteredRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRestaurants;

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Animation for welcome elements
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut"
      }
    }
  };

  const staggerDelay = 0.1;

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPosition = `50% ${50 + scrollPosition * 0.05}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative bg-cover bg-center h-[500px] md:h-[600px] overflow-hidden flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center md:text-left max-w-2xl mx-auto md:mx-0"
          >
            {/* Time-based Greeting */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="text-xl md:text-2xl text-amber-300 font-medium">
                {new Date().getHours() < 12 ? "Өглөөний мэнд" : 
                 new Date().getHours() < 18 ? "Өдрийн мэнд" : "Оройн мэнд"}
                {user && `, ${user.name || user.displayName || "Хэрэглэгч"}!`}
                <span className="ml-2 animate-wave inline-block">👋</span>
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
              variants={titleVariants}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                GobiGo
              </span> <span className="animate-bounce-gentle inline-block">✨</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              variants={titleVariants}
              transition={{ delay: staggerDelay }}
            >
              Хамгийн шилдэг амтыг хаанаас ч <span className="font-semibold text-amber-300">захиалаарай</span> 
              <span className="ml-2 text-2xl animate-bounce-slow inline-block">🍜</span>
            </motion.p>
            
            <motion.div 
              className="relative max-w-lg mx-auto md:mx-0"
              variants={titleVariants}
              transition={{ delay: staggerDelay * 2 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Хоолны газар хайх..." 
                className="pl-10 py-6 bg-white/95 border-0 rounded-full shadow-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.div 
                className="absolute inset-y-0 right-1.5 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="rounded-full h-10 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Хайх
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center md:justify-start gap-2 mt-6"
              variants={titleVariants}
              transition={{ delay: staggerDelay * 3 }}
            >
              <Badge className="bg-amber-500/80 hover:bg-amber-600 text-white py-1.5 px-3 text-sm cursor-pointer">
                Хоол 🍽️
              </Badge>
              <Badge className="bg-amber-500/80 hover:bg-amber-600 text-white py-1.5 px-3 text-sm cursor-pointer">
                Ресторан 🍲
              </Badge>
              <Badge className="bg-amber-500/80 hover:bg-amber-600 text-white py-1.5 px-3 text-sm cursor-pointer">
                Хүргэлт 🚚
              </Badge>
              <Badge className="bg-amber-500/80 hover:bg-amber-600 text-white py-1.5 px-3 text-sm cursor-pointer">
                Эм 💊
              </Badge>
            </motion.div>
          </motion.div>
        </div>

        {/* Scrolling emojis animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ 
                x: Math.random() * 100 - 50 + '%', 
                y: -30, 
                opacity: 0.7 
              }}
              animate={{ 
                y: '120%', 
                rotate: Math.random() * 360,
                opacity: [0.7, 0.9, 0.7, 0]
              }}
              transition={{ 
                duration: Math.random() * 15 + 15, 
                repeat: Infinity, 
                ease: 'linear',
                delay: Math.random() * 10
              }}
            >
              {['🍔', '🍕', '🍣', '🍜', '🍦', '🥗', '🍗', '🍱', '🥘', '🍹'][Math.floor(Math.random() * 10)]}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-12">
        {/* Active Order Section */}
        <AnimatePresence>
          {activeOrders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 shadow-md overflow-hidden">
                <h2 className="text-xl font-bold mb-4 flex items-center text-amber-800">
                  <Clock className="h-5 w-5 mr-2 text-amber-600" />
                  Идэвхтэй захиалга
                  <span className="ml-2 animate-bounce-gentle inline-block">⏳</span>
                </h2>
                
                <OrderTracking
                  orderId="123456"
                  status={demoStatus}
                  driver={{
                    id: "driver1",
                    name: "Болд",
                    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
                    arrivalTime: "10 минутын дотор"
                  }}
                  items={[
                    { name: "Өндөгтэй Пицца", quantity: 1, price: 25000 },
                    { name: "Кола 0.5л", quantity: 2, price: 3000 }
                  ]}
                  subtotal={31000}
                  deliveryFee={1500}
                  total={32500}
                  currentLocation={driverLocation}
                  destination={destinationLocation}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <Card className="overflow-hidden border-0 shadow-lg relative bg-gradient-to-r from-amber-500 to-orange-600">
              <CardContent className="p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold flex items-center gap-2"
                    >
                      <span>{user.name ? `Сайн байна уу, ${user.name}!` : 'Сайн байна уу!'}</span>
                      <span className="text-3xl animate-wave">👋</span>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/80 mt-1"
                    >
                      Юу захиалах вэ?
                    </motion.p>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="secondary" 
                      className="bg-white text-amber-600 hover:bg-gray-100 font-medium shadow-md"
                      onClick={() => setLocation('/orders')}
                    >
                      Миний захиалгууд
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full transform -translate-y-1/2"></div>
            </Card>
          </motion.div>
        )}

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                Ангилалууд
              </span>
              <span className="ml-2 text-xl">🍽️</span>
            </h2>
            <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              Бүгдийг харах
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Бүгд"
                icon={<Grid3X3 className="h-6 w-6" />}
                onClick={() => setActiveCategory(null)}
                isActive={activeCategory === null}
                emoji="✨"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Ресторан"
                icon={<Utensils className="h-6 w-6" />}
                onClick={() => setActiveCategory("restaurant")}
                isActive={activeCategory === "restaurant"}
                emoji="🍽️"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Хүнсний"
                icon={<Store className="h-6 w-6" />}
                onClick={() => setActiveCategory("grocery")}
                isActive={activeCategory === "grocery"}
                emoji="🛒"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Эмийн сан"
                icon={<Pill className="h-6 w-6" />}
                onClick={() => setActiveCategory("pharmacy")}
                isActive={activeCategory === "pharmacy"}
                emoji="💊"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Амттан"
                icon={<CakeSlice className="h-6 w-6" />}
                onClick={() => setActiveCategory("dessert")}
                isActive={activeCategory === "dessert"}
                emoji="🍰"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard
                name="Кофе шоп"
                icon={<Coffee className="h-6 w-6" />}
                onClick={() => setActiveCategory("coffee")}
                isActive={activeCategory === "coffee"}
                emoji="☕"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                  Онцлох газрууд
                </span>
                <span className="tada text-xl">⭐</span>
              </div>
            </h2>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <motion.div 
              className="flex gap-4 py-2 overflow-x-auto custom-scrollbar px-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {featuredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id || index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.2 + index * 0.1 }
                  }}
                  className="min-w-[300px] sm:min-w-[320px]"
                >
                  <Card className="overflow-hidden border border-gray-200 shadow-md h-full">
                    <div className="relative h-40">
                      {restaurant.imageUrl ? (
                        <img 
                          src={restaurant.imageUrl} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center">
                          <Utensils className="h-16 w-16 text-amber-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-amber-500/90 text-white">
                          ⭐ {restaurant.rating}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-white/90 text-amber-700 border border-amber-200">
                          {restaurant.category === "restaurant" ? "Ресторан 🍽️" : 
                           restaurant.category === "grocery" ? "Хүнсний 🛒" :
                           restaurant.category === "pharmacy" ? "Эмийн сан 💊" :
                           restaurant.category === "dessert" ? "Амттан 🍰" :
                           restaurant.category === "coffee" ? "Кофе ☕" : "Бусад 🍴"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                        <motion.button 
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-amber-500"
                        >
                          <Bookmark className="h-5 w-5" />
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="truncate">{restaurant.address || "Хаяг оруулаагүй"}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{restaurant.deliveryTime || "30-40 мин"}</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="text-sm h-8 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                          onClick={() => setLocation(`/restaurant/${restaurant.id}`)}
                        >
                          Үзэх
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {loading && Array(5).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="min-w-[300px] sm:min-w-[320px]">
                  <Card className="overflow-hidden border border-gray-200 h-full">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Recommendation Section */}
        <div className="mb-12">
          <RecipeRecommendationCarousel />
        </div>

        {/* All Restaurants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                  Бүх Газрууд
                </span>
              </h2>
              <p className="text-gray-500 text-sm">
                {searchedRestaurants.length} газар олдлоо
                {searchQuery && <span> · Хайлт: "{searchQuery}"</span>}
                {activeCategory && <span> · Ангилал: {
                  activeCategory === "restaurant" ? "Ресторан 🍽️" : 
                  activeCategory === "grocery" ? "Хүнсний 🛒" :
                  activeCategory === "pharmacy" ? "Эмийн сан 💊" :
                  activeCategory === "dessert" ? "Амттан 🍰" :
                  activeCategory === "coffee" ? "Кофе ☕" : "Бусад 🍴"
                }</span>}
              </p>
            </div>
            
            <div className="relative w-64 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Газар хайх..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {searchedRestaurants.map((business, index) => (
              <motion.div 
                key={business.id || index}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, scale: 1.01 }}
                className="h-full"
              >
                <RestaurantCard 
                  id={business.id || ""}
                  name={business.name || ""}
                  imageUrl={business.imageUrl || ""}
                  category={business.category || ""}
                  distance={business.distance || "2.5 км"}
                  rating={business.rating || 4.0}
                  deliveryFee={business.deliveryFee || 0}
                  estimatedTime={business.deliveryTime || "30-40 мин"}
                  onClick={() => setLocation(`/restaurant/${business.id}`)}
                />
              </motion.div>
            ))}
            
            {loading && Array(8).fill(0).map((_, index) => (
              <div key={`skeleton-list-${index}`}>
                <Card className="overflow-hidden border border-gray-200 h-full">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
          
          {searchedRestaurants.length === 0 && !loading && (
            <div className="text-center py-20">
              <motion.div 
                className="text-5xl mb-4 inline-block"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🔍
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Хайлтад тохирох газар олдсонгүй</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Өөр түлхүүр үг ашиглан дахин хайна уу эсвэл ангилалаа өөрчилнө үү.
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4 border-amber-200 hover:bg-amber-50 text-amber-700"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(null);
                  }}
                >
                  Хайлтыг арилгах
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* Social Media Links */}
      <section className="bg-gradient-to-r from-amber-100 to-orange-100 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-amber-900"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              Бидэнтэй холбогдоорой
              <span className="ml-2 text-2xl wobble inline-block">🤝</span>
            </motion.h2>
            <motion.p 
              className="text-amber-800 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Хамгийн сүүлийн үeийн мэдээлэл, онцгой урамшууллыг бидний сошиал хуудсаас аваарай
            </motion.p>
          </div>
          
          <div className="flex justify-center gap-8">
            {/* Facebook */}
            <motion.a 
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </div>
              <span className="text-amber-900 font-medium">Facebook</span>
            </motion.a>
            
            {/* Instagram */}
            <motion.a 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white rounded-full shadow-lg mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.5-.509 1.105-.902 1.772-1.153.637-.247 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/>
                </svg>
              </div>
              <span className="text-amber-900 font-medium">Instagram</span>
            </motion.a>
            
            {/* Twitter */}
            <motion.a 
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 flex items-center justify-center bg-black text-white rounded-full shadow-lg mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </div>
              <span className="text-amber-900 font-medium">Twitter</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </div>
  );
}

// Add animation styles directly in index.css