import { motion } from "framer-motion";
interface CategoryLoaderProps {
  count?: number;
}
export function CategoryLoader({ count = 5 }: CategoryLoaderProps) {
  const foodEmojis = ["🍔", "🍕", "🍜", "🍣", "🥗", "🍲", "🍩", "🍖", "🥪", "🌮"];
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 pb-4 no-scrollbar">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0 rounded-full h-20 w-20 bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden group"
        >
          {}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2 % 1,
            }}
          />
          {}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3 % 1.5,
            }}
            className="text-2xl relative z-10 opacity-30"
          >
            {foodEmojis[index % foodEmojis.length]}
          </motion.div>
          {}
          <div className="h-3 bg-gray-200 w-12 rounded-full mt-2 relative z-10">
            <motion.div 
              className="h-full bg-gray-300 rounded-full w-1/2"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}