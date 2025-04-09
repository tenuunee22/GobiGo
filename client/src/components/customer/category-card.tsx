import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  name: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
  emoji?: string;
}

export function CategoryCard({ name, icon, onClick, isActive = false, emoji }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`bg-white border rounded-lg p-4 text-center cursor-pointer transition-all h-full
        ${isActive 
          ? 'border-amber-400 shadow-md ring-2 ring-amber-200 ring-opacity-50' 
          : 'border-gray-200 hover:shadow-md'
        }`}
    >
      <div className={`
        mx-auto mb-3 flex items-center justify-center rounded-full w-16 h-16
        ${isActive ? 'bg-amber-100' : 'bg-amber-50'}
      `}>
        {icon}
      </div>
      <h3 className={`font-medium ${isActive ? 'text-amber-700' : 'text-gray-800'}`}>
        {name} {emoji}
      </h3>
    </motion.div>
  );
}