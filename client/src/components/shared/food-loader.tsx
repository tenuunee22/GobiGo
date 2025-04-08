import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Define food characters with their animations
const foodCharacters = [
  {
    name: "burger",
    element: (
      <motion.div
        className="w-16 h-16 relative"
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ 
          scale: [0.8, 1, 0.8],
          rotate: [-5, 5, -5],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        {/* Burger top bun */}
        <motion.div 
          className="absolute top-0 w-16 h-5 bg-amber-300 rounded-t-full z-20"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        {/* Burger patty */}
        <motion.div 
          className="absolute top-3 w-16 h-5 bg-amber-800 rounded-sm z-10"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
        />
        {/* Lettuce */}
        <motion.div 
          className="absolute top-6 w-16 h-2 bg-green-500 z-10"
          animate={{ y: [0, -1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        />
        {/* Cheese */}
        <motion.div 
          className="absolute top-7 w-16 h-1.5 bg-yellow-400 z-10"
          animate={{ y: [0, -1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
        />
        {/* Bottom bun */}
        <motion.div 
          className="absolute top-8 w-16 h-4 bg-amber-200 rounded-b-lg z-0"
        />
      </motion.div>
    )
  },
  {
    name: "pizza",
    element: (
      <motion.div
        className="w-16 h-16 relative"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Pizza base - triangle */}
        <div className="absolute w-0 h-0 border-l-[30px] border-r-[30px] border-b-[60px] border-l-transparent border-r-transparent border-b-amber-300 transform translate-x-2"></div>
        
        {/* Cheese drips */}
        <motion.div 
          className="absolute top-6 left-7 w-1 h-3 bg-yellow-200 rounded-b-full"
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        />
        <motion.div 
          className="absolute top-7 left-9 w-1 h-2 bg-yellow-200 rounded-b-full"
          animate={{ scaleY: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        
        {/* Pepperoni */}
        <motion.div 
          className="absolute top-3 left-8 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <motion.div 
          className="absolute top-6 left-6 w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}
        />
      </motion.div>
    )
  },
  {
    name: "noodles",
    element: (
      <motion.div className="w-16 h-16 flex justify-center items-center">
        {/* Bowl */}
        <div className="absolute w-14 h-7 bg-slate-200 rounded-b-full overflow-hidden"></div>
        
        {/* Noodles */}
        <motion.div className="relative mt-1 flex flex-col items-center">
          <motion.div
            className="w-10 h-0.5 bg-amber-100 rounded-full my-0.5"
            animate={{
              y: [0, -1, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.div
            className="w-10 h-0.5 bg-amber-100 rounded-full my-0.5"
            animate={{
              y: [0, -1, 0],
              rotate: [2, -2, 2]
            }}
            transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }}
          />
          <motion.div
            className="w-8 h-0.5 bg-amber-100 rounded-full my-0.5"
            animate={{
              y: [0, -2, 0],
              rotate: [-3, 3, -3]
            }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="w-9 h-0.5 bg-amber-100 rounded-full my-0.5"
            animate={{
              y: [0, -1, 0],
              rotate: [3, -3, 3]
            }}
            transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
          />
          
          {/* Chopsticks */}
          <div className="absolute -right-3 -top-3 w-0.5 h-10 bg-amber-800 rotate-12"></div>
          <div className="absolute -right-1 -top-3 w-0.5 h-10 bg-amber-800 rotate-6"></div>
        </motion.div>
      </motion.div>
    )
  },
  {
    name: "donut",
    element: (
      <motion.div 
        className="w-16 h-16 flex justify-center items-center"
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {/* Main donut */}
        <div className="relative w-12 h-12 bg-pink-300 rounded-full flex justify-center items-center">
          {/* Donut hole */}
          <div className="w-4 h-4 bg-transparent rounded-full border-4 border-white"></div>
          
          {/* Sprinkles */}
          <motion.div 
            className="absolute top-2 left-3 w-1.5 h-0.5 bg-blue-500 rounded-full rotate-45"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.div 
            className="absolute top-4 right-2 w-1.5 h-0.5 bg-yellow-500 rounded-full -rotate-20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
          />
          <motion.div 
            className="absolute bottom-2 left-3 w-1.5 h-0.5 bg-green-500 rounded-full rotate-70"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.div 
            className="absolute bottom-4 right-3 w-1.5 h-0.5 bg-purple-500 rounded-full -rotate-45"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
          />
          <motion.div 
            className="absolute top-3 left-7 w-1.5 h-0.5 bg-red-500 rounded-full rotate-90"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}
          />
          
          {/* Dripping icing */}
          <motion.div 
            className="absolute -bottom-1 left-5 w-1 h-2 bg-pink-300 rounded-b-full"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    )
  }
];

interface FoodLoaderProps {
  text?: string;
  foodType?: "random" | "burger" | "pizza" | "noodles" | "donut";
  size?: "small" | "medium" | "large";
}

export function FoodLoader({ 
  text = "Loading...", 
  foodType = "random",
  size = "medium"
}: FoodLoaderProps) {
  const [character, setCharacter] = useState(foodCharacters[0]);
  
  useEffect(() => {
    if (foodType === "random") {
      // Select a random food character
      const randomIndex = Math.floor(Math.random() * foodCharacters.length);
      setCharacter(foodCharacters[randomIndex]);
    } else {
      // Select the specified food character
      const selectedCharacter = foodCharacters.find(c => c.name === foodType) || foodCharacters[0];
      setCharacter(selectedCharacter);
    }
  }, [foodType]);
  
  // Scale container based on size prop
  const containerClass = `flex flex-col items-center justify-center ${
    size === "small" ? "scale-75" : 
    size === "large" ? "scale-125" : ""
  }`;
  
  // Text classes based on size
  const textClass = `mt-4 text-center font-medium text-gray-600 ${
    size === "small" ? "text-xs" : 
    size === "large" ? "text-lg" : "text-sm"
  }`;
  
  return (
    <div className={containerClass}>
      <div className="flex items-center justify-center">
        {character.element}
      </div>
      
      {text && (
        <div className={textClass}>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

interface LoadingScreenProps {
  text?: string;
  foodType?: "random" | "burger" | "pizza" | "noodles" | "donut";
}

export function LoadingScreen({ text, foodType = "random" }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <FoodLoader 
        text={text} 
        foodType={foodType} 
        size="large" 
      />
    </div>
  );
}