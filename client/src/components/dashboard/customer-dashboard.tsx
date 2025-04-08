import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CategoryCard } from "@/components/customer/category-card";
import { RestaurantCard } from "@/components/customer/restaurant-card";
import { SalesDataVisualization } from "@/components/ui/sales-data-visualization";
import { InteractiveIngredients } from "@/components/ui/interactive-ingredients";
import { RecipeRecommendationCarousel } from "@/components/customer/recipe-recommendation-carousel";
import { OrderTracking } from "@/components/customer/order-tracking";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import {
  Search,
  ArrowRight,
  MapPin,
  Clock,
  Utensils,
  Store,
  Pill,
  CakeSlice,
  Coffee,
  Grid3X3,
  Bookmark,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

export function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([{id: "1"}]); // Example active order
  const [demoStatus, setDemoStatus] = useState<"placed" | "preparing" | "on-the-way" | "delivered">("placed");
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Demo locations for order tracking
  const [driverLocation, setDriverLocation] = useState({ lat: 47.9184, lng: 106.9177 });
  const [destinationLocation] = useState({ lat: 47.9214, lng: 106.9132 });

  // Stagger animation configs
  const staggerDelay = 0.1;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };
  
  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Sample data
  const featuredRestaurants = [
    {
      id: "1",
      name: "Пицца Хаус",
      category: "restaurant",
      rating: 4.8,
      address: "Сүхбаатар дүүрэг, 5-р хороо",
      deliveryTime: "20-30 мин",
      deliveryFee: 1500,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "2",
      name: "Чингис Хотдог",
      category: "restaurant",
      rating: 4.5,
      address: "Баянзүрх дүүрэг, 4-р хороо",
      deliveryTime: "30-40 мин",
      deliveryFee: 2000,
      imageUrl: "https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "3",
      name: "Алтан Говь",
      category: "restaurant",
      rating: 4.7,
      address: "Хан-Уул дүүрэг, 1-р хороо",
      deliveryTime: "25-35 мин",
      deliveryFee: 1000,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    },
    {
      id: "4",
      name: "Эм Жей Кофе",
      category: "coffee",
      rating: 4.9,
      address: "Сүхбаатар дүүрэг, 1-р хороо",
      deliveryTime: "15-25 мин",
      deliveryFee: 1200,
      imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
    },
    {
      id: "5",
      name: "Гүн Амттан",
      category: "dessert",
      rating: 4.6,
      address: "Чингэлтэй дүүрэг, 6-р хороо",
      deliveryTime: "20-30 мин",
      deliveryFee: 1800,
      imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
    },
    {
      id: "6",
      name: "Нарлаг Хүнс",
      category: "grocery",
      rating: 4.4,
      address: "Баянгол дүүрэг, 3-р хороо",
      deliveryTime: "25-40 мин",
      deliveryFee: 1500,
      imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
    }
  ];

  // Demo status change
  useEffect(() => {
    const statuses: ("placed" | "preparing" | "on-the-way" | "delivered")[] = [
      "placed", "preparing", "on-the-way", "delivered"
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setDemoStatus(statuses[currentIndex]);
      
      // Animate driver for "on-the-way" status
      if (statuses[currentIndex] === "on-the-way") {
        const animateDriver = setInterval(() => {
          setDriverLocation(prev => ({
            lat: prev.lat + (destinationLocation.lat - prev.lat) * 0.1,
            lng: prev.lng + (destinationLocation.lng - prev.lng) * 0.1
          }));
        }, 2000);
        
        setTimeout(() => clearInterval(animateDriver), 20000);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [destinationLocation]);

  // Filter restaurants based on search and category
  const searchedRestaurants = featuredRestaurants.filter(restaurant => {
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || restaurant.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20">
      <section 
        ref={heroRef}
        className="relative bg-cover bg-top h-[700px] md:h-[800px] overflow-hidden flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'top'
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
                <span className="ml-2 inline-block">👋</span>
              </span>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
              variants={titleVariants}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                GobiGo
              </span> <span className="inline-block">✨</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              variants={titleVariants}
              transition={{ delay: staggerDelay }}
            >
              Хамгийн шилдэг амтыг хаанаас ч <span className="font-semibold text-amber-300">захиалаарай</span> 
              <span className="ml-2 text-2xl inline-block">🍜</span>
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
      </section>

      <section className="container mx-auto px-4 mt-12">
        {activeOrders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 shadow-md overflow-hidden">
              <h2 className="text-xl font-bold mb-4 flex items-center text-amber-800">
                <Clock className="h-5 w-5 mr-2 text-amber-600" />
                Идэвхтэй захиалга
                <span className="ml-2 inline-block">⏳</span>
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
                      <span className="text-3xl">👋</span>
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
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full transform -translate-y-1/2"></div>
            </Card>
          </motion.div>
        )}

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
                <span className="text-xl">⭐</span>
              </div>
            </h2>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
            <motion.div 
              className="flex gap-4 py-2 overflow-x-auto px-2"
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
            </motion.div>
          </div>
        </motion.div>

        <div className="mb-10 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="flex flex-col items-center bg-amber-50 p-6 rounded-xl border border-amber-200"
              whileHover={{ y: -5 }}
              onClick={() => window.open("https://www.facebook.com/profile.php?id=100074258054037", "_blank")}
            >
              <Button 
                className="bg-blue-600 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center relative overflow-hidden"
              >
                <Facebook className="h-12 w-12" />
              </Button>
              <h3 className="font-bold text-lg">Фэйсбүүк</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Манай фэйсбүүк хуудсаар зочилж, шинэ мэдээллийг хүлээн аваарай
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center bg-pink-50 p-6 rounded-xl border border-pink-200"
              whileHover={{ y: -5 }}
              onClick={() => window.open("https://www.instagram.com/te_nuune", "_blank")}
            >
              <Button 
                className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center"
              >
                <Instagram className="h-12 w-12" />
              </Button>
              <h3 className="font-bold text-lg">Инстаграм</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Инстаграм хуудас дээрх шинэ зургууд, хоолны санаанууд
              </p>
            </motion.div>
            
            <motion.div
              className="flex flex-col items-center bg-blue-50 p-6 rounded-xl border border-blue-200"
              whileHover={{ y: -5 }}
              onClick={() => window.open("https://twitter.com", "_blank")}
            >
              <Button 
                className="bg-sky-500 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center"
              >
                <Twitter className="h-12 w-12" />
              </Button>
              <h3 className="font-bold text-lg">Твиттер</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Манай твиттер хуудсаар дамжуулан шуурхай мэдээлэл аваарай
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mb-12">
          <RecipeRecommendationCarousel />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <InteractiveIngredients />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SalesDataVisualization />
            </motion.div>
          </div>
        </div>

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
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}