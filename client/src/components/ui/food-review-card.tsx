import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FoodEmojiReaction, type FoodEmojiType } from "./food-emoji-reaction";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
interface FoodReviewCardProps {
  review: {
    id: string;
    foodId: string;
    userName: string;
    userImage?: string;
    date: string; 
    rating: number; 
    content: string;
    images?: string[];
    reactions?: Record<FoodEmojiType, number>;
    userReaction?: FoodEmojiType;
    likes: number;
    comments: number;
  };
  onReaction?: (emoji: FoodEmojiType) => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  className?: string;
}
export function FoodReviewCard({
  review,
  onReaction,
  onLike,
  onComment,
  onShare,
  className
}: FoodReviewCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);
  const [showAllText, setShowAllText] = useState(false);
  const [currentReactions, setCurrentReactions] = 
    useState<Record<FoodEmojiType, number>>(review.reactions || {} as Record<FoodEmojiType, number>);
  const [userReaction, setUserReaction] = useState<FoodEmojiType | null>(review.userReaction || null);
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike && onLike();
  };
  const handleReaction = (emoji: FoodEmojiType) => {
    setUserReaction(emoji);
    onReaction && onReaction(emoji);
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('mn-MN', options);
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              "w-4 h-4 fill-current",
              star <= rating ? "text-yellow-500" : "text-gray-300"
            )}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}
      </div>
    );
  };
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return showAllText ? text : `${text.substring(0, maxLength)}...`;
  };
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={review.userImage} alt={review.userName} />
            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.userName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(review.date)}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                  {renderStars(review.rating)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3">
              <p className="text-sm leading-relaxed">
                {truncateText(review.content)}
                {review.content.length > 150 && (
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto" 
                    onClick={() => setShowAllText(!showAllText)}
                  >
                    {showAllText ? 'Хураангуй' : 'Цааш унших'}
                  </Button>
                )}
              </p>
            </div>
            {}
            {review.images && review.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {review.images.slice(0, 3).map((image, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "relative rounded-md overflow-hidden bg-gray-100",
                      "aspect-square"
                    )}
                  >
                    <img 
                      src={image} 
                      alt={`Review ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {}
                    {index === 2 && review.images && review.images.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                        +{review.images.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {}
            <div className="mt-4">
              <FoodEmojiReaction 
                foodId={review.foodId}
                initialReactions={currentReactions}
                userReaction={userReaction}
                onReaction={handleReaction}
                variant="horizontal"
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "flex-1 flex items-center gap-1 text-xs",
            liked && "text-primary"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" /> 
          <span>Таалагдлаа • {likeCount}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 flex items-center gap-1 text-xs"
          onClick={onComment}
        >
          <MessageCircle className="h-4 w-4" /> 
          <span>Сэтгэгдэл • {review.comments}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 flex items-center gap-1 text-xs"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" /> 
          <span>Хуваалцах</span>
        </Button>
      </CardFooter>
    </Card>
  );
}