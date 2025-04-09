import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
export type FoodEmojiType = "🍕" | "🍔" | "🍜" | "🍣" | "🥗" | "😋" | "🔥" | "👍" | "❤️";
const emojiInfo: Record<FoodEmojiType, { name: string; description: string }> = {
  "🍕": { name: "Пицца", description: "Маш амттай байсан" },
  "🍔": { name: "Бургер", description: "Гайхалтай амттай" },
  "🍜": { name: "Гоймон", description: "Халуухан, тансаг" },
  "🍣": { name: "Суши", description: "Шинэхэн, чанартай" },
  "🥗": { name: "Салат", description: "Эрүүл, шинэ ногоотой" },
  "😋": { name: "Амттай", description: "Маш амттай байсан" },
  "🔥": { name: "Халуун", description: "Маш халуун, хурц" },
  "👍": { name: "Сайн", description: "Сайн чанартай" },
  "❤️": { name: "Хайртай", description: "Хайртай хоол" }
};
interface FoodEmojiReactionProps {
  foodId: string;
  initialReactions?: Record<FoodEmojiType, number>;
  userReaction?: FoodEmojiType | null;
  onReaction?: (emoji: FoodEmojiType) => void;
  size?: "sm" | "md" | "lg";
  variant?: "horizontal" | "grid" | "compact";
  className?: string;
}
export function FoodEmojiReaction({
  foodId,
  initialReactions = {} as Record<FoodEmojiType, number>,
  userReaction = null,
  onReaction,
  size = "md",
  variant = "horizontal",
  className
}: FoodEmojiReactionProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<FoodEmojiType | null>(userReaction);
  const [reactions, setReactions] = useState<Record<FoodEmojiType, number>>(initialReactions);
  const [openTooltip, setOpenTooltip] = useState<FoodEmojiType | null>(null);
  const handleReaction = (emoji: FoodEmojiType) => {
    if (selectedEmoji === emoji) {
      setSelectedEmoji(null);
      setReactions(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1)
      }));
      onReaction && onReaction(null as any);
    } else {
      if (selectedEmoji) {
        setReactions(prev => ({
          ...prev,
          [selectedEmoji]: Math.max(0, (prev[selectedEmoji] || 0) - 1)
        }));
      }
      setSelectedEmoji(emoji);
      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }));
      onReaction && onReaction(emoji);
    }
  };
  const getEmojiSize = () => {
    switch (size) {
      case "sm": return "text-lg";
      case "lg": return "text-2xl";
      default: return "text-xl";
    }
  };
  const getEmojisToShow = (): FoodEmojiType[] => {
    const allEmojis: FoodEmojiType[] = ["🍕", "🍔", "🍜", "🍣", "🥗", "😋", "🔥", "👍", "❤️"];
    if (variant === "compact") {
      const sortedEmojis = Object.entries(reactions)
        .filter(([_, count]) => count > 0)
        .sort(([_, countA], [__, countB]) => countB - countA)
        .map(([emoji]) => emoji as FoodEmojiType);
      return sortedEmojis.length > 0 ? sortedEmojis.slice(0, 3) : ["👍", "🔥", "❤️"];
    }
    return allEmojis;
  };
  const emojisToShow = getEmojisToShow();
  return (
    <div 
      className={cn(
        "flex items-center gap-1",
        variant === "grid" && "flex-wrap justify-center gap-2",
        variant === "horizontal" && "overflow-x-auto py-1 -mx-1 px-1",
        className
      )}
    >
      <TooltipProvider>
        {emojisToShow.map((emoji) => (
          <Tooltip key={emoji} open={openTooltip === emoji} onOpenChange={(open) => setOpenTooltip(open ? emoji : null)}>
            <TooltipTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => handleReaction(emoji)}
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "relative rounded-full p-0 h-9 w-9",
                    selectedEmoji === emoji && "bg-primary/10 text-primary border-primary/30",
                    size === "sm" && "h-7 w-7",
                    size === "lg" && "h-10 w-10",
                  )}
                >
                  <span className={getEmojiSize()}>{emoji}</span>
                  {}
                  {(reactions[emoji] || 0) > 0 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-[10px] text-white rounded-full h-4 w-4 flex items-center justify-center"
                    >
                      {reactions[emoji]}
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-medium">{emojiInfo[emoji].name}</p>
              <p className="text-xs opacity-80">{emojiInfo[emoji].description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {}
        {variant === "compact" && emojisToShow.length < Object.keys(emojiInfo).length && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full p-0 h-9 w-9 border-dashed",
                    size === "sm" && "h-7 w-7",
                    size === "lg" && "h-10 w-10",
                  )}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Өөр үнэлгээ өгөх</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}