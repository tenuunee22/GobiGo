import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

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

  useEffect(() => {
    if (loading) return;

    // In this build, we'll skip authentication logic to allow easy testing 
    // of different user role interfaces
  }, [user, loading, location, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Ачааллаж байна...</div>;
  }

  return (
    <div className="page-transition">
      <Switch>
        <Route path="/" component={CustomerDashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/profile/user" component={UserProfile} />
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
