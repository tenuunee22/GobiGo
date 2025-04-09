import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FoodEmojiType } from "./food-emoji-reaction";
import { cn } from "@/lib/utils";

interface FoodTooltipProps {
  children: React.ReactNode;
  onEmojiSelect?: (emoji: FoodEmojiType) => void;
  position?: "top" | "bottom";
  className?: string;
}

export function FoodTooltip({
  children,
  onEmojiSelect,
  position = "top",
  className
}: FoodTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<FoodEmojiType | null>(null);

  // Бүх боломжит эможинууд
  const emojis: FoodEmojiType[] = ["😋", "🍕", "🍔", "🍜", "🍣", "🥗", "🔥", "👍", "❤️"];

  const handleEmojiClick = (emoji: FoodEmojiType) => {
    setSelectedEmoji(emoji);
    onEmojiSelect && onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-1.5",
              "border border-gray-200 dark:border-gray-700",
              position === "top" ? "bottom-full mb-2" : "top-full mt-2",
              "left-1/2 transform -translate-x-1/2",
              className
            )}
          >
            <div className="flex space-x-1">
              {emojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEmojiClick(emoji)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-lg",
                    "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    selectedEmoji === emoji && "bg-primary/10"
                  )}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>

            {/* Хуудас дээрээ байрлал тохируулах гурвалжин сум */}
            <div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 h-0 w-0",
                "border-l-8 border-r-8 border-transparent",
                position === "top"
                  ? "bottom-[-8px] border-t-8 border-t-white dark:border-t-gray-800"
                  : "top-[-8px] border-b-8 border-b-white dark:border-b-gray-800"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Дэлгэрэнгүй эможитой огтолцуур - хоолны дэлгэрэнгүй хуудсанд ашиглана
export function DetailedFoodTooltip({
  children,
  onEmojiSelect,
  position = "top",
  className
}: FoodTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Эможины нэр ба тайлбар
  const emojiGroups = [
    {
      title: "Үнэлгээ",
      emojis: [
        { emoji: "👍" as FoodEmojiType, name: "Сайн" },
        { emoji: "❤️" as FoodEmojiType, name: "Хайртай" },
        { emoji: "🔥" as FoodEmojiType, name: "Халуун" },
        { emoji: "😋" as FoodEmojiType, name: "Амттай" },
      ]
    },
    {
      title: "Хоолны төрөл",
      emojis: [
        { emoji: "🍕" as FoodEmojiType, name: "Пицца" },
        { emoji: "🍔" as FoodEmojiType, name: "Бургер" },
        { emoji: "🍜" as FoodEmojiType, name: "Гоймон" },
        { emoji: "🍣" as FoodEmojiType, name: "Суши" },
        { emoji: "🥗" as FoodEmojiType, name: "Салат" },
      ]
    }
  ];

  const handleEmojiClick = (emoji: FoodEmojiType) => {
    onEmojiSelect && onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: position === "top" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2",
              "border border-gray-200 dark:border-gray-700 w-64",
              position === "top" ? "bottom-full mb-2" : "top-full mt-2",
              "left-1/2 transform -translate-x-1/2",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              {emojiGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">{group.title}</h4>
                  <div className="grid grid-cols-4 gap-1">
                    {group.emojis.map(({ emoji, name }) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(emoji)}
                        className="flex flex-col items-center p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="text-xl mb-1">{emoji}</span>
                        <span className="text-xs">{name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Хуудас дээрээ байрлал тохируулах гурвалжин сум */}
            <div
              className={cn(
                "absolute left-1/2 transform -translate-x-1/2 h-0 w-0",
                "border-l-8 border-r-8 border-transparent",
                position === "top"
                  ? "bottom-[-8px] border-t-8 border-t-white dark:border-t-gray-800"
                  : "top-[-8px] border-b-8 border-b-white dark:border-b-gray-800"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}