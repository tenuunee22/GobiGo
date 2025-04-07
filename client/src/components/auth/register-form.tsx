import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { registerUser } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

      await registerUser(email, password, userData);
      
      toast({
        title: "Бүртгэл амжилттай үүслээ",
        description: "ГобиГоу-д тавтай морил!",
      });

      // Redirect based on role will be handled by auth context
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

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="text-4xl font-bold text-primary">ГобиГоу</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Шинэ бүртгэл үүсгэх</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Эсвэл{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onToggleForm();
            }}
            className="font-medium text-primary hover:text-indigo-500"
          >
            бүртгэлтэй хаягаар нэвтрэх
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="user-type">Би бүртгүүлж байна</Label>
              <div className="mt-1">
                <Select 
                  value={userType} 
                  onValueChange={setUserType}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Хэрэглэгчийн төрөл сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Хэрэглэгч</SelectItem>
                    <SelectItem value="business">Бизнес (Дэлгүүрийн эзэн)</SelectItem>
                    <SelectItem value="delivery">Хүргэлтийн ажилтан</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Бүтэн нэр</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Нууц үг баталгаажуулах</Label>
              <div className="mt-1">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Business specific fields */}
            {userType === "business" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="business-name">Бизнесийн нэр</Label>
                  <div className="mt-1">
                    <Input
                      id="business-name"
                      name="business-name"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="business-type">Бизнесийн төрөл</Label>
                  <div className="mt-1">
                    <Select 
                      value={businessType} 
                      onValueChange={setBusinessType}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Бизнесийн төрөл сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Ресторан</SelectItem>
                        <SelectItem value="grocery">Хүнсний дэлгүүр</SelectItem>
                        <SelectItem value="retail">Жижиглэн худалдааны дэлгүүр</SelectItem>
                        <SelectItem value="other">Бусад</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery specific fields */}
            {userType === "delivery" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="vehicle-type">Тээврийн хэрэгслийн төрөл</Label>
                  <div className="mt-1">
                    <Select 
                      value={vehicleType} 
                      onValueChange={setVehicleType}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Тээврийн хэрэгслийн төрөл сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Автомашин</SelectItem>
                        <SelectItem value="motorcycle">Мотоцикл</SelectItem>
                        <SelectItem value="bicycle">Унадаг дугуй</SelectItem>
                        <SelectItem value="scooter">Скүтер</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="license-number">Жолооны үнэмлэхийн дугаар</Label>
                  <div className="mt-1">
                    <Input
                      id="license-number"
                      name="license-number"
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                Бүртгэл үүсгэх
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
