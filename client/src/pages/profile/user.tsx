import { UserProfileSettings } from "@/components/shared/user-profile-settings";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShoppingBasket, Settings } from "lucide-react";
export default function UserProfile() {
  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <ShoppingBasket className="h-4 w-4" />
            Захиалга
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Тохиргоо
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <CustomerDashboard />
        </TabsContent>
        <TabsContent value="settings">
          <UserProfileSettings userType="customer" />
        </TabsContent>
      </Tabs>
    </div>
  );
}