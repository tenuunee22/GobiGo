import { motion } from "framer-motion";
interface RestaurantCardSkeletonProps {
  count?: number;
}
export function RestaurantCardSkeleton({ count = 1 }: RestaurantCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-xl overflow-hidden border border-gray-100 shadow-sm h-[280px] relative"
        >
          {}
          <div className="h-36 bg-gray-100 flex items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [-5, 5, -5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: index * 0.2 % 1, 
              }}
              className="text-3xl opacity-20"
            >
              {}
              {["🍔", "🍕", "🍜", "🍱", "🥗", "🍲", "🍛", "🍝", "🥘"][index % 9]}
            </motion.div>
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
              }}
              style={{ opacity: 0.7 }}
            />
          </div>
          <div className="p-4">
            {}
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2">
              <motion.div 
                className="h-full bg-gray-300 rounded-md w-1/2"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.1,
                }}
              />
            </div>
            {}
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-3">
              <motion.div 
                className="h-full bg-gray-300 rounded-md w-1/2"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.2,
                }}
              />
            </div>
            {}
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 rounded-md w-1/4">
                <motion.div 
                  className="h-full bg-gray-300 rounded-md w-1/2"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.3,
                  }}
                />
              </div>
              <div className="h-4 bg-gray-200 rounded-md w-1/4">
                <motion.div 
                  className="h-full bg-gray-300 rounded-md w-1/2"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.4,
                  }}
                />
              </div>
            </div>
            {}
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded-md w-1/3">
                <motion.div 
                  className="h-full bg-gray-300 rounded-md w-1/2"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5,
                  }}
                />
              </div>
              <div className="h-5 bg-gray-200 rounded-md w-1/3">
                <motion.div 
                  className="h-full bg-gray-300 rounded-md w-1/2"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.6,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}