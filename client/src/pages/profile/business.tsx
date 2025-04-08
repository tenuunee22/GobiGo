import { UserProfileSettings } from "@/components/shared/user-profile-settings";
import { BusinessDashboard } from "@/components/business/business-dashboard";
import { LocationPicker } from "@/components/business/location-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag, Settings, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { updateBusinessLocation, getUserData } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function BusinessProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [businessLocation, setBusinessLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  
  // Load saved location when component mounts
  useEffect(() => {
    async function loadUserLocation() {
      if (user && user.uid) {
        try {
          const userData = await getUserData(user.uid);
          if (userData && userData.location) {
            setBusinessLocation(userData.location);
          }
        } catch (error) {
          console.error("Error loading location data:", error);
        }
      }
    }
    
    loadUserLocation();
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

  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Бизнес
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