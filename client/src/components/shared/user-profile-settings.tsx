import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { LogOut, CheckCircle, Mail, Phone, User, Key } from "lucide-react";
import { changeUserPassword, logoutUser, updateUserProfile } from "@/lib/firebase";

interface UserProfileSettingsProps {
  userType?: "customer" | "business" | "delivery";
}

export function UserProfileSettings({ userType = "customer" }: UserProfileSettingsProps) {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleUpdateProfile = () => {
    // In a real app, this would update the profile in the database
    if (user) {
      setUser({
        ...user,
        displayName: name,
        email: email,
        phone: phone
      });
      
      toast({
        title: "Профайл шинэчлэгдлээ",
        description: "Таны мэдээлэл амжилттай шинэчлэгдлээ",
      });
    }
  };
  
  const handleUpdatePassword = async () => {
    // Basic validation
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
      // Call the Firebase function to change password
      await changeUserPassword(currentPassword, newPassword);
      
      toast({
        title: "Нууц үг шинэчлэгдлээ",
        description: "Таны нууц үг амжилттай шинэчлэгдлээ",
      });
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      
      // Handle specific Firebase Auth errors
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
        // Logout the user and redirect to login page
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
      
      // Navigate to login page
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
              <div>
                <Label htmlFor="vehicle">Тээврийн хэрэгсэл</Label>
                <Input
                  id="vehicle"
                  placeholder="Мотоцикл, Машин..."
                />
              </div>
            )}
            
            {userType === "customer" && (
              <>
                <div className="sm:col-span-2">
                  <Label htmlFor="primaryAddress">Гэрийн хаяг</Label>
                  <Input
                    id="primaryAddress"
                    value={user?.primaryAddress || ""}
                    onChange={(e) => setUser({...user, primaryAddress: e.target.value})}
                    placeholder="Дүүрэг, хороо, байр, орц, давхар, тоот..."
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="secondaryAddress">Хоёрдогч хаяг</Label>
                  <Input
                    id="secondaryAddress"
                    value={user?.secondaryAddress || ""}
                    onChange={(e) => setUser({...user, secondaryAddress: e.target.value})}
                    placeholder="Өөр газар дахь хаяг..."
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label htmlFor="workAddress">Ажлын хаяг</Label>
                  <Input
                    id="workAddress"
                    value={user?.workAddress || ""}
                    onChange={(e) => setUser({...user, workAddress: e.target.value})}
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