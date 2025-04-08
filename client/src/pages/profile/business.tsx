import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserData, updateBusinessProfile, uploadFile } from "@/lib/firebase";
import { LocationPicker } from "@/components/business/location-picker";
import { FileUpload } from "@/components/shared/file-upload";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Store, ImageIcon, MapPin, Settings } from "lucide-react";
import { BusinessDashboard } from "@/components/business/business-dashboard";
export default function BusinessProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("restaurant");
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    async function loadBusinessData() {
      if (user && user.uid) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setBusinessName(userData.businessName || "");
            setDescription(userData.description || "");
            setCategory(userData.category || "restaurant");
            if (userData.location) {
              setLocation(userData.location);
            }
            if (userData.logoUrl) {
              setLogoImage(userData.logoUrl);
            }
            if (userData.coverUrl) {
              setCoverImage(userData.coverUrl);
            }
          }
        } catch (error) {
          console.error("Error loading business data:", error);
        }
      }
    }
    loadBusinessData();
  }, [user]);
  const handleLogoUpload = async (file: File) => {
    if (!user || !user.uid) return;
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'logos');
      await updateBusinessProfile(user.uid, { logoUrl: downloadUrl });
      setLogoImage(downloadUrl);
      toast({
        title: "Лого амжилттай оруулсан",
        description: "Таны бизнесийн лого амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Лого оруулахад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleCoverUpload = async (file: File) => {
    if (!user || !user.uid) return;
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'covers');
      await updateBusinessProfile(user.uid, { coverUrl: downloadUrl });
      setCoverImage(downloadUrl);
      toast({
        title: "Ковер зураг амжилттай оруулсан",
        description: "Таны бизнесийн үндсэн зураг амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Зураг оруулахад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleInfoUpdate = async () => {
    if (!user || !user.uid) return;
    try {
      await updateBusinessProfile(user.uid, {
        businessName,
        description,
        category
      });
      toast({
        title: "Мэдээлэл шинэчлэгдлээ",
        description: "Таны бизнесийн мэдээлэл амжилттай шинэчлэгдлээ",
      });
    } catch (error) {
      console.error("Error updating business info:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Мэдээлэл шинэчлэхэд алдаа гарлаа",
        variant: "destructive"
      });
    }
  };
  const handleLocationChange = async (newLocation: { lat: number; lng: number; address: string }) => {
    if (!user || !user.uid) return;
    try {
      await updateBusinessProfile(user.uid, { location: newLocation });
      setLocation(newLocation);
      toast({
        title: "Байршил шинэчлэгдлээ",
        description: "Таны бизнесийн байршил амжилттай шинэчлэгдлээ",
      });
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Байршил шинэчлэхэд алдаа гарлаа",
        variant: "destructive"
      });
    }
  };
  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Бизнес
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Зураг
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Байршил
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Тохиргоо
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <BusinessDashboard />
        </TabsContent>
        <TabsContent value="images">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Бизнесийн лого</CardTitle>
                  <CardDescription>
                    Таны бизнесийн лого. Зөвлөмж: 1:1 харьцаатай зураг байвал сайн.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleLogoUpload}
                      previewUrl={logoImage}
                      label="Бизнесийн лого"
                      onFileRemove={() => {}}
                      setError={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Бизнесийн ковер зураг</CardTitle>
                  <CardDescription>
                    Таны бизнесийн үндсэн зураг. Дэлгэцийн хэмжээтэй тохирсон өргөн зураг сонгоорой.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleCoverUpload}
                      previewUrl={coverImage}
                      label="Бизнесийн ковер зураг"
                      onFileRemove={() => {}}
                      setError={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
