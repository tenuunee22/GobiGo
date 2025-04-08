import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOnboarding } from './onboarding-context';
import { HelpCircle } from 'lucide-react';

interface OnboardingHintButtonProps {
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
}

const OnboardingHintButton: React.FC<OnboardingHintButtonProps> = ({ 
  position = 'bottom-right' 
}) => {
  const { resetOnboarding, isOnboardingDone } = useOnboarding();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  if (!isOnboardingDone) return null;
  
  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-full shadow-md bg-white border-primary"
              onClick={resetOnboarding}
            >
              <HelpCircle className="h-6 w-6 text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" align="center">
            <p>Танилцуулгыг дахин үзэх</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default OnboardingHintButton;