import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface FoodIcon {
  emoji: string;
  delay: number;
}
interface BouncingLoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  showBackground?: boolean;
  duration?: number;
  foodIcons?: FoodIcon[];
}
export function BouncingLoader({
  text = "Түр хүлээнэ үү...",
  size = "md",
  showBackground = false,
  duration = 2,
  foodIcons,
}: BouncingLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const defaultFoodIcons: FoodIcon[] = [
    { emoji: "🍔", delay: 0 },
    { emoji: "🍕", delay: 0.15 },
    { emoji: "🍜", delay: 0.3 },
    { emoji: "🍱", delay: 0.45 },
    { emoji: "🥗", delay: 0.6 },
  ];
  const icons = foodIcons || defaultFoodIcons;
  const sizeConfig = {
    sm: {
      container: "h-16",
      emoji: "text-xl",
      text: "text-xs mt-1",
    },
    md: {
      container: "h-24",
      emoji: "text-3xl",
      text: "text-sm mt-2",
    },
    lg: {
      container: "h-32",
      emoji: "text-5xl",
      text: "text-base mt-3",
    },
  };
  const selectedSize = sizeConfig[size];
  return (
    <div className={`w-full flex flex-col items-center justify-center ${selectedSize.container}`}>
      <AnimatePresence>
        {isVisible && (
          <div className="relative">
            {showBackground && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-primary/5 rounded-full w-16 h-16 -z-10 mx-auto"
                style={{ left: "calc(50% - 2rem)" }}
              />
            )}
            <div className="flex items-center justify-center gap-1 md:gap-2">
              {icons.map((icon, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0 }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: duration,
                    delay: icon.delay,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  className={`${selectedSize.emoji}`}
                >
                  {icon.emoji}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-gray-600 ${selectedSize.text}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
