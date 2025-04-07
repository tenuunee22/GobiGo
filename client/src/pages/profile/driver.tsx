import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { DeliveryDashboard } from "@/components/dashboard/delivery-dashboard";

export default function DriverProfile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLocation("/login");
    } else if (user.role !== "delivery") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "customer") {
        setLocation("/profile/user");
      } else if (user.role === "business") {
        setLocation("/dashboard/store");
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== "delivery") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <DeliveryDashboard />
      </main>
      
      <Footer />
    </div>
  );
}
