import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Beef, X } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  type: 'restaurant' | 'product' | 'category';
  imageUrl?: string;
  description?: string;
}

interface SearchResultsProps {
  query: string;
  isVisible: boolean;
  onClose: () => void;
}

export function SearchResults({ query, isVisible, onClose }: SearchResultsProps) {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock function to simulate API search
  useEffect(() => {
    if (!query.trim() || !isVisible) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Simulate API delay
    const timeoutId = setTimeout(() => {
      // Mock data
      const mockData: SearchResult[] = [
        {
          id: '1',
          name: 'Хүслэн Ресторан',
          type: 'restaurant',
          imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          description: 'Монгол үндэсний хоолны газар'
        },
        {
          id: '2',
          name: 'Пицца',
          type: 'product',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          description: 'Пепперони пицца'
        },
        {
          id: '3',
          name: 'Монгол Амтат',
          type: 'restaurant',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          description: 'Үндэсний хоолны газар'
        },
        {
          id: '4',
          name: 'Хамбургер',
          type: 'product',
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          description: 'Тахианы махан бургер'
        },
        {
          id: '5',
          name: 'Хүнсний дэлгүүр',
          type: 'category',
          description: 'Хүнсний барааны дэлгүүрүүд'
        },
      ];

      // Filter by search query
      const filtered = mockData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      );

      // Filter by selected type if any
      const typeFiltered = selectedType 
        ? filtered.filter(item => item.type === selectedType)
        : filtered;

      setResults(typeFiltered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, isVisible, selectedType]);

  // Handle type filter
  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? null : type);
  };

  // Get unique types for filter buttons
  const getUniqueTypes = () => {
    const types = results.map(result => result.type);
    return Array.from(new Set(types));
  };

  // Handle item click
  const handleItemClick = (result: SearchResult) => {
    const path = result.type === 'restaurant' 
      ? `/restaurant/${result.id}` 
      : result.type === 'product'
      ? `/product/${result.id}`
      : `/category/${result.id}`;
    
    setLocation(path);
    onClose();
  };

  // Return empty if not visible
  if (!isVisible) return null;

  // Render type icon based on result type
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Store className="h-4 w-4 mr-1" />;
      case 'product':
        return <Beef className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 top-full mt-1 w-full sm:w-96 bg-white rounded-lg shadow-lg border border-border overflow-hidden"
        >
          {/* Header with filters */}
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Хайлтын үр дүн</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {results.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getUniqueTypes().map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleTypeFilter(type)}
                  >
                    {renderTypeIcon(type)}
                    {type === 'restaurant' ? 'Рестораны' : 
                     type === 'product' ? 'Бүтээгдэхүүн' : 
                     type === 'category' ? 'Ангилал' : type}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Results */}
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-6 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map(result => (
                  <motion.div
                    key={result.id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.025)" }}
                    className="p-3 cursor-pointer"
                    onClick={() => handleItemClick(result)}
                  >
                    <div className="flex items-center gap-3">
                      {result.imageUrl ? (
                        <img 
                          src={result.imageUrl} 
                          alt={result.name} 
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          {result.type === 'restaurant' ? (
                            <Store className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Beef className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{result.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{result.description}</div>
                        <Badge variant="outline" className="mt-1">
                          {result.type === 'restaurant' ? 'Ресторан' : 
                           result.type === 'product' ? 'Хоол' : 'Ангилал'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">"{query}" хайлтад тохирох үр дүн олдсонгүй</p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">Хайлтаа эхлүүлнэ үү</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}