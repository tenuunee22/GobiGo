import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Copy, CheckCircle } from "lucide-react";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  // In a real app, this would be an invoice number from the payment provider
  const qpayInvoiceNo = `INV-${Math.floor(Math.random() * 10000000)}`;
  
  const handleOpenQPay = () => {
    setIsDialogOpen(true);
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue += value[i];
    }
    
    setCardNumber(formattedValue.substring(0, 19)); // xxxx xxxx xxxx xxxx format
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += "/" + value.substring(2, 4);
      }
    }
    
    setExpiryDate(formattedValue);
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.substring(0, 3));
  };
  
  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(qpayInvoiceNo);
    toast({
      title: "Хуулагдлаа",
      description: "Нэхэмжлэлийн дугаар хуулагдлаа"
    });
  };
  
  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        title: "Алдаа",
        description: "Карт дугаар буруу байна",
        variant: "destructive"
      });
      return;
    }
    
    if (!cardName) {
      toast({
        title: "Алдаа",
        description: "Картын эзэмшигчийн нэр оруулна уу",
        variant: "destructive"
      });
      return;
    }
    
    if (expiryDate.length !== 5) {
      toast({
        title: "Алдаа",
        description: "Хүчинтэй хугацаа буруу байна",
        variant: "destructive"
      });
      return;
    }
    
    if (cvv.length !== 3) {
      toast({
        title: "Алдаа",
        description: "CVV буруу байна",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send the card details to a payment processor
    setTimeout(() => {
      setIsSuccess(true);
      
      // Reset form after 3 seconds and close dialog
      setTimeout(() => {
        setIsSuccess(false);
        setIsDialogOpen(false);
        setCardNumber("");
        setCardName("");
        setExpiryDate("");
        setCvv("");
        
        toast({
          title: "Төлбөр амжилттай",
          description: "Таны захиалгыг хүлээн авлаа"
        });
      }, 3000);
    }, 1500);
  };
  
  return (
    <>
      <Button onClick={handleOpenQPay} className="w-full">
        QPay-ээр төлөх
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QPay төлбөр</DialogTitle>
            <DialogDescription>
              Захиалгын дугаар: {orderId}
            </DialogDescription>
          </DialogHeader>
          
          {isSuccess ? (
            <div className="py-10 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Төлбөр амжилттай</h3>
              <p className="text-gray-500">
                Таны төлбөр амжилттай хийгдлээ. Захиалгыг боловсруулж байна.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4 bg-muted/50 p-3 rounded-md">
                  <div>
                    <div className="text-sm text-muted-foreground">Нэхэмжлэл #</div>
                    <div className="font-mono">{qpayInvoiceNo}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyInvoice}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Төлөх дүн</div>
                  <div className="text-xl font-bold">{amount.toLocaleString()}₮</div>
                </div>
              </div>
              
              <form onSubmit={handleSubmitCard}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Картын дугаар
                    </label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Картын эзэмшигч
                    </label>
                    <Input
                      placeholder="ОВОГ НЭР"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Хүчинтэй хугацаа
                      </label>
                      <Input
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        CVV
                      </label>
                      <Input
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        type="password"
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Цуцлах
                  </Button>
                  <Button type="submit">Төлөх</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}