import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart items from localStorage", error);
      }
    }
  }, []);
  
  // Update cart item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    toast({
      title: "Бүтээгдэхүүн хасагдлаа",
      description: "Сагснаас бүтээгдэхүүн амжилттай хасагдлаа",
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    
    toast({
      title: "Сагс цэвэрлэгдлээ",
      description: "Таны сагсанд байсан бүх бүтээгдэхүүн хасагдлаа",
    });
  };
  
  // Calculate subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calculate delivery fee
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    // Free delivery for orders over 50,000₮
    if (subtotal >= 50000) return 0;
    // Base delivery fee
    return 2490;
  };
  
  // Calculate total price
  const getTotalPrice = () => {
    return getSubtotal() + getDeliveryFee();
  };
  
  // Handle checkout - Direct to Stripe static checkout
  const handleCheckout = () => {
    setLoading(true);
    
    // Create mock order object for demonstration
    const order = {
      id: Date.now().toString(),
      items: cartItems,
      totalAmount: getTotalPrice(),
      deliveryFee: getDeliveryFee(),
      subtotal: getSubtotal(),
      date: new Date(),
    };
    
    // Store order in localStorage for demo purposes
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    try {
      // Redirect to static Stripe test checkout URL (already setup in server/routes.ts)
      window.location.href = "https://buy.stripe.com/test_8wM15p4kW8886cw000";
    } catch (error) {
      console.error("Error redirecting to Stripe checkout:", error);
      setLoading(false);
      
      toast({
        title: "Алдаа гарлаа",
        description: "Төлбөр хийх хуудас руу шилжих үед алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Таны сагс хоосон байна</h1>
          <p className="text-gray-600 mb-6">Сагсанд бүтээгдэхүүн нэмж, захиалга өгнө үү.</p>
          <Button asChild>
            <Link href="/">Хоол захиалах</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Миний сагс</CardTitle>
                <CardDescription>
                  {cartItems.length} төрлийн бүтээгдэхүүн
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-500"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Сагс цэвэрлэх
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.price.toLocaleString()}₮</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-14 text-center"
                        min="1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right min-w-[100px] font-medium">
                      {(item.price * item.quantity).toLocaleString()}₮
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-red-500 h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Захиалгын нийлбэр</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Дүн</span>
                  <span>{getSubtotal().toLocaleString()}₮</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Хүргэлтийн хураамж</span>
                  <span>{getDeliveryFee() > 0 ? getDeliveryFee().toLocaleString() + '₮' : 'Үнэгүй'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Нийт дүн</span>
                  <span>{getTotalPrice().toLocaleString()}₮</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Боловсруулж байна...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Төлбөр төлөх ({getTotalPrice().toLocaleString()}₮)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}