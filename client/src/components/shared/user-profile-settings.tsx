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
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploadingImage ? "Хуулж байна..." : "Зураг оруулах"}
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG, GIF зэрэг форматууд дэмжигдэнэ.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {userType === "customer" && (
              <>
                <div className="sm:col-span-2">
                  <Label htmlFor="primaryAddress">Гэрийн хаяг</Label>
                  <Input
                    id="primaryAddress"
                    value={user?.primaryAddress || ""}
                    onChange={(e) => setUser(current => current ? {...current, primaryAddress: e.target.value} : null)}
                    placeholder="Дүүрэг, хороо, байр, орц, давхар, тоот..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="secondaryAddress">Хоёрдогч хаяг</Label>
                  <Input
                    id="secondaryAddress"
                    value={user?.secondaryAddress || ""}
                    onChange={(e) => setUser(current => current ? {...current, secondaryAddress: e.target.value} : null)}
                    placeholder="Өөр газар дахь хаяг..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="workAddress">Ажлын хаяг</Label>
                  <Input
                    id="workAddress"
                    value={user?.workAddress || ""}
                    onChange={(e) => setUser(current => current ? {...current, workAddress: e.target.value} : null)}
                    placeholder="Ажлын газрын хаяг..."
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdateProfile}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Профайл шинэчлэх
            </Button>
          </div>
        </CardContent>
      </Card>
      {userType === "customer" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Төлбөрийн мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Картын дугаар</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="0000 0000 0000 0000"
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Картын эзэмшигчийн нэр</Label>
              <Input
                id="card-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Нэр"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Хүчинтэй хугацаа</Label>
                <Input
                  id="card-expiry"
                  value={cardExpiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 2) {
                      setCardExpiry(value);
                    } else {
                      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                    }
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVV/CVC</Label>
                <Input
                  id="card-cvc"
                  type="password"
                  maxLength={3}
                  placeholder="***"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSavePaymentMethod}>
                Төлбөрийн мэдээлэл хадгалах
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Нууц үг солих
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Одоогийн нууц үг</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Шинэ нууц үг</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Нууц үг давтах</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdatePassword}>
              Нууц үг шинэчлэх
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Системээс гарах
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Та системээс гарахдаа итгэлтэй байна уу? Гарсны дараа дахин нэвтрэх шаардлагатай болно.
          </p>
          <Button variant="destructive" onClick={handleLogout}>
            Системээс гарах
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}