import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, Link } from "wouter";
import { LoaderCircle, ArrowLeft, MapPin, Clock, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTracking } from "@/components/customer/order-tracking";
import { QPayPayment } from "@/components/customer/qpay-payment";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
interface BusinessInfo {
  id: number;
  name: string;
  address: string;
  imageUrl?: string;
}
interface OrderDetails {
  id: number;
  customerUid: string;
  businessUid: string;
  driverUid?: string;
  status: "placed" | "preparing" | "on-the-way" | "delivered" | "completed" | "cancelled";
  totalAmount: number;
  deliveryAddress: string;
  deliveryNotes?: string;
  requestedTime: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "card" | "qpay" | "cash";
  createdAt: string;
  business?: BusinessInfo;
  items: OrderItem[];
  driver?: {
    id: string;
    name: string;
    phone?: string;
    imageUrl?: string;
    arrivalTime?: string;
  };
}
export default function OrderDetails() {
  const [, params] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const orderId = params.id;
  useEffect(() => {
    if (!orderId) return;
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest("GET", `/api/orders/${orderId}`);
        if (Math.random() > 0.1) { 
          const mockOrder: OrderDetails = {
            id: parseInt(orderId),
            customerUid: user?.uid || "",
            businessUid: "business123",
            driverUid: "driver456",
            status: "on-the-way",
            totalAmount: 25990,
            deliveryAddress: "Баянгол дүүрэг, 3-р хороо, Хангай хотхон, 5-р байр, 26 тоот",
            deliveryNotes: "Утсаар урьдчилан мэдэгдэнэ үү",
            requestedTime: "asap",
            paymentStatus: "completed",
            paymentMethod: "qpay",
            createdAt: new Date().toISOString(),
            business: {
              id: 1,
              name: "Пицца Хүслэн",
              address: "Чингисийн өргөн чөлөө, Блү Мон төв",
              imageUrl: "https://example.com/img.jpg",
            },
            items: [
              { id: 1, name: "Пепперони Пицца", price: 14990, quantity: 1 },
              { id: 2, name: "Кока Кола 0.5л", price: 2500, quantity: 2 },
              { id: 3, name: "Чесночный соус", price: 1500, quantity: 2 },
            ],
            driver: {
              id: "driver456",
              name: "Батбаяр",
              phone: "99889988",
              arrivalTime: "10-15 минут"
            }
          };
          setOrder(mockOrder);
        } else {
          throw new Error("Захиалгын мэдээлэл олдсонгүй");
        }
      } catch (error: any) {
        console.error("Error fetching order:", error);
        setError(error.message || "Захиалгын мэдээлэл авахад алдаа гарлаа");
        toast({
          title: "Алдаа гарлаа",
          description: error.message || "Захиалгын мэдээлэл авахад алдаа гарлаа",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, toast, user]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed": return "bg-blue-500";
      case "preparing": return "bg-yellow-500";
      case "on-the-way": return "bg-purple-500";
      case "delivered":
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case "placed": return "Хүлээн авсан";
      case "preparing": return "Бэлтгэж байна";
      case "on-the-way": return "Хүргэлтэнд гарсан";
      case "delivered": return "Хүргэгдсэн";
      case "completed": return "Гүйцэтгэсэн";
      case "cancelled": return "Цуцлагдсан";
      default: return "Үл мэдэгдэх";
    }
  };
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Хүлээгдэж байна";
      case "completed": return "Төлөгдсөн";
      case "failed": return "Амжилтгүй";
      default: return "Үл мэдэгдэх";
    }
  };
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "card": return "Картаар";
      case "qpay": return "QPay";
      case "cash": return "Бэлнээр";
      default: return "Үл мэдэгдэх";
    }
  };
  const redirectToStripeCheckout = () => {
    window.location.href = "/api/stripe-static-checkout";
  };
  if (loading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Захиалгын мэдээлэл ачааллаж байна...</p>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="container py-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <CardTitle>Захиалга олдсонгүй</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error || "Захиалгын мэдээлэл олдсонгүй"}</p>
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
  if (order.paymentStatus === "pending" && order.paymentMethod === "card") {
    return (
      <div className="container py-10">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Төлбөр төлөх</CardTitle>
            <CardDescription>
              Захиалга #{order.id} - {order.totalAmount.toLocaleString()}₮
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity} x {item.name}</span>
                    <span className="font-medium">{item.price * item.quantity}₮</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between">
                    <span>Хүргэлтийн хураамж</span>
                    <span>2490₮</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Нийт дүн</span>
                    <span>{order.totalAmount}₮</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={redirectToStripeCheckout}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Stripe-аар төлөх
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (order.paymentStatus === "pending" && order.paymentMethod === "qpay") {
    return (
      <div className="container py-10">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
        <QPayPayment 
          orderId={order.id.toString()}
          paymentIntentId={`pi_${order.id}_${Date.now()}`} 
          amount={order.totalAmount}
        />
      </div>
    );
  }
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2490; 
  const total = order.totalAmount;
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Захиалга #{order.id}</CardTitle>
                <Badge 
                  className={`${getStatusColor(order.status)} hover:${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <CardDescription>
                {new Date(order.createdAt).toLocaleString('mn-MN')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {}
              <OrderTracking
                orderId={order.id.toString()}
                status={order.status === "completed" ? "delivered" : order.status}
                driver={order.driver ? {
                  id: order.driver.id,
                  name: order.driver.name,
                  imageUrl: order.driver.imageUrl,
                  arrivalTime: order.driver.arrivalTime || "15-20 минут"
                } : undefined}
                items={order.items.map(item => ({ 
                  name: item.name, 
                  quantity: item.quantity, 
                  price: item.price 
                }))}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
              />
            </CardContent>
          </Card>
        </div>
        {}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Захиалгын дэлгэрэнгүй</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {}
              {order.business && (
                <div className="flex items-center gap-4">
                  {order.business.imageUrl && (
                    <img
                      src={order.business.imageUrl}
                      alt={order.business.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{order.business.name}</h3>
                    <p className="text-sm text-gray-500">{order.business.address}</p>
                  </div>
                </div>
              )}
              <Separator />
              {}
              <div>
                <h3 className="font-medium mb-3">Захиалсан хоолнууд</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity} x {item.name}</span>
                      <span className="font-medium">{item.price * item.quantity}₮</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Дүн</span>
                    <span>{subtotal}₮</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Хүргэлтийн хураамж</span>
                    <span>{deliveryFee}₮</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Нийт дүн</span>
                    <span>{total}₮</span>
                  </div>
                </div>
              </div>
              <Separator />
              {}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Хүргэлтийн хаяг</h4>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
                    {order.deliveryNotes && (
                      <p className="text-sm text-gray-500 mt-1">{order.deliveryNotes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Хүргэлтийн цаг</h4>
                    <p className="text-gray-600">
                      {order.requestedTime === "asap" ? "Аль болох хурдан" : order.requestedTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Төлбөрийн мэдээлэл</h4>
                    <p className="text-gray-600">
                      {getPaymentMethodText(order.paymentMethod)} - {getPaymentStatusText(order.paymentStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-3">
              {}
              {order.paymentStatus === "pending" && (
                <Button 
                  className="w-full" 
                  onClick={redirectToStripeCheckout}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Төлбөр төлөх
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Харилцагчийн тусламж",
                    description: "Оператор тантай удахгүй холбогдох болно",
                  });
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Тусламж авах
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}