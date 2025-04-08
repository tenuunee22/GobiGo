import { motion } from "framer-motion";
interface DeliveryAnimationProps {
  status: "preparing" | "on-the-way" | "arriving" | "delivered";
  size?: "sm" | "md" | "lg";
}
export function DeliveryAnimation({ status, size = "md" }: DeliveryAnimationProps) {
  const sizeConfig = {
    sm: {
      container: "h-16 w-32",
      emoji: "text-xl",
      vehicle: "text-2xl",
      package: "text-xl",
      road: "h-1",
    },
    md: {
      container: "h-24 w-48",
      emoji: "text-2xl",
      vehicle: "text-3xl",
      package: "text-2xl",
      road: "h-1.5",
    },
    lg: {
      container: "h-32 w-64",
      emoji: "text-3xl",
      vehicle: "text-4xl",
      package: "text-3xl",
      road: "h-2",
    },
  };
  const selectedSize = sizeConfig[size];
  let progress = 0;
  let vehicleEmoji = "🛵";
  let animationDelay = 0;
  switch (status) {
    case "preparing":
      progress = 0;
      vehicleEmoji = "👨‍🍳";
      animationDelay = 0;
      break;
    case "on-the-way":
      progress = 33;
      vehicleEmoji = "🛵";
      animationDelay = 0.3;
      break;
    case "arriving":
      progress = 66;
      vehicleEmoji = "🛵";
      animationDelay = 0.6;
      break;
    case "delivered":
      progress = 100;
      vehicleEmoji = "🎉";
      animationDelay = 0.9;
      break;
  }
  const roadVariants = {
    preparing: {
      background: "linear-gradient(90deg, #e2e8f0 0%, #e2e8f0 100%)",
    },
    progress: {
      background: "linear-gradient(90deg, #3b82f6 0%, #e2e8f0 100%)",
      backgroundSize: `${progress}% 100%`,
    },
  };
  const vehicleVariants = {
    preparing: {
      x: "10%",
      y: [0, -5, 0],
      rotate: [0, 5, 0],
    },
    onTheWay: {
      x: `${Math.min(progress, 90)}%`,
      y: [0, -8, 0],
      rotate: [0, 5, 0],
    },
  };
  const packageVariants = {
    idle: {
      x: "90%",
      y: [0, -3, 0],
      scale: [1, 1.1, 1],
      opacity: status === "delivered" ? 1 : 0.5,
    },
  };
  return (
    <div className={`relative ${selectedSize.container}`}>
      <motion.div
        className={`absolute bottom-1/3 left-0 w-full ${selectedSize.road} bg-gray-200 rounded-full overflow-hidden`}
        initial="preparing"
        animate="progress"
        variants={roadVariants}
      >
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </motion.div>
      <motion.div
        className={`absolute bottom-1/3 left-0 ${selectedSize.vehicle}`}
        initial="preparing"
        animate="onTheWay"
        variants={vehicleVariants}
        transition={{
          x: { type: "spring", stiffness: 100, damping: 20, delay: animationDelay },
          y: { duration: 1, repeat: Infinity, repeatType: "reverse" },
          rotate: { duration: 1, repeat: Infinity, repeatType: "reverse" },
        }}
      >
        {vehicleEmoji}
      </motion.div>
      <motion.div
        className={`absolute bottom-1/3 left-0 ${selectedSize.package}`}
        initial="idle"
        animate="idle"
        variants={packageVariants}
        transition={{
          y: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
          scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
        }}
      >
        {status === "delivered" ? "😋" : "🏠"}
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-full text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {status === "preparing" && "Хоол бэлтгэж байна..."}
        {status === "on-the-way" && "Хүргэлтэнд гарлаа..."}
        {status === "arriving" && "Ирэх дөхлөө..."}
        {status === "delivered" && "Хүргэгдсэн!"}
      </motion.div>
    </div>
  );
}
