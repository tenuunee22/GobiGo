import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { LogOut, CheckCircle, Mail, Phone, User, Key, CreditCard, Upload, Camera } from "lucide-react";
import { changeUserPassword, logoutUser, updateUserProfile, uploadFile } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileSettingsProps {
  userType?: "customer" | "business" | "delivery";
}

export function UserProfileSettings({ userType = "customer" }: UserProfileSettingsProps) {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [vehicle, setVehicle] = useState(user?.vehicle || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [vehicleImage, setVehicleImage] = useState(user?.vehicleImage || "");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    
    try {
      setUploadingImage(true);
      const downloadURL = await uploadFile(user.uid, file, "vehicles");
      setVehicleImage(downloadURL);
      await updateUserProfile(user.uid, { vehicleImage: downloadURL });
      
      setUser(currentUser => {
        if (currentUser) {
          return { ...currentUser, vehicleImage: downloadURL };
        }
        return currentUser;
      });
      
      toast({
        title: "Зураг амжилттай хуулагдлаа",
        description: "Таны машины зураг амжилттай хадгалагдлаа",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Зураг хуулахад алдаа гарлаа",
        description: error.message || "Дахин оролдоно уу",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !user.uid) {
      toast({
        title: "Алдаа",
        description: "Хэрэглэгч олдсонгүй",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const profileData: Record<string, any> = {
        name: name,
        phone: phone,
      };
      
      if (userType === "delivery") {
        profileData.vehicle = vehicle;
      }
      
      await updateUserProfile(user.uid, profileData);
      
      setUser(currentUser => {
        if (currentUser) {
          return {
            ...currentUser,
            displayName: name, 
            phone: phone,
            ...(userType === "delivery" ? { vehicle } : {})
          };
        }
        return currentUser;
      });
      
      toast({
        title: "Профайл шинэчлэгдлээ",
        description: "Таны мэдээлэл амжилттай шинэчлэгдлээ",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Профайл шинэчлэхэд алдаа гарлаа",
        description: error.message || "Дахин оролдоно уу",
        variant: "destructive"
      });
    }
  };

  const handleSavePaymentMethod = () => {
    if (cardNumber.length < 16) {
      toast({
        title: "Картын дугаар буруу байна",
        description: "Картын дугаараа зөв оруулна уу",
        variant: "destructive"
      });
      return;
    }
    
    if (!cardName) {
      toast({
        title: "Картын нэр оруулна уу",
        description: "Картны эзэмшигчийн нэрийг оруулна уу",
        variant: "destructive"
      });
      return;
    }
    
    if (cardExpiry.length < 5) {
      toast({
        title: "Хүчинтэй хугацаа буруу байна",
        description: "Хүчинтэй хугацааг MM/YY форматаар оруулна уу",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Картын мэдээлэл хадгалагдлаа",
      description: "Таны төлбөрийн мэдээлэл амжилттай хадгалагдлаа",
    });
    
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      toast({
        title: "Одоогийн нууц үг оруулна уу",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Нууц үг хэт богино байна",
        description: "Нууц үг 6-с дээш тэмдэгт байх ёстой",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Нууц үг таарахгүй байна",
        description: "Шинэ нууц үг давтан оруулсантай таарахгүй байна",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await changeUserPassword(currentPassword, newPassword);
      
      toast({
        title: "Нууц үг шинэчлэгдлээ",
        description: "Таны нууц үг амжилттай шинэчлэгдлээ",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      
      if (error.code === 'auth/wrong-password') {
        toast({
          title: "Одоогийн нууц үг буруу байна",
          description: "Одоогийн нууц үгээ зөв оруулна уу",
          variant: "destructive"
        });
      } else if (error.code === 'auth/requires-recent-login') {
        toast({
          title: "Дахин нэвтрэх шаардлагатай",
          description: "Аюулгүй байдлын үүднээс та дахин нэвтэрнэ үү",
          variant: "destructive"
        });
        await logoutUser();
        setLocation("/login");
      } else {
        toast({
          title: "Нууц үг шинэчлэхэд алдаа гарлаа",
          description: error.message || "Дахин оролдоно уу",
          variant: "destructive"
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Амжилттай гарлаа",
        description: "Та системээс гарлаа",
      });
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Системээс гарах үед алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    }
  };

  const getTitleByUserType = () => {
    switch (userType) {
      case "business":
        return "Бизнес эзний профайл";
      case "delivery":
        return "Хүргэлтийн жолоочийн профайл";
      default:
        return "Хэрэглэгчийн профайл";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {getTitleByUserType()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Нэр</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны нэр"
              />
            </div>
            <div>
              <Label htmlFor="email">Имэйл</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Утасны дугаар</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="99112233"
              />
            </div>
            {userType === "delivery" && (
              <>
                <div>
                  <Label htmlFor="vehicle">Тээврийн хэрэгсэл</Label>
                  <Input
                    id="vehicle"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="Мотоцикл, Машин..."
                  />
                </div>
                <div className="sm:col-span-2 mt-4">
                  <Label htmlFor="vehicle-image" className="block mb-2">
                    Тээврийн хэрэгслийн зураг
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      {vehicleImage ? (
                        <img 
                          src={vehicleImage} 
                          alt="Vehicle" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="vehicle-image"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="mb-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Зураг оруулах
                      </Button>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, GIF зургууд (max. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpdateProfile}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Хадгалах
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Төлбөрийн мэдээлэл
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="card-number">Картын дугаар</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </div>
            <div>
              <Label htmlFor="card-name">Карт эзэмшигчийн нэр</Label>
              <Input
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="LASTNAME FIRSTNAME"
              />
            </div>
            <div>
              <Label htmlFor="card-expiry">Хүчинтэй хугацаа</Label>
              <Input
                id="card-expiry"
                value={cardExpiry}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  if (value.length <= 4) {
                    let formatted = value;
                    if (value.length > 2) {
                      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
                    }
                    setCardExpiry(formatted);
                  }
                }}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSavePaymentMethod}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Хадгалах
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Нууц үг солих
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="current-password">Одоогийн нууц үг</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="new-password">Шинэ нууц үг</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Шинэ нууц үг давтах</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpdatePassword}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Нууц үг шинэчлэх
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="px-6"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Системээс гарах
        </Button>
      </div>
    </div>
  );
}