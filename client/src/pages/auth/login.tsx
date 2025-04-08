import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { PhoneLoginForm } from "@/components/auth/phone-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  // If showing registration, just show the registration form
  if (!showLogin) {
    return <RegisterForm onToggleForm={toggleForm} />;
  }

  // For login, show tabs between email and phone login
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs
        defaultValue="email"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "email" | "phone")}
        className="max-w-md mx-auto"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="email">Имэйлээр нэвтрэх</TabsTrigger>
          <TabsTrigger value="phone">Утсаар нэвтрэх</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <LoginForm onToggleForm={toggleForm} />
        </TabsContent>
        <TabsContent value="phone">
          <PhoneLoginForm onToggleForm={toggleForm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
