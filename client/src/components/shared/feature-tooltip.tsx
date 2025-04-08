import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface FeatureTooltipProps {
  title: string;
  description: string;
  icon?: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
  showDetailedView?: boolean;
  emoji?: string;
}
export function FeatureTooltip({
  title,
  description,
  icon = <HelpCircle className="h-4 w-4" />,
  placement = "top",
  children,
  showDetailedView = false,
  emoji,
}: FeatureTooltipProps) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0 text-gray-400 hover:bg-amber-100 hover:text-amber-600"
            onClick={(e) => {
              if (showDetailedView) {
                e.preventDefault();
                setShowDetail(true);
              }
            }}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side={placement}
          className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-200"
        >
          <p className="font-medium flex items-center gap-1">
            {title}
            {emoji && <span className="text-lg">{emoji}</span>}
          </p>
          {!showDetailedView && <p className="text-xs text-amber-800 mt-1">{description}</p>}
          {showDetailedView && (
            <p className="text-xs text-amber-800 mt-1">
              {description.substring(0, 70)}...
              <span 
                className="text-amber-600 font-medium cursor-pointer ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetail(true);
                }}
              >
                Дэлгэрэнгүй
              </span>
            </p>
          )}
        </TooltipContent>
      </Tooltip>
      <AnimatePresence>
        {showDetailedView && showDetail && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {title}
                  {emoji && <span className="text-2xl animate-bounce-gentle">{emoji}</span>}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  onClick={() => setShowDetail(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="prose prose-amber">
                {children ? children : <p>{description}</p>}
              </div>
              <div className="mt-6 flex justify-end">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => setShowDetail(false)}
                  >
                    Ойлголоо
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
