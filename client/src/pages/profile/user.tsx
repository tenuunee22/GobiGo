import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLocation("/login");
    } else if (user.role !== "customer") {
      // Redirect to appropriate dashboard based on role
      if (user.role === "business") {
        setLocation("/dashboard/store");
      } else if (user.role === "delivery") {
        setLocation("/dashboard/driver");
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== "customer") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <CustomerDashboard />
      </main>
      
      <Footer />
    </div>
  );
}
