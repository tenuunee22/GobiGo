import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserData, updateBusinessProfile, uploadFile } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/shared/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Car, Settings, User2 } from "lucide-react";
import { DeliveryDashboard } from "@/components/delivery/delivery-dashboard";
export default function DriverProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [vehicleImage, setVehicleImage] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  useEffect(() => {
    async function loadUserData() {
      if (user && user.uid) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            if (userData.profileImage) {
              setProfileImage(userData.profileImage);
            }
            if (userData.vehicleImage) {
              setVehicleImage(userData.vehicleImage);
            }
            if (userData.name) {
              setName(userData.name);
            }
            if (userData.phoneNumber) {
              setPhoneNumber(userData.phoneNumber);
            }
            if (userData.licenseNumber) {
              setLicenseNumber(userData.licenseNumber);
            }
            if (userData.vehicleType) {
              setVehicleType(userData.vehicleType);
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    }
    loadUserData();
  }, [user]);
  const handleProfileImageUpload = async (file: File) => {
    if (!user || !user.uid) return;
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'profile');
      await updateBusinessProfile(user.uid, { profileImage: downloadUrl });
      setProfileImage(downloadUrl);
      toast({
        title: "Профайл зураг амжилттай оруулсан",
        description: "Таны профайл зураг амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Зураг оруулахад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleVehicleImageUpload = async (file: File) => {
    if (!user || !user.uid) return;
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'vehicles');
      await updateBusinessProfile(user.uid, { vehicleImage: downloadUrl });
      setVehicleImage(downloadUrl);
      toast({
        title: "Машины зураг амжилттай оруулсан",
        description: "Таны машины зураг амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Error uploading vehicle image:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Зураг оруулахад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleProfileUpdate = async () => {
    if (!user || !user.uid) return;
    try {
      await updateBusinessProfile(user.uid, {
        name,
        phoneNumber,
        licenseNumber,
        vehicleType
      });
      toast({
        title: "Мэдээлэл шинэчлэгдлээ",
        description: "Таны хувийн мэдээлэл амжилттай шинэчлэгдлээ",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Мэдээлэл шинэчлэхэд алдаа гарлаа",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Хүргэлт
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <User2 className="h-4 w-4" />
            Профайл зураг
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Тохиргоо
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DeliveryDashboard />
        </TabsContent>
        <TabsContent value="images">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Профайл зураг</CardTitle>
                  <CardDescription>
                    Таны профайл зураг. Заавал талбайн хэмжээтэй квадрат зураг (1:1 харьцаатай) байх шаардлагатай.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleProfileImageUpload}
                      previewUrl={profileImage}
                      label="Профайл зураг оруулах (1:1 харьцаатай)"
                      maxSizeMB={2}
                      disabled={isUploading}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Санамж: Таны нүүр хэсэг харагдахуйц зураг оруулна уу.
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Машины зураг</CardTitle>
                  <CardDescription>
                    Таны хүргэлтийн машин/мотоцикл/дугуйн зураг. Хажуу талаас авсан зураг байвал зүгээр.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleVehicleImageUpload}
                      previewUrl={vehicleImage}
                      label="Машины зураг оруулах"
                      maxSizeMB={3}
                      disabled={isUploading}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Санамж: Машины улсын дугаар харагдахгүй зураг сонгоно уу.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Хувийн мэдээлэл</CardTitle>
                <CardDescription>
                  Хүргэлтийн ажилтны үндсэн мэдээлэл
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Бүтэн нэр</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Нэрээ оруулна уу"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Утасны дугаар</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="88001234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license">Жолооны үнэмлэхний дугаар</Label>
                    <Input
                      id="license"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="1234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-type">Тээврийн хэрэгслийн төрөл</Label>
                    <Select 
                      value={vehicleType} 
                      onValueChange={setVehicleType}
                    >
                      <SelectTrigger id="vehicle-type">
                        <SelectValue placeholder="Тээврийн хэрэгслийн төрөл сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Машин</SelectItem>
                        <SelectItem value="motorcycle">Мотоцикл</SelectItem>
                        <SelectItem value="bicycle">Дугуй</SelectItem>
                        <SelectItem value="scooter">Скутер</SelectItem>
                        <SelectItem value="foot">Явган</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="mt-2"
                    onClick={handleProfileUpdate}
                    disabled={isUploading}
                  >
                    Хадгалах
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
