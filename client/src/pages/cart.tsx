import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, ShoppingBag, CreditCard, ShoppingCart, Package, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-6"
          >
            <div className="w-28 h-28 mx-auto relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                <ShoppingCart className="h-24 w-24 mx-auto text-primary/20" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
              >
                0
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent"
          >
            Таны сагс хоосон байна
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8"
          >
            Хоолны газар эсвэл дэлгүүрээс дуртай хоол болон бүтээгдэхүүнээ сонгож, сагсандаа нэмнэ үү.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/">
                <Package className="mr-2 h-5 w-5" /> 
                Хоол захиалах
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
          </Button>
        </Link>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart items */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                </div>
                <div>
                  <CardTitle>Миний сагс</CardTitle>
                  <CardDescription>
                    {cartItems.length} төрлийн бүтээгдэхүүн
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Сагс цэвэрлэх
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden shadow-sm">
                      {item.imageUrl ? (
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
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
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                      </motion.div>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-14 text-center"
                        min="1"
                      />
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </motion.div>
                    </div>
                    <div className="text-right min-w-[100px] font-medium">
                      {(item.price * item.quantity).toLocaleString()}₮
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-500 hover:text-red-500 hover:bg-red-50 h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Order summary */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-primary" />
                Захиалгын нийлбэр
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Бүтээгдэхүүний дүн</span>
                  <span>{getSubtotal().toLocaleString()}₮</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Хүргэлтийн хураамж</span>
                  <span>
                    {getDeliveryFee() > 0 ? (
                      getDeliveryFee().toLocaleString() + '₮'
                    ) : (
                      <span className="text-green-500 font-medium">Үнэгүй</span>
                    )}
                  </span>
                </div>
                <Separator />
                <motion.div 
                  className="flex justify-between font-bold"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                >
                  <span>Нийт дүн</span>
                  <span className="text-lg text-primary">{getTotalPrice().toLocaleString()}₮</span>
                </motion.div>
                
                {getSubtotal() < 50000 && (
                  <motion.div 
                    className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p>50,000₮-с дээш захиалгад хүргэлт үнэгүй</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (getSubtotal() / 50000) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-right">Үнэгүй хүргэлтэд: {(50000 - getSubtotal()).toLocaleString()}₮</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}