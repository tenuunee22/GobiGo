import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { loginUser, loginWithGoogle, loginWithFacebook } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
interface LoginFormProps {
  onToggleForm: () => void;
}
export function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      toast({
        title: "Амжилттай нэвтэрлээ",
        description: "Тавтай морил!",
      });
      const userData = await import("@/lib/firebase").then(m => m.getUserData(userCredential.uid));
      if (userData) {
        setUser({
          uid: userCredential.uid,
          email: userCredential.email,
          displayName: userCredential.displayName,
          ...userData
        });
        if (userData.role === 'business') {
          setLocation("/dashboard/store");
        } else if (userData.role === 'delivery') {
          setLocation("/dashboard/driver");
        } else {
          setLocation("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Нэвтрэх үйлдэл амжилтгүй болсон",
        description: error.message || "Нэвтрэх үед алдаа гарлаа",
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
  return (
    <motion.div 
      className="bg-white py-6 px-4 shadow sm:rounded-lg overflow-hidden border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-center text-2xl font-bold mb-4 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
          Бүртгэлдээ нэвтрэх
        </span>
        <span className="text-xl tada">👋</span>
      </motion.h2>
      <motion.p 
        className="mb-6 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
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
          <span className="relative z-10">шинэ бүртгэл үүсгэх</span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </a>
      </motion.p>
      <motion.form 
        className="space-y-6"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="space-y-4">
          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg slide-in-left"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="email" className="flex items-center mb-1.5">
              <span className="text-xs jelly mr-1.5">✉️</span>
              <span className="font-medium text-indigo-700">Имэйл хаяг</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-indigo-200 focus:border-indigo-400 pl-10 shadow-sm"
                placeholder="tanii_email@domain.com"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 wiggle">@</span>
            </div>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg slide-in-right"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="password" className="flex items-center mb-1.5">
              <span className="text-xs pulse mr-1.5">🔒</span>
              <span className="font-medium text-indigo-700">Нууц үг</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-indigo-200 focus:border-indigo-400 pl-10 shadow-sm" 
                placeholder="Таны нууц үг"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 bounce-soft">🔑</span>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="flex items-center justify-between fade-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              disabled={isLoading}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <Label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              <span className="flex items-center">
                <span>Намайг сана</span>
                <span className="ml-1 text-xs bounce-soft">🧠</span>
              </span>
            </Label>
          </div>
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
            Нууц үг мартсан?
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
            disabled={isLoading}
          >
            <span className="flex items-center">
              <span className="mr-2 text-xs wiggle">🚀</span>
              <span>Нэвтрэх</span>
            </span>
          </Button>
        </motion.div>
      </motion.form>
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 flex items-center">
              <span className="mr-1 text-xs tada">👇</span>
              Эсвэл үргэлжлүүлэх
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
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
    </motion.div>
  );
}
