import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LoaderCircle, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QPayPaymentProps {
  orderId: string;
  paymentIntentId: string;
  amount: number;
}

export function QPayPayment({ 
  orderId, 
  paymentIntentId, 
  amount 
}: QPayPaymentProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [deepLinks, setDeepLinks] = useState<{qPay?: string, eBarimt?: string} | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");
  const [counter, setCounter] = useState(30); // 30 seconds countdown for auto-refresh

  // Load QPay data on mount
  useEffect(() => {
    const fetchQPayData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, we would have the payment data from the order creation step
        // For this demo, we'll generate a new QPay payment 
        const qpayResponse = await apiRequest("POST", "/api/create-qpay-payment", {
          amount,
          orderId,
          customerName: "Хэрэглэгч", // In a real app, this would be the user's name
          customerPhone: "" // In a real app, this would be the user's phone number
        });
        
        const qpayData = await qpayResponse.json();
        
        if (qpayData.success) {
          setQrCode(qpayData.qrCodeUrl);
          setInvoiceId(qpayData.qpayInvoiceId);
          setDeepLinks(qpayData.deepLink);
        } else {
          toast({
            title: "Алдаа гарлаа",
            description: "QPay төлбөрийн мэдээлэл авах үед алдаа гарлаа",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching QPay data:", error);
        toast({
          title: "Алдаа гарлаа",
          description: "QPay төлбөрийн мэдээлэл авах үед алдаа гарлаа",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQPayData();
  }, [amount, orderId, toast]);

  // Start countdown for auto-refresh
  useEffect(() => {
    if (paymentStatus === "pending" && !loading) {
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCheckStatus();
            return 30; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [paymentStatus, loading]);

  // Check payment status
  const handleCheckStatus = async () => {
    if (checking) return;
    
    try {
      setChecking(true);
      
      // In a real app, this would check a real payment
      const response = await apiRequest("GET", `/api/check-payment/${paymentIntentId}`);
      const data = await response.json();
      
      // For demo, randomly decide if payment was successful
      // In a real app, we would check the actual payment status
      const isSuccessful = Math.random() > 0.5; // 50% chance of success
      
      if (isSuccessful) {
        setPaymentStatus("completed");
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны төлбөр амжилттай хийгдлээ",
        });
        
        // Give a moment to see the success message, then redirect
        setTimeout(() => {
          setLocation(`/order/${orderId}`);
        }, 2000);
      } else {
        // Continue checking
        setCounter(30); // Reset timer
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Төлбөрийн төлөв шалгах үед алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">QPay төлбөрийн мэдээлэл ачааллаж байна...</p>
      </div>
    );
  }

  if (paymentStatus === "completed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Төлбөр амжилттай</h2>
        <p className="text-gray-600 mb-6">Таны захиалга баталгаажлаа</p>
        <Button onClick={() => setLocation(`/order/${orderId}`)}>
          Захиалга харах
        </Button>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Төлбөр амжилтгүй</h2>
        <p className="text-gray-600 mb-6">Төлбөр хийх явцад алдаа гарлаа</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setLocation("/")}>
            Буцах
          </Button>
          <Button onClick={() => window.location.reload()}>
            Дахин оролдох
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>QPay төлбөр</CardTitle>
        <CardDescription>
          Захиалгын дугаар: {orderId}<br />
          Нийт дүн: {amount.toLocaleString()}₮
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {qrCode && (
            <div className="text-center p-2 border rounded-lg">
              <p className="text-sm text-gray-500 mb-2">QR кодыг QPay аппаар уншуулж төлнө үү</p>
              <img src={qrCode} alt="QPay QR code" className="mx-auto" width="200" height="200" />
              <p className="mt-2 text-xs text-gray-400">
                Invoice ID: {invoiceId}
              </p>
            </div>
          )}
          
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <p>Автоматаар {counter} секундын дараа шалгана</p>
              <Button 
                size="sm" 
                onClick={handleCheckStatus} 
                disabled={checking}
              >
                {checking ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Шалгаж байна
                  </>
                ) : "Шалгах"}
              </Button>
            </div>

            {deepLinks && (
              <div className="flex flex-col space-y-3 mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(deepLinks.qPay, "_blank")}
                >
                  <Smartphone className="mr-2 h-4 w-4" /> QPay аппыг нээх
                </Button>
                {deepLinks.eBarimt && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(deepLinks.eBarimt, "_blank")}
                  >
                    Э-Баримт авах
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}