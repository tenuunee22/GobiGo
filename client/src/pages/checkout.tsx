import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LoaderCircle, CheckCircle, AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { QPayPayment } from "@/components/customer/qpay-payment";
import { useAuth } from "@/contexts/auth-context";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DeliveryChat } from "@/components/shared/delivery-chat";
import { DeliveryAnimation } from "@/components/ui/delivery-animation";

// Make sure to call loadStripe outside of a component's render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("VITE_STRIPE_PUBLIC_KEY not found in environment variables");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ clientSecret, orderId }: { clientSecret: string, orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDeliveryChat, setShowDeliveryChat] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // For the demo, let's simulate a successful payment
      // In a real app, this would be handled by the confirmPayment() method
      const simulateSuccess = Math.random() > 0.2;
      
      if (simulateSuccess) {
        // Simulate successful payment
        setLoading(false);
        setPaymentSuccess(true);
        setShowDeliveryChat(true);
        
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны захиалга баталгаажлаа. Хүргэгчтэй холбогдох боломжтой.",
        });
        
        return; // Skip the real payment confirmation in demo mode
      }
      
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + `/order/${orderId}`,
        },
      });

      if (error) {
        console.error("Payment error:", error);
        setErrorMessage(error.message || "Төлбөр хийхэд алдаа гарлаа");
        toast({
          title: "Төлбөр амжилтгүй",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // The payment was processed or the customer has been redirected
        setPaymentSuccess(true);
        setShowDeliveryChat(true);
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны захиалга баталгаажлаа. Хүргэгчтэй холбогдох боломжтой.",
        });
      }
    } catch (error: any) {
      console.error("Payment submission error:", error);
      setErrorMessage(error.message || "Төлбөр хийхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  // If payment was successful, show the success screen
  if (paymentSuccess) {
    return (
      <div className="space-y-6">
        <div className="p-6 border border-green-100 bg-green-50 rounded-lg text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Төлбөр амжилттай хийгдлээ!</h3>
          <p className="text-gray-600 mb-4">
            Таны захиалга амжилттай бүртгэгдлээ. Хүргэлтийн хүсэлт илгээгдсэн бөгөөд хүргэгчтэй холбогдох боломжтой.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button onClick={() => setLocation(`/order/${orderId}`)}>
              <CheckCircle className="mr-2 h-4 w-4" /> Захиалга харах
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
            </Button>
          </div>
        </div>
        
        {/* Show the delivery information */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Хүргэлтийн мэдээлэл</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Хүргэгч</p>
                <p className="font-medium">Дорж</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowDeliveryChat(!showDeliveryChat)}>
                {showDeliveryChat ? "Чат хаах" : "Чат нээх"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Хүргэлтийн хугацаа</p>
                <p className="font-medium">30-40 минут</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Захиалгын дугаар</p>
                <p className="font-medium">{orderId}</p>
              </div>
            </div>
            
            <div className="py-4">
              <div className="relative pt-4">
                <DeliveryAnimation status="on-the-way" size="md" />
              </div>
            </div>
          </div>
        </div>
        
        {showDeliveryChat && (
          <DeliveryChat
            orderId={orderId}
            customerName="Батаа"
            driverName="Дорж"
            onSendMessage={(message) => console.log("Sent message:", message)}
          />
        )}
      </div>
    );
  }

  // Default payment form when not yet paid
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="flex gap-3 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setLocation("/")}
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Боловсруулж байна
            </>
          ) : "Төлбөр хийх"}
        </Button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [searchParams] = useLocation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse the URL query parameters
    const params = new URLSearchParams(searchParams);
    const secret = params.get("clientSecret");
    const id = params.get("orderId");

    if (!secret || !id) {
      setError("Төлбөрийн мэдээлэл дутуу байна");
      setLoading(false);
      return;
    }

    setClientSecret(secret);
    setOrderId(id);
    setLoading(false);
  }, [searchParams, toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Төлбөрийн мэдээлэл ачааллаж байна...</p>
      </div>
    );
  }

  if (error || !clientSecret || !orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Алдаа гарлаа</h2>
        <p className="text-gray-600 mb-6">{error || "Төлбөрийн мэдээлэл дутуу байна"}</p>
        <Button onClick={() => setLocation("/")}>
          Буцах
        </Button>
      </div>
    );
  }

  // Get total amount from the URL query parameters
  const params = new URLSearchParams(searchParams);
  const amount = parseInt(params.get("amount") || "0", 10);

  // If orderId is a string, it's safe to use it directly
  const orderIdStr = orderId as string;
  const paymentIntentId = "pi_" + Math.random().toString(36).substring(2, 15);

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Төлбөр хийх</CardTitle>
          <CardDescription>
            Захиалгын дугаар: {orderId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="card" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Карт
              </TabsTrigger>
              <TabsTrigger value="qpay" className="flex items-center gap-2">
                <img src="https://qpay.mn/q-mark.png" alt="QPay" className="h-4 w-4" />
                QPay
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="mt-4">
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#9d7b4d',
                    }
                  },
                  locale: 'en' // Unfortunately Stripe doesn't support Mongolian yet
                }}
              >
                <CheckoutForm clientSecret={clientSecret} orderId={orderIdStr} />
              </Elements>
            </TabsContent>
            
            <TabsContent value="qpay" className="mt-4">
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Захиалгын дугаар</span>
                    <span className="font-medium">{orderIdStr}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Төлөх дүн</span>
                    <span className="font-bold text-lg">{amount.toLocaleString()}₮</span>
                  </div>
                </div>
                
                <QPayPayment 
                  orderId={orderIdStr} 
                  paymentIntentId={paymentIntentId}
                  amount={amount} 
                />
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setLocation("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}