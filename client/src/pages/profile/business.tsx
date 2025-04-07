import { UserProfileSettings } from "@/components/shared/user-profile-settings";
import { BusinessDashboard } from "@/components/business/business-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag, Settings } from "lucide-react";

export default function BusinessProfile() {
  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Бизнес
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Тохиргоо
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <BusinessDashboard />
        </TabsContent>
        
        <TabsContent value="settings">
          <UserProfileSettings userType="business" />
        </TabsContent>
      </Tabs>
    </div>
  );
}