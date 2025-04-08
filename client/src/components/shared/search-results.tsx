import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Search, MapPin, Store, Pizza, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Хайлтын үр дүнгийн төрөл
interface SearchResult {
  id: string;
  type: "restaurant" | "food" | "store" | "category";
  name: string;
  image?: string;
  category?: string;
  location?: string;
  rating?: number;
  distance?: string;
  price?: number;
}

interface SearchResultsProps {
  query: string;
  isVisible: boolean;
  onClose: () => void;
}

export function SearchResults({ query, isVisible, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([
    "Рестораны", "Хүнсний", "Эм", "Хоол", "Хүргэлт"
  ]);

  // Хайлтын үр дүн дуурайх
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    // Хайлтын үйлдэл дуурайх
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Dummy data
      const dummyResults: SearchResult[] = [
        {
          id: "r1",
          type: "restaurant",
          name: "Мон Пицца",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=250&auto=format&fit=crop",
          category: "Пицца",
          location: "Баянзүрх дүүрэг",
          rating: 4.5,
          distance: "2.3 км"
        },
        {
          id: "r2",
          type: "restaurant",
          name: "Кимчи Ресторан",
          image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=250&auto=format&fit=crop",
          category: "Солонгос",
          location: "Сүхбаатар дүүрэг",
          rating: 4.7,
          distance: "1.8 км"
        },
        {
          id: "f1",
          type: "food",
          name: "Кимчи хуурга",
          image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=250&auto=format&fit=crop",
          category: "Солонгос хоол",
          price: 15000
        },
        {
          id: "f2",
          type: "food",
          name: "Пеперони пицца",
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=250&auto=format&fit=crop",
          category: "Пицца",
          price: 22000
        },
        {
          id: "s1",
          type: "store",
          name: "Гоё Дэлгүүр",
          category: "Хүнсний",
          location: "Хан-Уул дүүрэг",
          distance: "3.1 км"
        }
      ];

      // Хайлтын үр дүнг шүүж, өгөгдсөн query-тэй тохирох бүх үр дүнг буцаана
      const filtered = dummyResults.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase()) || 
        (result.category && result.category.toLowerCase().includes(query.toLowerCase()))
      );
      
      setResults(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-xl border z-50 max-h-[80vh] overflow-auto"
      >
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <p className="text-sm font-medium">
            {query && query.length >= 2 ? (
              <span>
                <span className="text-primary">{results.length}</span> хайлтын үр дүн:
                <span className="font-semibold ml-1">"{query}"</span>
              </span>
            ) : (
              <span>Санал болгох категориуд</span>
            )}
          </p>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2 text-sm text-gray-500">Хайж байна...</p>
          </div>
        ) : (
          <div className="p-3">
            {query && query.length >= 2 ? (
              // Хайлтын үр дүн харуулах
              results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((result) => (
                    <SearchResultItem key={result.id} result={result} onClose={onClose} />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">"{query}" гэх хайлтаар үр дүн олдсонгүй</p>
                  <p className="text-sm text-gray-400 mt-1">Өөр түлхүүр үг ашиглан дахин хайна уу</p>
                </div>
              )
            ) : (
              // Категори санал болгох
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {categories.map((category, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="text-sm h-auto py-2 px-3 justify-start"
                    onClick={() => {
                      // Санал болгосон категори дээр дарахад
                      console.log(`Selected category: ${category}`);
                      onClose();
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function SearchResultItem({ result, onClose }: { result: SearchResult; onClose: () => void }) {
  // Үр дүнгийн төрлөөс хамаарсан линк үүсгэх
  const getLink = () => {
    switch (result.type) {
      case "restaurant":
        return `/restaurant/${result.id}`;
      case "food":
        return `/food/${result.id}`;
      case "store":
        return `/store/${result.id}`;
      case "category":
        return `/category/${result.id}`;
      default:
        return `/`;
    }
  };

  // Үр дүнгийн төрлөөс хамаарсан Icon үүсгэх
  const getIcon = () => {
    switch (result.type) {
      case "restaurant":
        return <Store className="h-4 w-4 text-primary" />;
      case "food":
        return <Pizza className="h-4 w-4 text-orange-500" />;
      case "store":
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Link href={getLink()}>
      <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClose}>
        <CardContent className="p-3 flex gap-3">
          {result.image ? (
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {getIcon() || <Store className="h-6 w-6 text-gray-400" />}
            </div>
          )}
          
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium line-clamp-1">{result.name}</p>
                
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {result.category && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                      {getIcon()}
                      <span className="ml-1">{result.category}</span>
                    </Badge>
                  )}
                  
                  {result.rating && (
                    <span className="text-xs text-yellow-500 flex items-center">
                      ★ {result.rating}
                    </span>
                  )}
                </div>
              </div>
              
              {result.price && (
                <span className="text-sm font-medium text-gray-700">{result.price.toLocaleString()}₮</span>
              )}
            </div>
            
            {result.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span>{result.location}</span>
                {result.distance && (
                  <span className="flex items-center">
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-300 mx-1"></span>
                    {result.distance}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}