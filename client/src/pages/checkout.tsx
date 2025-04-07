import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { LoaderCircle, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
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
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны захиалга баталгаажлаа",
        });
      }
    } catch (error: any) {
      console.error("Payment submission error:", error);
      setErrorMessage(error.message || "Төлбөр хийхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

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
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#4f46e5',
                }
              },
              locale: 'en' // Unfortunately Stripe doesn't support Mongolian yet
            }}
          >
            <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}