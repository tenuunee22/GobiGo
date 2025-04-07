import { useAuth } from "@/contexts/auth-context";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">GobiGo</a>
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700 p-1" aria-label="Notifications">
                <Bell className="h-6 w-6" />
                {/* Notification indicator */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <span className="hidden md:block mr-2">{user.name || user.displayName}</span>
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {(user.name || user.displayName || 'U').charAt(0).toUpperCase()}
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  {user.role === "customer" && (
                    <Link href="/profile/user">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    </Link>
                  )}
                  {user.role === "business" && (
                    <Link href="/dashboard/store">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Business Dashboard</a>
                    </Link>
                  )}
                  {user.role === "delivery" && (
                    <Link href="/dashboard/driver">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delivery Dashboard</a>
                    </Link>
                  )}
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
