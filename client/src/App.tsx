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

function Router() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    // If user is logged in and trying to access login/register page, redirect to dashboard
    if (user && (location === "/login" || location === "/register" || location === "/")) {
      const role = user.role || "customer";
      if (role === "customer") {
        setLocation("/profile/user");
      } else if (role === "business") {
        setLocation("/dashboard/store");
      } else if (role === "delivery") {
        setLocation("/dashboard/driver");
      }
    }

    // If user is not logged in and trying to access protected pages, redirect to login
    if (!user && location !== "/login" && location !== "/register") {
      setLocation("/login");
    }
  }, [user, loading, location, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile/user" component={UserProfile} />
      <Route path="/dashboard/store" component={BusinessProfile} />
      <Route path="/dashboard/driver" component={DriverProfile} />
      <Route component={NotFound} />
    </Switch>
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
