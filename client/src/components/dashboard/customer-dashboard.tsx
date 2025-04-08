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
          backgroundImage: 'linear-gradient(rgba(0, 12, 66, 0.7), rgba(0, 0, 40, 0.8)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
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

        {/* Welcome Back Animation */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <Card className="overflow-hidden border-0 shadow-lg relative bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl">
              <CardContent className="p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0 relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="text-2xl md:text-3xl font-bold flex items-center gap-2"
                    >
                      <span className="bg-gradient-to-r from-blue-300 to-purple-300 text-transparent bg-clip-text">
                        {(() => {
                          const hour = new Date().getHours();
                          let greeting = '';
                          if (hour >= 5 && hour < 12) {
                            greeting = 'Өглөөний мэнд';
                          } else if (hour >= 12 && hour < 17) {
                            greeting = 'Өдрийн мэнд';
                          } else if (hour >= 17 && hour < 22) {
                            greeting = 'Оройн мэнд';
                          } else {
                            greeting = 'Шөнийн мэнд';
                          }
                          return user.name ? `${greeting}, ${user.name}!` : `${greeting}!`;
                        })()}
                      </span>
                      <motion.span 
                        className="text-3xl inline-block"
                        animate={{ 
                          rotate: [0, -10, 10, -10, 10, 0],
                          scale: [1, 1.2, 1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        {(() => {
                          const hour = new Date().getHours();
                          if (hour >= 5 && hour < 12) return '🌞';
                          if (hour >= 12 && hour < 17) return '☀️';
                          if (hour >= 17 && hour < 22) return '🌆';
                          return '🌙';
                        })()}
                      </motion.span>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-blue-200 mt-2"
                    >
                      Өнөөдөр юу захиалах вэ?
                    </motion.p>
                    
                    {/* Tiny stars animation */}
                    <motion.div 
                      className="absolute -top-1 left-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <motion.span 
                        className="absolute text-yellow-300 text-xs"
                        animate={{ 
                          y: [0, -10, -5],
                          x: [0, 5, 10],
                          opacity: [0, 1, 0],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                        style={{ top: '2px', left: '50px' }}
                      >
                        ✨
                      </motion.span>
                      <motion.span 
                        className="absolute text-yellow-300 text-xs"
                        animate={{ 
                          y: [0, -15, -5],
                          x: [0, -10, -15],
                          opacity: [0, 1, 0],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 0.3 }}
                        style={{ top: '-5px', left: '120px' }}
                      >
                        ✨
                      </motion.span>
                      <motion.span 
                        className="absolute text-yellow-300 text-xs"
                        animate={{ 
                          y: [0, -8, -12],
                          x: [0, 15, 20],
                          opacity: [0, 1, 0],
                          scale: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", delay: 0.7 }}
                        style={{ top: '10px', left: '200px' }}
                      >
                        ✨
                      </motion.span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      variant="secondary" 
                      className="bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg border-0"
                      onClick={() => setLocation('/orders')}
                    >
                      Миний захиалгууд
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-600/20 rounded-full blur-xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-purple-500/10 rounded-full blur-lg transform -translate-y-1/2"></div>
              
              {/* Floating particles */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/30"
                    style={{
                      width: Math.random() * 6 + 3 + 'px',
                      height: Math.random() * 6 + 3 + 'px',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                    }}
                    animate={{
                      y: [0, -(20 + Math.random() * 30)],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
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

      {/* Social Media Footer */}
      <section className="bg-gradient-to-r from-gray-800 to-blue-900 py-16 mt-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 text-transparent bg-clip-text">
                Бидэнтэй холбогдоорой
                <span className="ml-2 text-2xl animate-pulse inline-block">🌟</span>
              </h2>
              <p className="text-blue-200 text-lg mb-6">
                Шинэ мэдээ, урамшуулал, онцлох зүйлсийг цаг алдалгүй мэдэж байхыг хүсвэл бидний сошиал хуудсуудыг дагаарай!
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <motion.a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
                
                <motion.a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-800 to-indigo-900 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-200">Хурдан хүргэлт</h3>
                  <p className="text-blue-300 text-sm">Таны захиалгыг хамгийн хурдан хугацаанд хүргэх болно</p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-800 to-purple-900 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3">🥘</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-200">Шилдэг амт</h3>
                  <p className="text-blue-300 text-sm">Хамгийн чанартай, амттай хоол хүнсийг танд хүргэнэ</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-800 to-pink-900 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3">🛍️</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-200">Олон сонголт</h3>
                  <p className="text-blue-300 text-sm">Таны хүссэн бүх зүйлийг нэг дороос захиалаарай</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3">💯</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-200">Баталгаат үйлчилгээ</h3>
                  <p className="text-blue-300 text-sm">Таны сэтгэл ханамжийг бид эн тэргүүнд тавина</p>
                </div>
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