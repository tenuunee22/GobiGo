import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { loginUser, loginWithGoogle, loginWithFacebook } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";

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
        
        // Redirect to home page
        setLocation("/");
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

  return (
    <div className="bg-white py-6 px-4 shadow sm:rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Бүртгэлдээ нэвтрэх</h2>
      <p className="mb-6 text-center text-sm text-gray-600">
        Эсвэл{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onToggleForm();
          }}
          className="font-medium text-primary hover:text-indigo-500"
        >
          шинэ бүртгэл үүсгэх
        </a>
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Имэйл хаяг</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Нууц үг</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              disabled={isLoading}
            />
            <Label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Намайг сана
            </Label>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            Нэвтрэх
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Эсвэл үргэлжлүүлэх
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 py-5 hover:bg-blue-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
              <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
            </svg>
            <span>Google</span>
          </Button>

          <Button
            variant="outline" 
            className="flex items-center justify-center gap-2 py-5 hover:bg-blue-50" 
            onClick={handleFacebookLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
