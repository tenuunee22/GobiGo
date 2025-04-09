import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { registerUser, loginWithGoogle, loginWithFacebook } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ShoppingBag, Bike, Users, Mail, Key, User, Building2, Truck, CreditCard } from "lucide-react";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [vehicleType, setVehicleType] = useState("car");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // User type icons and info
  const userTypeInfo = {
    customer: {
      icon: <Users className="h-5 w-5" />,
      emoji: "🛒",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-100",
      hoverBorderColor: "hover:border-blue-300",
      title: "Хоол захиалагч",
      description: "Хоол захиалж, хүргүүлэх",
    },
    business: {
      icon: <ShoppingBag className="h-5 w-5" />,
      emoji: "🏪",
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-100",
      hoverBorderColor: "hover:border-amber-300",
      title: "Дэлгүүрийн эзэн",
      description: "Бизнес эрхлэгч, дэлгүүр, ресторан",
    },
    delivery: {
      icon: <Bike className="h-5 w-5" />,
      emoji: "🚚",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      hoverBorderColor: "hover:border-green-300",
      title: "Хүргэлтийн ажилтан",
      description: "Хоол хүргэлт хийх",
    },
  };

  // Business type icons and info
  const businessTypeInfo = {
    restaurant: { icon: "🍔", title: "Ресторан", description: "Хоолны газар, цайны газар" },
    grocery: { icon: "🥑", title: "Хүнсний дэлгүүр", description: "Жимс, ногоо, хүнсний бараа" },
    retail: { icon: "👕", title: "Жижиглэн худалдаа", description: "Хувцас, бараа, бүтээгдэхүүн" },
    other: { icon: "🏪", title: "Бусад", description: "Бусад төрлийн бизнес" },
  };

  // Vehicle type icons
  const vehicleTypeInfo = {
    car: { icon: "🚗", title: "Автомашин" },
    motorcycle: { icon: "🏍️", title: "Мотоцикл" },
    bicycle: { icon: "🚲", title: "Унадаг дугуй" },
    scooter: { icon: "🛴", title: "Скүтер" },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (password !== confirmPassword) {
      toast({
        title: "Нууц үг таарахгүй байна",
        description: "Нууц үгээ дахин шалгана уу",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data based on role
      let userData: any = {
        name,
        role: userType,
      };

      if (userType === "business") {
        userData = {
          ...userData,
          businessName,
          businessType,
        };
      } else if (userType === "delivery") {
        userData = {
          ...userData,
          vehicleType,
          licenseNumber,
        };
      }

      const userCredential = await registerUser(email, password, userData);
      
      toast({
        title: "Бүртгэл амжилттай үүслээ",
        description: "ГобиГоу-д тавтай морил!",
      });

      // Redirect based on user role
      switch(userType) {
        case 'business':
          setLocation("/dashboard/store");
          break;
        case 'delivery':
          setLocation("/dashboard/driver");
          break;
        case 'customer':
        default:
          setLocation("/dashboard");
          break;
      }
    } catch (error: any) {
      toast({
        title: "Бүртгэл үүсгэхэд алдаа гарлаа",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // No need to handle the result here as we now use redirect flow
      // The redirect will happen automatically and the result will be
      // processed by the handleAuthRedirect in AuthContext on return
      
      // We'll show a toast to indicate the process has started
      toast({
        title: "Google нэвтрэлт эхэллээ",
        description: "Google хуудас руу шилжиж байна...",
      });
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Google-ээр нэвтрэх амжилтгүй болсон",
        description: error.message || "Google-ээр нэвтрэх үед алдаа гарлаа",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithFacebook();
      // No need to handle the result here as we now use redirect flow
      // The redirect will happen automatically and the result will be
      // processed by the handleAuthRedirect in AuthContext on return
      
      // We'll show a toast to indicate the process has started
      toast({
        title: "Facebook нэвтрэлт эхэллээ",
        description: "Facebook хуудас руу шилжиж байна...",
      });
    } catch (error: any) {
      console.error("Facebook login error:", error);
      toast({
        title: "Facebook-ээр нэвтрэх амжилтгүй болсон",
        description: error.message || "Facebook-ээр нэвтрэх үед алдаа гарлаа",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const selectedUserType = userTypeInfo[userType as keyof typeof userTypeInfo];

  return (
    <motion.div 
      className="py-6 px-4 sm:px-6 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="flex justify-center mb-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-full blur-lg opacity-50 transform -rotate-6 scale-110"></div>
              <div className="relative bg-gradient-to-r from-primary to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">G</span>
              </div>
            </div>
          </motion.div>
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-primary to-indigo-600 text-transparent bg-clip-text">
              ГобиГоу-д бүртгүүлэх
            </span>
            <span className="text-xl tada">✨</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Эсвэл{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onToggleForm();
              }}
              className="font-medium text-primary hover:text-indigo-500 relative inline-block group"
            >
              <span className="relative z-10">бүртгэлтэй хаягаар нэвтрэх</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="px-6 py-8">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Label className="mb-3 block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Би бүртгүүлэх гэж байна</span>
                </span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(userTypeInfo).map(([type, info]) => (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      rounded-lg cursor-pointer transition-all border-2 shadow-sm
                      ${userType === type ? `border-${info.color.split(' ')[0].replace('from-', '')}` : 'border-transparent bg-gray-50 border-gray-100'}
                      ${info.hoverBorderColor}
                    `}
                    onClick={() => setUserType(type)}
                  >
                    <div className={`
                      p-4 rounded-lg bg-gradient-to-r ${userType === type ? info.bgColor : 'from-gray-50 to-gray-50'}
                    `}>
                      <div className="flex items-center justify-between mb-1">
                        <div className={`
                          p-2 rounded-full bg-gradient-to-r 
                          ${userType === type ? info.color : 'from-gray-300 to-gray-400'}
                          text-white 
                          ${userType === type ? 'jelly' : ''}
                        `}>
                          {info.icon}
                        </div>
                        <span className={`text-xl ${userType === type ? 'tada' : ''}`}>{info.emoji}</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${userType === type ? 'text-gray-900' : 'text-gray-700'}`}>
                          {info.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="grid grid-cols-1 gap-5 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {/* Common fields section */}
                <div className={`
                  p-5 rounded-lg border 
                  bg-gradient-to-r ${selectedUserType.bgColor}
                  ${selectedUserType.borderColor}
                `}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`
                      p-1.5 rounded-md text-white
                      bg-gradient-to-r ${selectedUserType.color}
                    `}>
                      <User className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium">Үндсэн мэдээлэл</h3>
                    <span className="text-xs wiggle">{selectedUserType.emoji}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Label htmlFor="name" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                        <span className="text-xs pulse">👤</span> Бүтэн нэр
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Таны бүтэн нэр"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                          className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Label htmlFor="email" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                        <span className="text-xs jelly">📧</span> Имэйл хаяг
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tanii_email@domain.com"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Mail className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Label htmlFor="password" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs bounce-soft">🔒</span> Нууц үг
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Нууц үг оруулах"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Key className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <Label htmlFor="confirm-password" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs wiggle">🔐</span> Нууц үг давтах
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            placeholder="Нууц үг давтаж оруулах"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Key className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business specific fields */}
                {userType === "business" && (
                  <motion.div 
                    className="p-5 rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Бизнесийн мэдээлэл</h3>
                      <span className="text-xs bounce-soft">🏪</span>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Label htmlFor="business-name" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs jelly">✨</span> Бизнесийн нэр
                        </Label>
                        <div className="relative">
                          <Input
                            id="business-name"
                            name="business-name"
                            type="text"
                            placeholder="Таны бизнесийн нэр"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            disabled={isLoading}
                            className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="business-type" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs pulse">🏢</span> Бизнесийн төрөл
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(businessTypeInfo).map(([type, info]) => (
                            <motion.div
                              key={type}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`
                                border rounded-lg p-2 text-center cursor-pointer
                                ${businessType === type ? 'border-amber-300 bg-amber-50 shadow-sm' : 'border-gray-200 bg-white'}
                                hover:border-amber-200 transition-all
                              `}
                              onClick={() => setBusinessType(type)}
                            >
                              <div className="text-2xl mb-1">{info.icon}</div>
                              <div className="text-xs font-medium mb-0.5">{info.title}</div>
                              <div className="text-[10px] text-gray-500 leading-tight">{info.description}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Delivery specific fields */}
                {userType === "delivery" && (
                  <motion.div 
                    className="p-5 rounded-lg border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-md text-white bg-gradient-to-r from-green-500 to-emerald-600">
                        <Truck className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium">Хүргэлтийн мэдээлэл</h3>
                      <span className="text-xs tada">🚚</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicle-type" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs wiggle">🚗</span> Тээврийн хэрэгслийн төрөл
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(vehicleTypeInfo).map(([type, info]) => (
                            <motion.div
                              key={type}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className={`
                                border rounded-lg p-3 text-center cursor-pointer
                                ${vehicleType === type ? 'border-green-300 bg-green-50 shadow-sm' : 'border-gray-200 bg-white'}
                                hover:border-green-200 transition-all
                              `}
                              onClick={() => setVehicleType(type)}
                            >
                              <div className="text-2xl mb-1">{info.icon}</div>
                              <div className="text-xs font-medium">{info.title}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <Label htmlFor="license-number" className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                          <span className="text-xs jelly">📃</span> Жолооны үнэмлэхийн дугаар
                        </Label>
                        <div className="relative">
                          <Input
                            id="license-number"
                            name="license-number"
                            type="text"
                            placeholder="Жолооны үнэмлэхийн дугаарыг оруулах"
                            required
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            disabled={isLoading}
                            className="pl-9 border-gray-200 focus:border-primary focus:ring-primary/30"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <CreditCard className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className={`
                      w-full h-12 text-base shadow-md
                      bg-gradient-to-r ${selectedUserType.color} hover:opacity-90
                      transition-all duration-300
                    `}
                    disabled={isLoading}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg bounce-soft">{selectedUserType.emoji}</span>
                      <span>{isLoading ? "Бүртгэж байна..." : "Бүртгүүлэх"}</span>
                    </span>
                  </Button>
                </motion.div>

                <div className="text-center mt-4 text-xs text-gray-500">
                  Бүртгүүлснээр та манай{" "}
                  <a href="#" className="text-primary hover:underline">үйлчилгээний нөхцөл</a>-ийг хүлээн зөвшөөрч байна
                </div>
              </motion.div>
            </motion.div>
            
            {/* Social login buttons */}
            <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 flex items-center">
                    <span className="mr-1 text-xs tada">👇</span>
                    Эсвэл бүртгүүлэх
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-5 hover:bg-blue-50 border-indigo-100 hover:border-indigo-300 shadow-sm transition-all duration-300"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 jelly" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                      <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                      <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                      <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                    </svg>
                    <span className="font-medium">Google</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-5 hover:bg-blue-50 border-indigo-100 hover:border-indigo-300 shadow-sm transition-all duration-300"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 pulse" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}