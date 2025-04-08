import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { BusinessDashboard } from "@/components/business/business-dashboard";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
export default function BusinessDashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (user && user.role !== "business") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-gray-500">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }
  return <BusinessDashboard />;
}
