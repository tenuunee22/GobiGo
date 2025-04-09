import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  description: string;
  rating?: number;
  distance?: string;
  deliveryTime?: string;
  address?: string;
}

interface SearchResultsProps {
  query: string;
  onResultClick: (result: SearchResult) => void;
  onClose: () => void;
}

export function SearchResults({ query, onResultClick, onClose }: SearchResultsProps) {
  // This would typically be a state updated by a real search API
  // For this example, we'll use static results
  const results: SearchResult[] = [
    {
      id: "1",
      name: "Хүслэн Ресторан",
      type: "restaurant",
      imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Монгол үндэсний хоолны газар",
      rating: 4.7,
      distance: "1.2 км",
      deliveryTime: "25-35 мин"
    },
    {
      id: "2",
      name: "Гоё Гоё",
      type: "restaurant",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Солонгос хоолны газар",
      rating: 4.5,
      distance: "0.8 км",
      deliveryTime: "20-30 мин"
    },
    {
      id: "3",
      name: "Цагаан Номин",
      type: "restaurant",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHJlc3RhdXJhbnQlMjBmb29kfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Энэтхэг хоолны газар",
      rating: 4.3,
      distance: "2.5 км",
      deliveryTime: "35-45 мин"
    }
  ];
  
  const filteredResults = query 
    ? results.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      )
    : results;
    
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <div className="p-3 bg-blue-50 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Ресторан, хоол, хаяг хайх..."
            className="pl-8 bg-white"
            value={query}
            onChange={() => {}} // This would be controlled by the parent
          />
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        >
          Хаах
        </Button>
      </div>
      
      <CardContent className="p-0 max-h-[60vh] overflow-auto">
        {filteredResults.length > 0 ? (
          <div className="divide-y">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onResultClick(result)}
              >
                <div className="flex gap-3">
                  <div 
                    className="w-20 h-20 rounded-lg bg-cover bg-center" 
                    style={{ backgroundImage: `url(${result.imageUrl})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{result.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {result.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {result.rating}
                        </span>
                      )}
                      {result.distance && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          {result.distance}
                        </span>
                      )}
                      {result.deliveryTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-green-500" />
                          {result.deliveryTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Хайлтын илэрц олдсонгүй</p>
            <p className="text-sm text-gray-400 mt-1">Өөр түлхүүр үг оруулж үзнэ үү</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}