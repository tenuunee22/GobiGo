import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Header } from "@/components/shared/header";
import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import { LoadingProvider } from "@/contexts/loading-context";
import { FoodLoader } from "@/components/shared/food-loader";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import OnboardingHintButton from "@/components/onboarding/OnboardingHintButton";

// Pages
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard/index";
import UserProfile from "@/pages/profile/user";
import BusinessProfile from "@/pages/profile/business";
import DriverProfile from "@/pages/profile/driver";
import RestaurantDetail from "@/pages/restaurant/[id]";
import OrderDetail from "@/pages/order/[id]";
import Checkout from "@/pages/checkout";

// Customer components
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

// Business components
import { BusinessDashboard } from "@/components/business/business-dashboard"; 

// Delivery components
import { DeliveryDashboard } from "@/components/delivery/delivery-dashboard";

function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Handle protected routes
  useEffect(() => {
    if (loading) return;

    const currentPath = location;
    
    // Protect profile and dashboard routes for non-authenticated users
    if (!user) {
      const protectedPaths = [
        '/profile', 
        '/dashboard',
        '/order',
        '/checkout'
      ];
      
      // Check if current location is a protected path
      const isProtectedPath = protectedPaths.some(path => 
        currentPath.startsWith(path)
      );
      
      // Redirect to login if trying to access protected routes while not logged in
      if (isProtectedPath && currentPath !== '/login') {
        setLocation('/login');
      }
    }
  }, [user, loading, location, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FoodLoader text="Ачааллаж байна..." foodType="random" size="large" />
      </div>
    );
  }

  return (
    <div className="page-transition p-1">
      <Switch>
        <Route path="/" component={CustomerDashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/profile/user" component={UserProfile} />
        <Route path="/profile/business" component={BusinessProfile} />
        <Route path="/profile/driver" component={DriverProfile} />
        <Route path="/dashboard/store" component={BusinessDashboard} />
        <Route path="/dashboard/driver" component={DeliveryDashboard} />
        <Route path="/restaurant/:id" component={RestaurantDetail} />
        <Route path="/order/:id" component={OrderDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <OnboardingProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <OnboardingModal />
            <OnboardingHintButton position="bottom-right" />
          </div>
          <Toaster />
        </OnboardingProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

export default App;
