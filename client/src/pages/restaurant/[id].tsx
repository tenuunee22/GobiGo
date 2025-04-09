import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessProducts } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MapPin, Clock, Star, Search, Camera, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PlaceOrder } from "@/components/customer/place-order";
import { ReviewForm } from "@/components/restaurant/review-form";
import { MapView } from "@/components/shared/map-view";
import { useLocation } from "wouter";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // For demo purposes, create a mock restaurant
        // In a real app, this would come from an API call
        const mockRestaurant = {
          id: id,
          name: "Улаанбаатар Хинкали",
          category: "Солонгос",
          subCategory: "BBQ, Хинкали",
          rating: 4.8,
          ratingCount: 120,
          deliveryTime: "30-40",
          deliveryFee: 3000,
          minOrderAmount: 10000,
          distance: "1.3 км",
          address: "Сөүлийн гудамж 43, Улаанбаатар",
          businessHours: "10:00 - 22:00",
          coverImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop&w=1980&q=80",
          logoImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
          location: {
            lat: 47.9184676,
            lng: 106.917693,
            address: "Сөүлийн гудамж 43, Улаанбаатар"
          }
        };
        
        setRestaurant(mockRestaurant);
        
        // Fetch products for this restaurant
        const fetchedProducts = await getBusinessProducts(id);
        
        // If no products found, use mock data for demonstration
        const mockProducts = [
          {
            id: "p1",
            name: "Хинкали (10 ширхэг)",
            description: "Уламжлалт гүржийн Хинкали, махан чанартай",
            price: 13900,
            category: "main-dish",
            imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p2",
            name: "Хятад Хинкали (10 ширхэг)",
            description: "Хятад загварын манжуу, ногоотой",
            price: 11900,
            category: "main-dish",
            imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p3",
            name: "Шарсан хинкали (8 ширхэг)",
            description: "Шарсан хинкали, өөхтэй, махтай",
            price: 14900,
            category: "main-dish",
            imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p4",
            name: "Өглөөний хоол",
            description: "Өндөг, зайдас, талх, цай",
            price: 9900,
            category: "appetizer",
            imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p5",
            name: "Жигнэмэг",
            description: "Орос загварын жигнэмэг",
            price: 7500,
            category: "dessert",
            imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p6",
            name: "Хар цай",
            description: "Дулаан хар цай",
            price: 3500,
            category: "drink",
            imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          },
          {
            id: "p7",
            name: "Комбо #1",
            description: "10 хинкали, салат, 2 уух зүйл",
            price: 25900,
            category: "combo",
            imageUrl: "https://images.unsplash.com/photo-1585511545384-479f730f0548?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            available: true
          }
        ];
        
        // Use fetched products if available, otherwise use mock data
        const products = fetchedProducts.length > 0 ? fetchedProducts : mockProducts;
        setProducts(products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast({
          title: "Өгөгдөл ачааллахад алдаа гарлаа",
          description: "Дахин оролдоно уу",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);
  
  const getCategoryName = (categoryId: string) => {
    const categoryMap: {[key: string]: string} = {
      "main-dish": "Үндсэн хоол",
      "appetizer": "Салад, зууш",
      "dessert": "Амттан",
      "drink": "Уух зүйл",
      "combo": "Комбо"
    };
    
    return categoryMap[categoryId] || categoryId;
  };
  
  const handleAddItem = (item: any) => {
    // Get existing cart items from localStorage
    let cartItems = [];
    try {
      const savedCart = localStorage.getItem('cartItems');
      cartItems = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart items from localStorage", error);
    }
    
    // Check if item is already in the cart
    const existingItemIndex = cartItems.findIndex((i: any) => i.id === item.id);
    
    // Also update the local component state for the current page view
    const existingLocalItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if already in cart
      cartItems[existingItemIndex].quantity += 1;
      
      // Update local state too
      if (existingLocalItemIndex >= 0) {
        const newItems = [...selectedItems];
        newItems[existingLocalItemIndex].quantity += 1;
        setSelectedItems(newItems);
      }
    } else {
      // Add new item with quantity 1
      const newItem = { ...item, quantity: 1 };
      cartItems.push(newItem);
      
      // Update local state too
      setSelectedItems([...selectedItems, newItem]);
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    toast({
      title: "Нэмэгдлээ",
      description: `${item.name} сагсанд нэмэгдлээ`,
      action: (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setLocation("/cart")}
        >
          Сагс руу очих
        </Button>
      ),
    });
  };
  
  const handleRemoveItem = (itemId: string) => {
    const existingItemIndex = selectedItems.findIndex(i => i.id === itemId);
    
    if (existingItemIndex >= 0) {
      const newItems = [...selectedItems];
      if (newItems[existingItemIndex].quantity > 1) {
        // Decrement quantity
        newItems[existingItemIndex].quantity -= 1;
        setSelectedItems(newItems);
      } else {
        // Remove item completely
        setSelectedItems(newItems.filter(i => i.id !== itemId));
      }
    }
  };
  
  const calculateTotals = () => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    const deliveryFee = restaurant?.deliveryFee || 0;
    const total = subtotal + deliveryFee;
    
    return { subtotal, deliveryFee, total };
  };
  
  const { subtotal, deliveryFee, total } = calculateTotals();
  
  // Filter products by search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  });
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Нэвтрэх шаардлагатай",
        description: "Захиалга өгөхийн тулд эхлээд нэвтэрнэ үү",
        variant: "destructive"
      });
      // Redirect to login page after showing toast
      setTimeout(() => {
        setLocation("/login");
      }, 1500);
      return;
    }
    
    if (selectedItems.length === 0) {
      toast({
        title: "Хоосон сагс",
        description: "Дор хаяж нэг бүтээгдэхүүн сонгоно уу",
        variant: "destructive"
      });
      return;
    }
    
    // Save the selected items to localStorage for the cart
    let cartItems = [];
    try {
      const savedCart = localStorage.getItem('cartItems');
      cartItems = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart items from localStorage", error);
    }
    
    // Update the cart with selected items, keeping track of quantities
    selectedItems.forEach(item => {
      const existingItemIndex = cartItems.findIndex((i: any) => i.id === item.id);
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity = item.quantity;
      } else {
        cartItems.push(item);
      }
    });
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Ask the user if they want to continue shopping or go to cart
    toast({
      title: "Бүтээгдэхүүн нэмэгдлээ",
      description: "Сагсанд нэмэгдлээ. Төлбөр төлөх үү?",
      action: (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => setLocation("/cart")}
        >
          Тийм, төлбөр төлөх
        </Button>
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Ресторан олдсонгүй</h1>
        <p className="mb-4">Хүссэн ресторан олдсонгүй эсвэл одоогоор боломжгүй байна.</p>
        <Button onClick={() => setLocation("/")}>Буцах</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Restaurant header */}
      <div 
        className="h-48 md:h-64 bg-center bg-cover relative overflow-hidden"
        style={{ backgroundImage: `url(${restaurant.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 slide-in-top"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 slide-in-left" style={{ animationDelay: "0.2s" }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 hover:bg-white hover:scale-105 transition-transform"
              onClick={() => setLocation("/")}
            >
              <ChevronLeft className="mr-1 h-4 w-4 wiggle" />
              Буцах
            </Button>
          </div>
          <div className="absolute bottom-4 right-4 text-white bg-gradient-to-r from-blue-600/70 to-indigo-600/70 px-3 py-1 rounded-full text-sm font-medium slide-in-right" style={{ animationDelay: "0.3s" }}>
            <span className="flex items-center">
              <span className="mr-1 pulse">✨</span> {restaurant.category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto -mt-16 relative z-10 px-4">
        {/* Restaurant info card */}
        <Card className="mb-6 shadow-lg border-0 slide-in-bottom" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-start">
              <div 
                className="w-20 h-20 bg-center bg-cover rounded-md mr-4 flex-shrink-0 border-2 border-blue-100 shadow-sm bounce-soft overflow-hidden"
                style={{ backgroundImage: `url(${restaurant.logoImage})` }}
              >
                <div className="w-full h-full hover:scale-110 transition-transform duration-700"></div>
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div className="fade-in" style={{ animationDelay: "0.3s" }}>
                    <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{restaurant.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <span>{restaurant.category}</span>
                      {restaurant.subCategory && (
                        <>
                          <span className="text-blue-300">•</span>
                          <span className="fade-in-delayed">{restaurant.subCategory}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-full bounce-soft">
                    <Star className="h-4 w-4 text-yellow-500 fill-current pulse" />
                    <span className="font-medium text-yellow-700">{restaurant.rating}</span>
                    <span className="text-sm text-yellow-500">({restaurant.ratingCount})</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500 wiggle" />
                    <span>{restaurant.deliveryTime} мин</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500 font-bold">₮</span>
                    <span>Хүргэлт {restaurant.deliveryFee.toLocaleString()}₮ <span className="wiggle inline-block">🚚</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-500 jelly" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600 fade-in" style={{ animationDelay: "0.5s" }}>
                  <p className="flex items-center gap-1">
                    <span className="text-gray-800">📍</span> {restaurant.address}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-gray-800">🕒</span> Ажиллах цаг: {restaurant.businessHours}
                  </p>
                  <div className="mt-2 flex gap-3">
                    <ReviewForm businessId={id} />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-200 transition-all"
                      onClick={() => {
                        toast({
                          title: "Зураг солих",
                          description: "Зураг солих функц удахгүй нэмэгдэнэ"
                        });
                      }}
                    >
                      <Camera className="h-4 w-4 text-blue-500" />
                      <span>Зураг солих</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Restaurant location map */}
        <div className="mb-6">
          <MapView 
            location={restaurant.location} 
            businessName={restaurant.name}
          />
        </div>
        
        {/* Search and menu */}
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Left column - Menu */}
          <div className="flex-grow">
            <div className="mb-4 relative">
              <Input
                type="text"
                placeholder="Хоол хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            <Tabs defaultValue={categories[0] || "main-dish"}>
              <TabsList className="mb-4 flex overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="whitespace-nowrap"
                  >
                    {getCategoryName(category)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <h2 className="text-lg font-semibold mb-2">{getCategoryName(category)}</h2>
                  
                  {filteredProducts
                    .filter(product => product.category === category)
                    .map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all hover:border-blue-200 slide-in-right" style={{ animationDelay: `${0.1 * (filteredProducts.findIndex(p => p.id === product.id) % 5)}s` }}>
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className="flex-grow p-4">
                              <h3 className="font-medium mb-1 text-indigo-900 flex items-center">
                                {product.name}
                                {product.name.toLowerCase().includes('комбо') && (
                                  <span className="ml-2 tada inline-block text-sm">🔥</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{product.price.toLocaleString()}₮</span>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAddItem(product)}
                                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all hover:scale-105"
                                >
                                  <span className="flex items-center">
                                    <span className="mr-1 wiggle inline-block text-xs">🛒</span> Нэмэх
                                  </span>
                                </Button>
                              </div>
                            </div>
                            
                            {product.imageUrl && (
                              <div className="relative overflow-hidden w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                <div 
                                  className="w-full h-full bg-center bg-cover absolute inset-0 hover:scale-110 transition-all duration-700"
                                  style={{ backgroundImage: `url(${product.imageUrl})` }}
                                ></div>
                                {product.price < 10000 && (
                                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-bl rotate-12 transform jelly">
                                    Хямд
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Right column - Order summary */}
          <div className="md:w-80">
            <Card className="sticky top-4 shadow-lg border-0 hover:shadow-xl transition-all fade-in" style={{ animationDelay: "0.6s" }}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent flex items-center">
                  <span className="mr-2 tada inline-block">🛍️</span> Таны захиалга
                </h2>
                
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-3 bounce-soft">
                      <span className="text-4xl">🛒</span>
                    </div>
                    <p className="font-medium">Таны сагс хоосон байна</p>
                    <p className="text-sm mt-1">Зүүн талаас бүтээгдэхүүн сонгоно уу</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {selectedItems.map((item, index) => (
                        <div key={item.id} className="flex justify-between items-center p-2 hover:bg-blue-50 rounded-lg transition-all slide-in-right" style={{ animationDelay: `${0.1 * index}s` }}>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">{item.quantity}</span>
                              <span className="text-indigo-900">{item.name}</span>
                            </div>
                            <div className="text-sm text-blue-600 mt-1 font-medium">
                              {item.price.toLocaleString()}₮
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full hover:bg-red-50 hover:border-red-200 transition-all"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              -
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full hover:bg-green-50 hover:border-green-200 transition-all"
                              onClick={() => handleAddItem(item)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2 mb-4 fade-in-delayed">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Дүн</span>
                        <span>{subtotal.toLocaleString()}₮</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Хүргэлтийн төлбөр</span>
                        <span className="flex items-center">
                          {deliveryFee.toLocaleString()}₮ 
                          <span className="ml-1 wiggle inline-block text-xs">🚚</span>
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold mt-3 pt-2 border-t">
                        <span>Нийт дүн</span>
                        <span className="text-lg bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{total.toLocaleString()}₮</span>
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  className={`w-full transition-all duration-300 ${selectedItems.length === 0 ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-md hover:scale-105'}`}
                  disabled={selectedItems.length === 0}
                  onClick={handleCheckout}
                >
                  <span className="flex items-center">
                    <span className={`mr-2 ${selectedItems.length > 0 ? 'wiggle' : ''} inline-block`}>
                      {selectedItems.length > 0 ? '🚀' : '⚠️'}
                    </span> 
                    {selectedItems.length > 0 ? 'Захиалах' : 'Хоосон сагс'}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Order placement dialog */}
      <PlaceOrder
        businessId={id || ""}
        businessName={restaurant.name}
        selectedItems={selectedItems}
        onClose={() => setShowOrderForm(false)}
        open={showOrderForm}
      />
    </div>
  );
}