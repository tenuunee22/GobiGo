import { UserProfileSettings } from "@/components/shared/user-profile-settings";
import { BusinessDashboard } from "@/components/business/business-dashboard";
import { LocationPicker } from "@/components/business/location-picker";
import { FileUpload } from "@/components/shared/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag, Settings, MapPin, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { updateBusinessLocation, getUserData, updateBusinessProfile, uploadFile } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function BusinessProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [businessLocation, setBusinessLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  
  // Load saved location and images when component mounts
  useEffect(() => {
    async function loadUserData() {
      if (user && user.uid) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            // Load location
            if (userData.location) {
              setBusinessLocation(userData.location);
            }
            
            // Load images
            if (userData.logoUrl) {
              setLogoUrl(userData.logoUrl);
            }
            
            if (userData.bannerUrl) {
              setBannerUrl(userData.bannerUrl);
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    }
    
    loadUserData();
  }, [user]);

  // Handler for when location changes
  const handleLocationChange = async (location: { lat: number; lng: number; address: string }) => {
    setBusinessLocation(location);
    
    // If user is logged in, save location to Firestore
    if (user && user.uid) {
      try {
        await updateBusinessLocation(user.uid, location);
        
        toast({
          title: "Байршил хадгалагдлаа",
          description: "Таны бизнесийн байршил амжилттай хадгалагдлаа",
        });
      } catch (error) {
        console.error("Error saving location:", error);
        toast({
          title: "Алдаа гарлаа",
          description: "Байршил хадгалахад алдаа гарлаа",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    if (!user || !user.uid) return;
    
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'logos');
      
      // Update user profile in Firestore
      await updateBusinessProfile(user.uid, { logoUrl: downloadUrl });
      
      // Update local state
      setLogoUrl(downloadUrl);
      
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
  
  // Handle banner upload
  const handleBannerUpload = async (file: File) => {
    if (!user || !user.uid) return;
    
    setIsUploading(true);
    try {
      const downloadUrl = await uploadFile(user.uid, file, 'banners');
      
      // Update user profile in Firestore
      await updateBusinessProfile(user.uid, { bannerUrl: downloadUrl });
      
      // Update local state
      setBannerUrl(downloadUrl);
      
      toast({
        title: "Зураг амжилттай оруулсан",
        description: "Таны бизнесийн зураг амжилттай хадгалагдлаа",
      });
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Зураг оруулахад алдаа гарлаа",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
            Зургууд
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
              {/* Logo upload section */}
              <Card>
                <CardHeader>
                  <CardTitle>Бизнесийн лого</CardTitle>
                  <CardDescription>
                    Таны бизнесийн лого болон бренд. Заавал талбайн хэмжээтэй квадрат зураг (1:1 харьцаатай) байх шаардлагатай.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleLogoUpload}
                      previewUrl={logoUrl}
                      label="Лого зураг оруулах (1:1 харьцаатай)"
                      maxSizeMB={2}
                      disabled={isUploading}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Санамж: Дөрвөлжин хэлбэртэй, цэвэр зураг сонгох нь хамгийн үр дүнтэй.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Banner upload section */}
              <Card>
                <CardHeader>
                  <CardTitle>Бизнесийн танилцуулга зураг</CardTitle>
                  <CardDescription>
                    Таны бизнесийн үйл ажиллагааг харуулсан зураг. Өргөн тэгш өнцөгт зураг (16:9 харьцаатай) байвал сайн.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={handleBannerUpload}
                      previewUrl={bannerUrl}
                      label="Танилцуулга зураг оруулах"
                      maxSizeMB={5}
                      disabled={isUploading}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Санамж: Таны бизнесийг хамгийн сайн илэрхийлэх зураг сонгох нь зөвлөмж болно.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="location">
          <div className="max-w-4xl mx-auto">
            <LocationPicker 
              initialLocation={businessLocation || undefined}
              onLocationChange={handleLocationChange}
              businessName={user?.businessName || user?.name || ''}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <UserProfileSettings userType="business" />
        </TabsContent>
      </Tabs>
    </div>
  );
}