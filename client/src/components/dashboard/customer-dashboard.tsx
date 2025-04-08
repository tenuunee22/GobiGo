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
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
              variants={titleVariants}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                GobiGo
              </span> <span className="animate-wave inline-block">👋</span>
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

      {/* App promotion */}
      <section className="bg-gradient-to-r from-amber-100 to-orange-100 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-900">
                GobiGo аппликейшн татаж аваарай! 
                <span className="ml-2 text-2xl animate-bounce-gentle inline-block">📱</span>
              </h2>
              <p className="text-amber-800 text-lg mb-6">
                Хамгийн хурдан хүргэлт, хамгийн хялбар захиалга, онцгой урамшууллууд танд хүрнэ!
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-amber-900 hover:bg-amber-950 text-white rounded-full h-14 px-6">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5227 7.39069C17.3524 7.47237 15.1281 8.73575 15.1281 11.4252C15.1281 14.5489 17.8907 15.6905 18.0075 15.7347C17.989 15.7871 17.5043 17.3499 16.3214 18.9507C15.2766 20.3333 14.1876 21.7131 12.5933 21.7131C11.0246 21.7131 10.5458 20.8261 8.75245 20.8261C7.01446 20.8261 6.31263 21.7131 4.84762 21.7131C3.20021 21.7131 2.01359 20.211 0.946335 18.8414C-0.352497 17.145 -0.954069 13.8291 0.596928 11.5199C1.36516 10.3777 2.66746 9.65242 4.06121 9.63863C5.64222 9.61653 6.13202 10.5842 8.04455 10.5842C9.92359 10.5842 10.3223 9.61653 12.078 9.61653C12.9768 9.61653 14.4359 9.99488 15.4622 10.898C15.373 10.8346 13.0018 9.47121 12.9817 7.4079C12.9621 5.73967 14.8702 4.55366 14.9836 4.47198C13.905 2.92985 12.2519 2.75391 11.6368 2.73472C9.56542 2.64473 7.66917 4.08268 6.68043 4.08268C5.71303 4.08268 4.1069 2.81999 2.4446 2.81999C2.16496 2.82138 0.0107899 2.89199 0.0107899 5.36475C0.0107899 5.93194 0.0814872 6.69756 0.321331 7.59077C1.12627 10.2729 3.04718 15.3835 5.52347 18.9067C6.68714 20.5901 7.77545 21.6959 8.73105 21.6959C9.80524 21.6959 10.3214 21.1108 11.5823 21.1108C12.8031 21.1108 13.2764 21.6959 14.4261 21.6959C15.6354 21.6959 16.6316 20.6721 17.7027 19.0995C17.9998 18.6878 18.2625 18.2651 18.5005 17.8316C18.1625 17.7049 15.1827 16.284 15.1643 12.6909C15.1519 9.7099 17.6229 8.14778 17.7546 8.06679C16.4538 6.02748 14.3856 5.86333 13.7539 5.83584C13.7243 5.83444 13.6168 5.82892 13.443 5.82892C12.0555 5.82892 10.4802 6.47339 9.50168 6.47339C8.59978 6.47339 7.13199 5.87104 5.89709 5.87104C5.88123 5.86971 5.14087 5.87104 5.14087 5.87104C4.10226 5.88134 1.29471 6.29934 0.229588 9.04465C0.149462 9.23197 0 9.63863 0 10.22V11.4363C0 11.9908 0.122831 12.4142 0.199643 12.5819C0.285233 12.7719 0.405643 12.8813 0.47621 12.9533C1.12627 13.6948 2.7439 15.5884 2.7439 18.4648C2.7439 21.5252 0.900661 23.292 0.457644 23.7285C0.347511 23.8413 0.224229 24 0.224229 24H2.26282C2.26282 24 2.33547 23.8711 2.44024 23.7686C3.07086 23.1038 4.73773 21.3385 4.73773 18.4648C4.73773 15.831 3.26735 14.1241 2.65072 13.3794C2.56353 13.281 2.49891 13.1939 2.49891 13.1349C2.49891 13.0759 2.58074 12.971 2.67613 12.8317C2.99233 12.3738 3.54865 11.4143 3.54865 10.1297V9.33327C3.54865 8.92107 3.69006 8.5516 3.79214 8.35018C3.83498 8.26573 3.87781 8.20171 3.90746 8.16037C3.11057 8.0314 2.07733 7.83551 1.28853 7.44443C1.1838 7.39621 1.0792 7.34246 0.978144 7.28456C0.830736 7.19869 0.6934 7.10867 0.580395 7.01864C0.548878 6.9922 0.518467 6.96576 0.492593 6.93932C0.444845 6.898 0.398778 6.85667 0.360583 6.81535C1.22256 5.04727 3.19191 4.50652 4.44476 4.50652C4.51475 4.50652 4.57937 4.50721 4.64131 4.5079C5.96939 4.51243 7.03821 5.03544 7.84049 5.48411C8.7065 5.97926 9.2629 6.17167 9.80244 6.17167C10.395 6.17167 11.0257 5.93752 11.6368 5.71195C12.5812 5.36475 13.6260 4.97367 14.7899 4.97367C14.9487 4.97367 15.1176 4.97919 15.2959 4.99038C16.4446 5.05993 18.3571 5.45377 19.4896 7.13719C19.2838 7.2543 18.5439 7.69636 17.8242 8.51962C17.7103 8.1306 17.5572 7.73606 17.3339 7.35291C17.3339 7.35291 17.6081 7.33234 17.9059 7.35291C17.7772 7.36617 17.5227 7.39069 17.5227 7.39069Z"/>
                    </svg>
                    App Store
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-amber-900 hover:bg-amber-950 text-white rounded-full h-14 px-6">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9366 8.90039C17.9366 8.0664 18.0041 7.3164 18.1473 6.6504H9.9873V9.9814H14.4326C14.3091 10.7764 13.8951 11.5054 13.2261 12.0004V13.8814H15.5521C17.0651 12.5334 17.9366 10.8904 17.9366 8.90039Z"/>
                      <path d="M9.98731 17.5825C11.9533 17.5825 13.6063 16.8575 14.9043 15.6075L12.5783 13.7255C11.8623 14.1935 11.0063 14.4815 9.98731 14.4815C7.91831 14.4815 6.17131 13.0775 5.59931 11.1855H3.19531V13.1355C4.40431 15.6925 7.02131 17.5825 9.98731 17.5825Z"/>
                      <path d="M5.59854 11.186C5.48354 10.718 5.42654 10.225 5.42654 9.7189C5.42654 9.21287 5.48954 8.71987 5.59854 8.25287V6.30287H3.1955C2.65754 7.35688 2.35254 8.52488 2.35254 9.7189C2.35254 10.912 2.65754 12.081 3.1955 13.136L5.59854 11.186Z"/>
                      <path d="M9.9873 4.95641C11.1843 4.95641 12.2723 5.33541 13.1373 6.16341L15.2003 4.10641C13.6003 2.60341 11.9063 1.7334 9.9873 1.7334C7.0213 1.7334 4.4043 3.6244 3.1953 6.3024L5.5983 8.2524C6.1713 6.3604 7.9183 4.95641 9.9873 4.95641Z"/>
                    </svg>
                    Google Play
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1622561029875-1f0e947e6407?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="GobiGo App" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
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