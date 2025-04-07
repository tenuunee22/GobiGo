import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, Link } from "wouter";
import { LoaderCircle, ArrowLeft, Plus, Minus, ShoppingBag, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceOrder } from "@/components/customer/place-order";

interface Product {
  id: number;
  businessUid: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  available: boolean;
}

interface Business {
  id: string;
  businessName: string;
  address: string;
  description: string;
  businessType: string;
  cuisine?: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  imageUrl: string;
  deliveryFee: number;
  estimatedTime: string;
  contactPhone?: string;
  categories: string[];
}

export default function RestaurantDetail() {
  const [, params] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<{id: string; name: string; price: number; quantity: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessId = params.id;

  useEffect(() => {
    if (!businessId) return;

    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, these would be actual API calls
        // For demonstration purposes, create mock data
        const mockBusiness: Business = {
          id: businessId,
          businessName: "Амарал Ресторан",
          address: "Сүхбаатар дүүрэг, Прайм Центр, 1-р давхар",
          description: "Монгол хоол болон Европ хоолны өргөн сонголттой ресторан",
          businessType: "Ресторан",
          cuisine: "Монгол, Европ",
          rating: 4.7,
          reviewCount: 253,
          openingHours: "10:00 - 22:00",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
          deliveryFee: 3000,
          estimatedTime: "30-40 мин",
          contactPhone: "9944-3322",
          categories: ["Онцлох", "Үндсэн хоол", "Зууш", "Салад", "Ундаа"]
        };
        
        const mockProducts: Product[] = [
          {
            id: 1,
            businessUid: businessId,
            name: "Хуурсан хуушуур",
            description: "8ш хуушуур, сонгосон амтлагч",
            price: 12000,
            imageUrl: "https://images.unsplash.com/photo-1626509653291-18d9dc692d57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Үндсэн хоол",
            available: true
          },
          {
            id: 2,
            businessUid: businessId,
            name: "Буузны хуушуур",
            description: "10ш буузны хуушуур, сонгосон амтлагч",
            price: 13900,
            imageUrl: "https://images.unsplash.com/photo-1626509652814-4c86c73016c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Үндсэн хоол",
            available: true
          },
          {
            id: 3,
            businessUid: businessId,
            name: "Өндөгтэй будаа",
            description: "Нэг өндөгтэй, ногоотой хуурсан будаа",
            price: 8900,
            imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Үндсэн хоол",
            available: true
          },
          {
            id: 4,
            businessUid: businessId,
            name: "Цуйван",
            description: "Үхрийн мах, хуурсан гоймон, ногоо",
            price: 12500,
            imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Үндсэн хоол",
            available: true
          },
          {
            id: 5,
            businessUid: businessId,
            name: "Алтан гадас салад",
            description: "Шинэ ногоо, гүнжидийн зөөхий, боловсруулсан үхрийн мах",
            price: 9800,
            imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Салад",
            available: true
          },
          {
            id: 6,
            businessUid: businessId,
            name: "Айраг",
            description: "Сэтгэл сэргээх уламжлалт ундаа",
            price: 5000,
            imageUrl: "https://images.unsplash.com/photo-1571091655789-405127f7894f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Ундаа",
            available: true
          },
          {
            id: 7,
            businessUid: businessId,
            name: "Бууз",
            description: "5ш бууз, сонгосон амтлагч",
            price: 7500,
            imageUrl: "https://images.unsplash.com/photo-1625398407796-82770efaf0c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Онцлох",
            available: true
          },
          {
            id: 8,
            businessUid: businessId,
            name: "Боорцог",
            description: "Монгол уламжлалт зууш, 10ш",
            price: 4500,
            imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Зууш",
            available: true
          },
          {
            id: 9,
            businessUid: businessId,
            name: "Кола",
            description: "0.5л Кока-Кола",
            price: 2500,
            imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Ундаа",
            available: true
          },
          {
            id: 10,
            businessUid: businessId,
            name: "Шар тос",
            description: "50г шар тос",
            price: 3000,
            imageUrl: "https://images.unsplash.com/photo-1589985270958-bf087acb0612?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Зууш",
            available: true
          }
        ];
        
        // Add some items to the "Oncloh" (featured) category
        const featured = mockProducts.filter(p => ["Хуурсан хуушуур", "Бууз", "Цуйван"].includes(p.name));
        featured.forEach(p => {
          const featuredProduct = {...p, category: "Онцлох"};
          if (!mockProducts.some(prod => prod.id === p.id && prod.category === "Онцлох")) {
            mockProducts.push(featuredProduct);
          }
        });
        
        setBusiness(mockBusiness);
        setProducts(mockProducts);
        
        // Set default active category
        if (mockBusiness.categories.length > 0) {
          setActiveCategory(mockBusiness.categories[0]);
        }
      } catch (error: any) {
        console.error("Error fetching business data:", error);
        setError(error.message || "Ресторан мэдээлэл авахад алдаа гарлаа");
        toast({
          title: "Алдаа гарлаа",
          description: error.message || "Ресторан мэдээлэл авахад алдаа гарлаа",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId, toast]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id.toString());
      
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id.toString() 
            ? {...item, quantity: item.quantity + 1} 
            : item
        );
      } else {
        return [...prev, {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }
    });
    
    toast({
      title: "Сагсанд нэмлээ",
      description: `${product.name} нэмэгдлээ`,
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.id === productId 
            ? {...item, quantity: item.quantity - 1} 
            : item
        );
      } else {
        return prev.filter(item => item.id !== productId);
      }
    });
  };
  
  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = () => {
    if (!user) {
      toast({
        title: "Нэвтрээгүй байна",
        description: "Захиалга хийхийн тулд нэвтэрнэ үү",
        variant: "destructive"
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Сагс хоосон байна",
        description: "Захиалга өгөхийн тулд бүтээгдэхүүн сонгоно уу",
        variant: "destructive"
      });
      return;
    }
    
    setOrderModalOpen(true);
  };

  // Filter products by active category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch && product.available;
  });

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = business?.deliveryFee || 0;
  const orderTotal = cartTotal + deliveryFee;

  if (loading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Ресторан мэдээлэл ачааллаж байна...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="container py-10">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-xl font-bold">Ресторан олдсонгүй</h2>
            </div>
            <p className="text-gray-600">{error || "Ресторан мэдээлэл олдсонгүй"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>
              Дахин оролдох
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-4">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
          </Button>
        </Link>
      </div>
      
      {/* Restaurant header */}
      <div className="relative rounded-xl overflow-hidden h-64 mb-6">
        <img 
          src={business.imageUrl} 
          alt={business.businessName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{business.businessName}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{business.rating}</span>
              <span className="text-gray-300">({business.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{business.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{business.address}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {business.cuisine && (
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                {business.cuisine}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
              {business.businessType}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu section */}
        <div className="lg:col-span-2">
          {/* Search and category filter */}
          <div className="mb-6">
            <Input
              placeholder="Хоолны нэр, орц хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            
            <Tabs 
              defaultValue={activeCategory} 
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="w-full h-auto flex overflow-x-auto pb-px mb-4">
                <TabsTrigger value="all" className="flex-shrink-0">
                  Бүгд
                </TabsTrigger>
                {business.categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-shrink-0">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={`${product.id}-${product.category}`} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      inCart={cart.some(item => item.id === product.id.toString())}
                    />
                  ))}
                </div>
              </TabsContent>
              
              {business.categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={`${product.id}-${product.category}`} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        inCart={cart.some(item => item.id === product.id.toString())}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        
        {/* Cart section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Таны сагс</h3>
                {cart.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearCart}
                  >
                    Цэвэрлэх
                  </Button>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Таны сагс хоосон байна</p>
                  <p className="text-gray-400 text-sm mt-1">Хоол сонгож сагсандаа нэмнэ үү</p>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => {
                                  const product = products.find(p => p.id.toString() === item.id);
                                  if (product) handleAddToCart(product);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="flex-1 truncate">{item.name}</span>
                          </div>
                        </div>
                        <span className="font-medium text-right">
                          {item.price * item.quantity}₮
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Дүн</span>
                      <span>{cartTotal}₮</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Хүргэлтийн хураамж</span>
                      <span>{deliveryFee}₮</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                      <span>Нийт дүн</span>
                      <span>{orderTotal}₮</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handlePlaceOrder}
                  >
                    Захиалах
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Order modal */}
      {business && (
        <PlaceOrder
          businessId={business.id}
          businessName={business.businessName}
          selectedItems={cart}
          open={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
        />
      )}
    </div>
  );
}

// Product card component
function ProductCard({ 
  product, 
  onAddToCart,
  inCart
}: { 
  product: Product; 
  onAddToCart: (product: Product) => void;
  inCart: boolean;
}) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Зураггүй</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium">{product.price}₮</span>
          <Button 
            size="sm" 
            variant={inCart ? "outline" : "default"}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? "Нэмэх" : "Сагсанд нэмэх"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}