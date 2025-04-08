import React from 'react';
import { motion } from 'framer-motion';
interface OnboardingStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: React.ReactNode;
}
const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  icon,
  animation
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-2">{icon}</div>
      <p className="text-muted-foreground mb-4">{description}</p>
      {animation}
    </motion.div>
  );
};
export default OnboardingStep;
