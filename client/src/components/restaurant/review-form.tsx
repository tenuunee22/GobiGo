import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface ReviewFormProps {
  businessId: string;
  onReviewSubmit?: (rating: number, comment: string) => void;
}
export function ReviewForm({ businessId, onReviewSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmitReview = () => {
    if (!rating) {
      toast({
        title: "Үнэлгээ өгнө үү",
        description: "Үнэлгээ өгөхийн тулд одыг сонгоно уу",
        variant: "destructive",
      });
      return;
    }
    if (onReviewSubmit) {
      onReviewSubmit(rating, comment);
    }
    toast({
      title: "Үнэлгээ амжилттай",
      description: "Таны үнэлгээг хүлээн авлаа, баярлалаа!",
    });
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setRating(0);
        setComment("");
        setSubmitted(false);
      }, 300);
    }, 1500);
  };
  const StarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-8 w-8 cursor-pointer ${
            i <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } transition-colors`}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(i)}
        />
      );
    }
    return <div className="flex gap-1 justify-center py-4">{stars}</div>;
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Үнэлгээ өгөх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Үнэлгээ өгөх</DialogTitle>
        </DialogHeader>
        {!user ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Үнэлгээ өгөхийн тулд нэвтэрсэн байх шаардлагатай.
            </AlertDescription>
          </Alert>
        ) : submitted ? (
          <div className="py-6 text-center">
            <div className="text-2xl mb-2 font-semibold text-green-600">Баярлалаа!</div>
            <p>Таны үнэлгээг хүлээж авлаа.</p>
          </div>
        ) : (
          <>
            <div className="text-center text-sm text-gray-600 mb-2">
              Дэлгүүрт таны үнэлгээг өгнө үү
            </div>
            <StarRating />
            <div className="my-2">
              <Textarea
                placeholder="Таны сэтгэгдэл (заавал биш)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSubmitReview}>Илгээх</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}