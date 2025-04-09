import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  category: string;
  distance?: string;
  rating: number;
  deliveryFee?: number;
  estimatedTime?: string;
  onClick: () => void;
}

export function RestaurantCard({
  id,
  name,
  imageUrl,
  category,
  distance,
  rating,
  deliveryFee,
  estimatedTime,
  onClick
}: RestaurantCardProps) {
  // Helper function to get category emoji
  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case "restaurant":
        return "🍽️";
      case "grocery":
        return "🛒";
      case "pharmacy":
        return "💊";
      case "dessert":
        return "🍰";
      case "coffee":
        return "☕";
      default:
        return "🍴";
    }
  };

  // Helper function to get category name in Mongolian
  const getCategoryName = (category: string) => {
    switch (category.toLowerCase()) {
      case "restaurant":
        return "Ресторан";
      case "grocery":
        return "Хүнсний";
      case "pharmacy":
        return "Эмийн сан";
      case "dessert":
        return "Амттан";
      case "coffee":
        return "Кофе";
      default:
        return "Бусад";
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-md h-full transition-all">
      <div className="relative h-40">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center">
            <div className="text-5xl">{getCategoryEmoji(category)}</div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-amber-500/90 text-white">
            ⭐ {rating.toFixed(1)}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-amber-700 border border-amber-200">
            {getCategoryName(category)} {getCategoryEmoji(category)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{name}</h3>
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-amber-500"
          >
            <Star className="h-5 w-5" />
          </motion.button>
        </div>
        {distance && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1 text-amber-500" />
            <span>{distance}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
            <span>{estimatedTime || "30-40 мин"}</span>
          </div>
          <Button 
            variant="outline" 
            className="text-sm h-8 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            onClick={onClick}
          >
            Үзэх
          </Button>
        </div>
        {deliveryFee !== undefined && (
          <div className="mt-2 text-sm text-gray-500">
            Хүргэлтийн төлбөр: {deliveryFee === 0 ? "Үнэгүй" : `${deliveryFee.toLocaleString()}₮`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}