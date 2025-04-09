import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

export function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="pb-20">
      <section 
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Бүгд ✨</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Utensils className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Ресторан 🍽️</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Store className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Хүнсний 🛒</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Pill className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Эмийн сан 💊</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <CakeSlice className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Амттан 🍰</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md cursor-pointer transition-all">
              <div className="bg-amber-50 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Coffee className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Кофе ☕</h3>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 mt-20">
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
              Бидэнтэй холбогдох
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="flex flex-col items-center bg-amber-50 p-6 rounded-xl border border-amber-200"
              whileHover={{ y: -5 }}
              onClick={() => window.open("https://www.facebook.com/profile.php?id=100074258054037", "_blank")}
            >
              <div
                className="bg-blue-600 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center relative overflow-hidden"
              >
                <Facebook className="h-12 w-12" />
              </div>
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
              <div
                className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center"
              >
                <Instagram className="h-12 w-12" />
              </div>
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
              <div
                className="bg-sky-500 text-white w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center"
              >
                <Twitter className="h-12 w-12" />
              </div>
              <h3 className="font-bold text-lg">Твиттер</h3>
              <p className="text-gray-500 text-sm text-center mt-1">
                Манай твиттер хуудсаар дамжуулан шуурхай мэдээлэл аваарай
              </p>
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
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                Онцлох газрууд
              </span>
              <span className="ml-2 text-xl">⭐</span>
            </h2>
            <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              Бүгдийг харах
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden border border-gray-200 shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-151310452974${item}-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80`} 
                    alt="Restaurant" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500/90 text-white">
                      ⭐ 4.8
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">Ресторан {item}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                    <span className="truncate">Сүхбаатар дүүрэг, {item}-р хороо</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      <span>30-40 мин</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-sm h-8 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                      onClick={() => setLocation(`/restaurant/${item}`)}
                    >
                      Үзэх
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}