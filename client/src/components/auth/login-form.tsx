import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { loginUser } from "@/lib/firebase";
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
      
      // Get user data from Firestore to determine role
      const userData = await import("@/lib/firebase").then(m => m.getUserData(userCredential.uid));
      if (userData) {
        // Set user data in auth context
        setUser({
          uid: userCredential.uid,
          email: userCredential.email,
          displayName: userCredential.displayName,
          ...userData
        });
        
        // Redirect based on role
        if (userData.role === 'business') {
          setLocation("/dashboard/store");
        } else if (userData.role === 'delivery') {
          setLocation("/dashboard/driver");
        } else {
          // Customer or default role
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


    </motion.div>
  );
}