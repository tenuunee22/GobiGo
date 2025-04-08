import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/cart-context";
import { ArrowLeft, Trash2, ShoppingBag, CreditCard, ShoppingCart, Package, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
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
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getSubtotal, 
    getDeliveryFee,
    getTotal 
  } = useCart();
  const [loading, setLoading] = useState(false);
  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Бүтээгдэхүүн хасагдлаа",
      description: "Сагснаас бүтээгдэхүүн амжилттай хасагдлаа",
    });
  };
  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Сагс цэвэрлэгдлээ",
      description: "Таны сагсанд байсан бүх бүтээгдэхүүн хасагдлаа",
    });
  };
  const handleCheckout = () => {
    setLoading(true);
    const order = {
      id: Date.now().toString(),
      items: cartItems,
      totalAmount: getTotal(),
      deliveryFee: getDeliveryFee(),
      subtotal: getSubtotal(),
      date: new Date(),
    };
    localStorage.setItem('currentOrder', JSON.stringify(order));
    try {
      window.location.href = "https:
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
      <div className="mobile-container py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 h-10 px-3 md:px-4">
              <ArrowLeft className="h-5 w-5" /> 
              <span className="hidden sm:inline">Нүүр хуудас руу буцах</span>
              <span className="sm:hidden">Буцах</span>
            </Button>
          </Link>
        </motion.div>
        <div className="max-w-md mx-auto text-center px-4">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 mx-auto relative">
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotateZ: [0, -5, 0, 5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/5 flex items-center justify-center">
                  <ShoppingCart className="h-16 w-16 md:h-20 md:w-20 text-primary/30" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 10, y: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
                className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-base font-bold shadow-lg"
              >
                0
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Таны сагс хоосон байна
            </h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-gray-600 mb-2 text-sm md:text-base">
              Хоолны газар эсвэл дэлгүүрээс дуртай хоол болон бүтээгдэхүүнээ сонгож, сагсандаа нэмнэ үү.
            </p>
            <div className="flex justify-center mt-6 space-x-2">
              <motion.span 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0],
                }} 
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="text-2xl"
              >
                🍔
              </motion.span>
              <motion.span 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 0, 5, 0],
                }} 
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.3 }}
                className="text-2xl"
              >
                🍕
              </motion.span>
              <motion.span 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0],
                }} 
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.6 }}
                className="text-2xl"
              >
                🍱
              </motion.span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mx-auto"
          >
            <Button 
              asChild 
              size="lg" 
              className="mobile-button px-8 py-6 md:px-10 h-12 md:h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary-foreground shadow-lg shadow-primary/20"
            >
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
    <div className="mobile-container py-4 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 h-10 px-3 md:px-4">
            <ArrowLeft className="h-5 w-5" /> 
            <span className="hidden sm:inline">Нүүр хуудас руу буцах</span>
            <span className="sm:hidden">Буцах</span>
          </Button>
        </Link>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden shadow-md border-gray-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  >
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  </motion.div>
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                    Миний сагс
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {cartItems.length} төрлийн бүтээгдэхүүн
                  </CardDescription>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.9 }} className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors"
                  onClick={handleClearCart}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors hidden md:flex items-center"
                  onClick={handleClearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Сагс цэвэрлэх
                </Button>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="cart-item p-4 md:p-5 hover:bg-gray-50/80"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="cart-item-image shadow-sm mx-auto sm:mx-0">
                        {item.imageUrl ? (
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="cart-item-details">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{item.price.toLocaleString()}₮ / ширхэг</p>
                          </div>
                          <motion.div 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                            className="sm:hidden"
                          >
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 rounded-full"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 sm:gap-4 mt-4">
                          <div className="cart-quantity-controls">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              className="cart-quantity-button text-gray-500"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </motion.button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="cart-quantity-input"
                              min="1"
                            />
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              className="cart-quantity-button text-gray-500"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </motion.button>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
                            <div className="text-right font-semibold text-lg bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                              {(item.price * item.quantity).toLocaleString()}₮
                            </div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }} 
                              whileTap={{ scale: 0.9 }}
                              className="hidden sm:block"
                            >
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 rounded-full"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="cart-summary-card sticky top-16 shadow-md border-gray-200">
            <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                <motion.div
                  initial={{ rotate: -15 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <PartyPopper className="h-5 w-5 text-primary" />
                </motion.div>
                Захиалгын нийлбэр
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 mt-4">
                <div className="cart-summary-row">
                  <span className="text-gray-600">Бүтээгдэхүүний дүн</span>
                  <span className="font-medium">{getSubtotal().toLocaleString()}₮</span>
                </div>
                <div className="cart-summary-row">
                  <span className="text-gray-600">Хүргэлтийн хураамж</span>
                  <span>
                    {getDeliveryFee() > 0 ? (
                      getDeliveryFee().toLocaleString() + '₮'
                    ) : (
                      <span className="text-green-500 font-medium">Үнэгүй</span>
                    )}
                  </span>
                </div>
                <Separator className="my-2" />
                <motion.div 
                  className="cart-total-row"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                >
                  <span>Нийт дүн</span>
                  <span className="text-lg md:text-xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                    {getTotal().toLocaleString()}₮
                  </span>
                </motion.div>
                {getSubtotal() < 50000 && (
                  <motion.div 
                    className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 text-amber-800 rounded-xl p-4 text-xs md:text-sm mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span role="img" aria-label="fire" className="text-lg">🔥</span>
                      </motion.div>
                      <p className="font-medium">50,000₮-с дээш захиалгад <span className="text-green-600">хүргэлт үнэгүй</span></p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-primary to-indigo-600 h-2.5 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (getSubtotal() / 50000) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <p className="text-xs mt-2 text-right font-medium">
                      Үнэгүй хүргэлтэд дутуу: <span className="text-amber-600">{(50000 - getSubtotal()).toLocaleString()}₮</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 md:p-6 pt-0">
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full mobile-button h-12 md:h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary-foreground shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                      <span>Боловсруулж байна...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Төлбөр төлөх ({getTotal().toLocaleString()}₮)
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
