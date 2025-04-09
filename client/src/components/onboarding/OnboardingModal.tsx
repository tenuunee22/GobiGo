import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './onboarding-context';
import { 
  ShoppingBag, 
  Store, 
  Truck, 
  CreditCard
} from 'lucide-react';
import { 
  Binoculars,
  Hamburger,
  MapPin,
  SmileyWink
} from 'phosphor-react';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      staggerChildren: 0.1,
      staggerDirection: -1 
    }
  }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  },
  exit: { y: -20, opacity: 0 }
};
const steps = [
  {
    title: "GobiGo-д тавтай морил!",
    description: "Хоол, түргэн хоолны захиалга, хүргэлтийн платформд тавтай морилно уу! Энэхүү богино танилцуулгаар манай аппликэйшнийг хэрхэн ашиглахыг харуулж өгөх болно.",
    icon: <SmileyWink size={64} weight="duotone" className="text-primary mb-2" />,
    animation: (
      <motion.div 
        className="flex justify-center items-center my-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          rotate: { 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2.5 
          }
        }}
      >
        <SmileyWink size={128} weight="duotone" className="text-primary" />
      </motion.div>
    )
  },
  {
    title: "Дуртай хоолоо ол",
    description: "Ангилал, дүүрэг, эсвэл нэрээр нь хоол хайж, амттай хоолоо ол!",
    icon: <Binoculars size={64} weight="duotone" className="text-primary mb-2" />,
    animation: (
      <motion.div className="flex flex-col items-center gap-4 my-6">
        <motion.div 
          className="w-full flex justify-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="p-3 bg-gray-100 rounded-lg flex items-center gap-2 w-4/5"
            whileHover={{ scale: 1.05 }}
          >
            <Binoculars size={24} className="text-primary" />
            <span className="text-gray-400">Хоол хайх...</span>
          </motion.div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 gap-3 w-4/5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {['Үндсэн хоол', 'Түргэн хоол', 'Цай, кофе', 'Амттан'].map((category, index) => (
            <motion.div
              key={index}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center text-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#f0f4ff" }}
            >
              <Hamburger size={20} className="text-primary mr-2" />
              <span className="text-sm">{category}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    )
  },
  {
    title: "Захиалга өг",
    description: "Дуртай хоолоо сонгоод, хүргүүлэх хаяг, төлбөрийн мэдээллээ оруулаад захиалгаа өгөөрэй!",
    icon: <ShoppingBag size={64} className="text-primary mb-2" />,
    animation: (
      <motion.div className="flex flex-col items-center gap-4 my-6">
        <motion.div 
          className="w-4/5 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-lg font-medium mb-2">Таны захиалга</div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex justify-between py-1">
              <span>1 × Хулууны шөл</span>
              <span>9,800₮</span>
            </div>
            <div className="flex justify-between py-1">
              <span>2 × Өндөгтэй будаа</span>
              <span>15,600₮</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="h-px bg-gray-200 my-2 origin-left"
            />
            <div className="flex justify-between py-1 font-medium">
              <span>Нийт</span>
              <span>25,400₮</span>
            </div>
          </motion.div>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-2 items-center text-sm text-gray-500 mb-2">
              <MapPin size={16} />
              <span>Хүргэлтийн хаяг</span>
            </div>
            <div className="h-8 bg-gray-100 rounded w-full"></div>
          </motion.div>
        </motion.div>
        <motion.button
          className="bg-primary text-white px-4 py-2 rounded-md font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Захиалах
        </motion.button>
      </motion.div>
    )
  },
  {
    title: "Төлбөрөө хий, хүргэлтээ хүлээн ав",
    description: "Төлбөрөө кредит карт эсвэл QPay ашиглан хийгээд, хоолоо хүргүүлж аваарай!",
    icon: <CreditCard size={64} className="text-primary mb-2" />,
    animation: (
      <motion.div className="flex justify-center items-center my-6 overflow-hidden relative h-[200px]">
        <motion.div 
          className="absolute flex flex-col items-center"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.2
          }}
        >
          <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 mb-3 relative">
            <motion.div
              className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              ✓
            </motion.div>
            <CreditCard size={40} className="text-primary" />
          </div>
          <span className="text-sm font-medium">Төлбөр амжилттай</span>
        </motion.div>
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Truck size={64} className="text-primary" />
          </motion.div>
        </motion.div>
        <motion.div 
          className="absolute left-1/2 bottom-0 transform -translate-x-1/2"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.3, type: "spring" }}
        >
          <span className="text-sm font-medium">Таны захиалга замдаа явж байна</span>
        </motion.div>
      </motion.div>
    )
  }
];
const OnboardingModal: React.FC = () => {
  const { 
    isFirstVisit,
    isOnboardingDone,
    currentStep,
    totalSteps,
    startOnboarding,
    skipOnboarding,
    nextStep,
    prevStep
  } = useOnboarding();
  const showModal = (isFirstVisit || (!isOnboardingDone && !isFirstVisit)) && window.location.pathname === "/";
  if (!showModal) return null;
  return (
    <Dialog open={showModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isFirstVisit ? "GobiGo апп-д тавтай морил!" : steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center sr-only">
            {isFirstVisit ? "Танилцуулга" : steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {isFirstVisit ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  rotate: { 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2.5 
                  }
                }}
                className="my-8"
              >
                <SmileyWink size={128} weight="duotone" className="text-primary" />
              </motion.div>
              <p className="text-muted-foreground mb-6 text-center">
                Та энэхүү богино танилцуулга хэсгийг үзэж манай аппликэйшнийг хэрхэн ашиглахыг судлах уу?
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-2">{steps[currentStep].icon}</div>
              <p className="text-muted-foreground mb-4">{steps[currentStep].description}</p>
              {steps[currentStep].animation}
            </motion.div>
          )}
        </AnimatePresence>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isFirstVisit ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  skipOnboarding();
                  window.location.reload();
                }}
                className="sm:flex-1"
              >
                Алгасах
              </Button>
              <Button
                onClick={startOnboarding}
                className="sm:flex-1"
              >
                Эхлэх
              </Button>
            </>
          ) : (
            <>
              <div className="flex w-full items-center gap-2 justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Өмнөх
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 rounded-full ${
                        index === currentStep ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: index === currentStep ? 1 : 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
                <Button
                  onClick={() => {
                    if (currentStep === totalSteps - 1) {
                      skipOnboarding();
                      window.location.reload();
                    } else {
                      nextStep();
                    }
                  }}
                >
                  {currentStep === totalSteps - 1 ? 'Дуусгах' : 'Дараах'}
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default OnboardingModal;