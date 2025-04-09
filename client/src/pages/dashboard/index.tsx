import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { BusinessDashboard } from "@/components/dashboard/business-dashboard";
import { DeliveryDashboard } from "@/components/dashboard/delivery-dashboard";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {user.role === "customer" && <CustomerDashboard />}
        {user.role === "business" && <BusinessDashboard />}
        {user.role === "delivery" && <DeliveryDashboard />}
      </main>
      
      <Footer />
    </div>
  );
}
