import React, { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  HelpCircle,
  Info,
  Coffee,
  Pizza,
  Drumstick,
  Beef,
  Apple,
  Cookie,
  IceCream,
  Sandwich,
} from "lucide-react";

// Food illustration component
interface FoodIllustrationProps {
  type: 'pizza' | 'coffee' | 'chicken' | 'beef' | 'apple' | 'cookie' | 'icecream' | 'sandwich' | 'default';
  size?: number;
  color?: string;
}

const FoodIllustration: React.FC<FoodIllustrationProps> = ({ 
  type = 'default',
  size = 24,
  color = 'currentColor'
}) => {
  const iconProps = {
    size,
    color,
    className: "animate-bounce"
  };

  switch (type) {
    case 'pizza':
      return <Pizza {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    case 'chicken':
      return <Drumstick {...iconProps} />;
    case 'beef':
      return <Beef {...iconProps} />;
    case 'apple':
      return <Apple {...iconProps} />;
    case 'cookie':
      return <Cookie {...iconProps} />;
    case 'icecream':
      return <IceCream {...iconProps} />;
    case 'sandwich':
      return <Sandwich {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

// Food tooltip component
interface FoodTooltipProps {
  content: React.ReactNode;
  illustration?: FoodIllustrationProps['type'];
  children?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const FoodTooltip: React.FC<FoodTooltipProps> = ({
  content,
  illustration = 'default',
  children,
  side = "top",
  size = 'md',
  showIcon = true,
}) => {
  // Get width based on size prop
  const getWidth = () => {
    switch (size) {
      case 'sm': return 'max-w-[200px]';
      case 'lg': return 'max-w-[320px]';
      case 'md':
      default: return 'max-w-[250px]';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children || (
            <span className="inline-flex items-center cursor-help ml-1">
              <HelpCircle className="h-4 w-4 text-primary" />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={`${getWidth()} p-3 text-sm animated-tooltip bg-white shadow-lg rounded-lg border`}
          sideOffset={8}
        >
          <div className="flex items-start gap-2">
            {showIcon && (
              <div className="flex-shrink-0 mt-1">
                <FoodIllustration type={illustration} size={20} />
              </div>
            )}
            <div className="flex-1">{content}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Example usage for other developers:
// <FoodTooltip 
//   content="Хоолны төрлийг сонгоход туслах."
//   illustration="pizza"
// />

// More complex content example:
// <FoodTooltip
//   content={
//     <div className="space-y-1">
//       <div className="font-medium">Захиалгын горим</div>
//       <p>Та хүргэлтийн горимыг сонгох боломжтой. Бүх нөхцөлийг уншина уу.</p>
//     </div>
//   }
//   illustration="chicken"
//   side="right"
//   size="lg"
// />