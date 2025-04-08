import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { LoaderCircle, CreditCard, Smartphone, MapPin, Clock } from "lucide-react";

interface PlaceOrderProps {
  businessId: string;
  businessName: string;
  selectedItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  onClose: () => void;
  open: boolean;
}

export function PlaceOrder({ 
  businessId, 
  businessName,
  selectedItems, 
  onClose, 
  open 
}: PlaceOrderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qpay">("qpay");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState("asap");
  const [customTime, setCustomTime] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const [qpayData, setQpayData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Auto-fill user data if available
  useEffect(() => {
    if (user) {
      // In a real app, we would populate the user's default address here
      setDeliveryAddress(user.address || "");
    }
  }, [user]);

  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2490; // Fixed delivery fee for demonstration
  const total = subtotal + deliveryFee;

  // Function to get business type
  const [businessType, setBusinessType] = useState<string>("restaurant");

  // Get business information
  useEffect(() => {
    const getBusinessInfo = async () => {
      try {
        // Replace with your actual API call to get business info
        const response = await apiRequest("GET", `/api/businesses/${businessId}`);
        const businessData = await response.json();
        
        if (businessData && businessData.businessType) {
          setBusinessType(businessData.businessType.toLowerCase());
        }
      } catch (error) {
        console.error("Error fetching business info:", error);
        // Default to restaurant if error
        setBusinessType("restaurant");
      }
    };
    
    if (businessId) {
      getBusinessInfo();
    }
  }, [businessId]);

  const handleSubmitOrder = async () => {
    if (!user) {
      toast({
        title: "Нэвтрээгүй байна",
        description: "Та эхлээд бүртгэлдээ нэвтэрнэ үү",
        variant: "destructive"
      });
      // Redirect to login page after showing toast
      setTimeout(() => {
        onClose();
        setLocation("/login");
      }, 1500);
      return;
    }
    
    if (!deliveryAddress) {
      toast({
        title: "Хүргэлтийн хаяг оруулна уу",
        description: "Захиалга хүргэх хаягаа бөглөнө үү",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Determine order status based on business type
      // Restaurant orders go through preparation process
      // Other business types (retail, pharmacy, etc.) go straight to driver pickup
      const initialStatus = businessType === "restaurant" ? "placed" : "ready_for_pickup";
      
      // Prepare order data
      const orderData = {
        order: {
          customerUid: user.uid,
          businessUid: businessId,
          businessType: businessType, // Store business type for order processing
          status: initialStatus,
          totalAmount: total,
          deliveryAddress: deliveryAddress,
          deliveryNotes: deliveryNotes,
          requestedTime: selectedTime === "custom" ? customTime : "asap",
          paymentStatus: "pending",
          paymentMethod: paymentMethod
        },
        items: selectedItems.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Create order in the database
      const response = await apiRequest("POST", "/api/orders", orderData);
      const result = await response.json();
      
      // Store the order ID for reference
      setOrderId(result.id.toString());
      
      if (paymentMethod === "card") {
        // Create payment intent for credit card payment
        const paymentData = {
          amount: total,
          orderId: result.id,
          customerName: user.displayName || user.email,
          customerEmail: user.email
        };
        
        const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", paymentData);
        const paymentResult = await paymentResponse.json();
        
        // Navigate to checkout page with payment intent
        setLocation(`/checkout?paymentIntentId=${paymentResult.paymentIntentId}&clientSecret=${paymentResult.clientSecret}&orderId=${result.id}`);
        onClose();
      } else if (paymentMethod === "qpay") {
        // Create QPay payment request
        const qpayData = {
          amount: total,
          orderId: result.id,
          customerName: user.displayName || user.email,
          customerPhone: user.phoneNumber || ""
        };
        
        const qpayResponse = await apiRequest("POST", "/api/create-qpay-payment", qpayData);
        const qpayResult = await qpayResponse.json();
        
        // Show QPay payment information
        setQpayData(qpayResult);
        setPaymentStep(true);
      }

      // Display status message based on business type
      toast({
        title: "Захиалга хийгдлээ",
        description: businessType === "restaurant" 
          ? "Таны захиалгыг рестораны ажилтан хүлээн авах болно" 
          : "Таны захиалгыг хүргэгч очиж авах болно",
      });

    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Захиалга үүсгэхэд алдаа гарлаа",
        description: "Дахин оролдоно уу",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      
      const response = await apiRequest("GET", `/api/orders/${orderId}`);
      const orderData = await response.json();
      
      if (orderData.order.paymentStatus === "completed") {
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны захиалга хүлээн авагдсан",
        });
        onClose();
        setLocation(`/order/${orderId}`);
      } else {
        toast({
          title: "Төлбөр хүлээгдэж байна",
          description: "QPay апп-д төлбөрөө баталгаажуулна уу"
        });
      }
    } catch (error) {
      console.error("Error checking order status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {!paymentStep ? "Захиалга хийх" : "QPay төлбөр"}
          </DialogTitle>
        </DialogHeader>
        
        {!paymentStep ? (
          // Order form
          <div className="grid gap-4 py-4">
            <div className="font-medium text-lg">{businessName}</div>
            
            {/* Selected items */}
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="font-medium mb-2">Сонгосон хоолнууд</h3>
              {selectedItems.map((item, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span className="font-medium">{item.price * item.quantity}₮</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between py-1">
                <span>Дүн</span>
                <span className="font-medium">{subtotal}₮</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Хүргэлтийн хураамж</span>
                <span className="font-medium">{deliveryFee}₮</span>
              </div>
              <div className="flex justify-between py-1 text-lg font-semibold">
                <span>Нийт дүн</span>
                <span>{total}₮</span>
              </div>
            </div>
            
            {/* Delivery details */}
            <div>
              <Label htmlFor="address" className="text-base font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Хүргэлтийн хаяг
              </Label>
              <Input
                id="address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Хүргэлтийн хаягаа оруулна уу"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-base font-medium">Нэмэлт тэмдэглэл</Label>
              <Textarea
                id="notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Жишээ: Хаалганы код, байрны дугаар, гэх мэт"
                className="mt-1"
              />
            </div>
            
            {/* Delivery time */}
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Хүргэлтийн цаг
              </Label>
              <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asap" id="asap" />
                  <Label htmlFor="asap">Аль болох хурдан</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Тодорхой цаг сонгох</Label>
                </div>
              </RadioGroup>
              
              {selectedTime === "custom" && (
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="mt-2"
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>
            
            {/* Payment method */}
            <div>
              <Label className="text-base font-medium">Төлбөрийн хэлбэр</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as "card" | "qpay")} 
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qpay" id="qpay" />
                  <Label htmlFor="qpay" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> QPay
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Кредит карт
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) : (
          // QPay payment information
          <div className="py-4">
            {qpayData ? (
              <div className="flex flex-col items-center">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg">Төлбөрийн мэдээлэл</h3>
                  <p className="text-gray-600">Захиалгын дугаар: {qpayData.paymentIntentId}</p>
                  <p className="text-gray-600">Төлөх дүн: {qpayData.amount}₮</p>
                </div>
                
                <div className="mb-4">
                  <img 
                    src={qpayData.qrCodeUrl} 
                    alt="QPay QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    QPay апп-аар уншуулан төлбөрөө төлнө үү
                  </p>
                  <Button onClick={handleCheckStatus} disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Шалгаж байна
                      </>
                    ) : "Төлбөр шалгах"}
                  </Button>
                </div>
                
                {qpayData.deepLink && (
                  <div className="flex gap-2 w-full">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open(qpayData.deepLink.qPay, "_blank")}
                    >
                      QPay нээх
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open(qpayData.deepLink.eBarimt, "_blank")}
                    >
                      Э-Баримт авах
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <LoaderCircle className="mx-auto h-8 w-8 animate-spin mb-4" />
                <p>QPay мэдээлэл ачааллаж байна...</p>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          {!paymentStep ? (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Цуцлах
              </Button>
              <Button 
                type="button" 
                onClick={handleSubmitOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Захиалж байна
                  </>
                ) : "Захиалах"}
              </Button>
            </>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Хаах
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}