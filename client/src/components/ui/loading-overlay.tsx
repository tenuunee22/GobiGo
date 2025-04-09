import { motion, AnimatePresence } from "framer-motion";
import { BouncingLoader } from "./bouncing-loader";
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  theme?: "light" | "dark" | "gradient";
}
export function LoadingOverlay({
  isLoading,
  message = "Түр хүлээнэ үү...",
  fullScreen = true,
  theme = "light",
}: LoadingOverlayProps) {
  const themeConfig = {
    light: {
      bg: "bg-white/95",
      text: "text-gray-800",
    },
    dark: {
      bg: "bg-gray-900/95",
      text: "text-white",
    },
    gradient: {
      bg: "bg-gradient-to-r from-primary/90 to-indigo-600/90",
      text: "text-white",
    },
  };
  const selectedTheme = themeConfig[theme];
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            fullScreen
              ? "fixed inset-0 z-50"
              : "absolute inset-0 z-10 rounded-lg"
          } ${
            selectedTheme.bg
          } flex flex-col items-center justify-center p-6`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="text-center"
          >
            <BouncingLoader 
              text={message} 
              size="lg" 
              showBackground={theme === "light"}
              foodIcons={[
                { emoji: "🍔", delay: 0 },
                { emoji: "🍕", delay: 0.2 },
                { emoji: "🥗", delay: 0.4 },
                { emoji: "🍜", delay: 0.6 },
                { emoji: "🍦", delay: 0.8 },
              ]}
            />
            {}
            <div className="mt-6 flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-16 h-1 bg-primary/30 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}