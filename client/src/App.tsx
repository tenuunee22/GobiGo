import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { useEffect } from "react";
import { Header } from "@/components/shared/header-fixed";
import { OnboardingProvider } from "@/components/onboarding/onboarding-context";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import OnboardingHintButton from "@/components/onboarding/OnboardingHintButton";
import { BouncingLoader } from "@/components/ui/bouncing-loader";

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
import Cart from "@/pages/cart";
import TooltipExample from "@/pages/tooltip-example";
import Settings from "@/pages/settings";
import LoadingDemo from "@/pages/loading-demo";

// Customer components
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

// Business components
import { BusinessDashboard } from "@/components/business/business-dashboard"; 

// Delivery components
import { DeliveryDashboard } from "@/components/delivery/delivery-dashboard";

// Auth components
import { RoleSelection } from "@/components/auth/role-selection";

function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    // Redirect based on user role
    if (user && location === "/") {
      switch(user.role) {
        case "business":
          setLocation("/dashboard/store");
          break;
        case "delivery":
          setLocation("/dashboard/driver");
          break;
        case "customer":
          setLocation("/dashboard");
          break;
        default:
          // Default dashboard for customers or users with unspecified roles
          setLocation("/dashboard");
      }
    }
  }, [user, loading, location, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BouncingLoader 
          text="Ачааллаж байна..." 
          size="lg" 
          showBackground={true}
        />
      </div>
    );
  }

  // Determine which dashboard to show based on user role
  const DashboardComponent = () => {
    if (!user) return <CustomerDashboard />; // Non-authenticated users see customer view
    
    switch(user.role) {
      case "business":
        return <BusinessDashboard />;
      case "delivery":
        return <DeliveryDashboard />;
      case "customer":
      default:
        return <CustomerDashboard />;
    }
  };

  // Custom route guard to check user roles
  const ProtectedBusinessRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) => {
    const userIsBusinessOwner = user?.role === "business";
    
    return (
      <Route
        {...rest}
        component={userIsBusinessOwner ? Component : () => <NotFound />}
      />
    );
  };
  
  return (
    <div className="page-transition p-1">
      <Switch>
        <Route path="/" component={DashboardComponent} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={CustomerDashboard} />
        <Route path="/profile/user" component={UserProfile} />
        <Route path="/profile/business" component={BusinessProfile} />
        <Route path="/profile/driver" component={DriverProfile} />
        <ProtectedBusinessRoute path="/dashboard/store" component={BusinessDashboard} />
        <Route path="/dashboard/driver" component={DeliveryDashboard} />
        <Route path="/restaurant/:id" component={RestaurantDetail} />
        <Route path="/order/:id" component={OrderDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/role-selection" component={RoleSelection} />
        <Route path="/orders" component={CustomerDashboard} />
        <Route path="/search" component={CustomerDashboard} />
        <Route path="/cart" component={Cart} />
        <Route path="/tooltip-example" component={TooltipExample} />
        <ProtectedBusinessRoute path="/business-orders" component={BusinessDashboard} />
        <Route path="/earnings" component={CustomerDashboard} />
        <Route path="/delivery-history" component={DeliveryDashboard} />
        <ProtectedBusinessRoute path="/products" component={BusinessDashboard} />
        <Route path="/settings" component={Settings} />
        <Route path="/loading-demo" component={LoadingDemo} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const [location] = useLocation();
  const { needsRoleSelection, loading } = useAuth();
  const isLoginPage = location === "/login" || location === "/register";
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <OnboardingProvider>
          <div className="flex flex-col min-h-screen">
            {!isLoginPage && !needsRoleSelection && <Header />}
            <main className="flex-grow">
              {needsRoleSelection && !loading ? <RoleSelection /> : <Router />}
            </main>
            {!isLoginPage && !needsRoleSelection && <OnboardingModal />}
            {!isLoginPage && !needsRoleSelection && <OnboardingHintButton position="bottom-right" />}
          </div>
          <Toaster />
        </OnboardingProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
