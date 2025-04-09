import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
interface SocialMediaLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  bgColor: string;
  hoverBgColor?: string;
  iconColor?: string;
  delay?: number;
  showToast?: boolean;
  toastMessage?: string;
}
export function SocialMediaLink({
  href,
  icon,
  label,
  bgColor,
  hoverBgColor,
  iconColor = "text-white",
  delay = 0,
  showToast = true,
  toastMessage,
}: SocialMediaLinkProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(true);
    if (showToast) {
      toast({
        title: toastMessage || `${label} хуудас руу очиж байна`,
        description: "Шинэ цонхонд нээж байна...",
        variant: "default",
      });
    }
    window.open(href, "_blank");
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileTap={{ scale: 0.9 }}
    >
      <motion.button
        onClick={handleClick}
        className={`${bgColor} ${iconColor} w-24 h-24 rounded-full shadow-lg mb-3 flex items-center justify-center relative overflow-hidden`}
        whileHover={{ 
          scale: 1.1, 
          y: -5,
          backgroundColor: hoverBgColor || "",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
        }}
        animate={{
          scale: isClicked ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {}
        <motion.div
          animate={{
            scale: isHovering ? 1.1 : 1,
            rotate: isClicked ? [0, -10, 10, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {icon}
        </motion.div>
        {}
        {isClicked && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {}
        <motion.div
          className="absolute inset-0 bg-white opacity-0 rounded-full"
          animate={{
            opacity: isHovering ? 0.2 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
      {}
      <motion.span 
        className="text-amber-900 font-medium"
        animate={{
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}