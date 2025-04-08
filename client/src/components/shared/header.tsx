import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  User, 
  LogOut, 
  Store, 
  Truck, 
  ShoppingBag,
  Pizza,
  Image,
  Camera,
  ClipboardList,
  HelpCircle 
} from "lucide-react";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleNavigate = (path: string) => {
    setLocation(path);
    setIsMenuOpen(false);
  };
  
  const getUserRoleBasedLink = () => {
    if (!user) return "/login";
    
    // This could be extended to check user.role and return different links
    // based on the user's role (customer, business, delivery)
    // For demo purposes, make all role-related pages accessible
    return "/profile/user";
  };
  
  // Хэрэглэгчийн төрлөөс хамаарч харуулах цэсүүд
  const getUserTypeNav = () => {
    const userRole = user?.role || "customer"; // Хэрэглэгчийн төрөл
    
    switch (userRole) {
      case "business":
        return (
          <>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/dashboard/store")}
            >
              <Store className="h-4 w-4" />
              Бараа бүтээгдэхүүн
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/profile/business")}
            >
              <User className="h-4 w-4" />
              Тохиргоо
            </Button>
          </>
        );
      case "delivery":
        return (
          <>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/dashboard/driver")}
            >
              <Truck className="h-4 w-4" />
              Хүргэлтүүд
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/profile/driver")}
            >
              <User className="h-4 w-4" />
              Тохиргоо
            </Button>
          </>
        );
      default: // customer
        return (
          <>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/")}
            >
              <ShoppingBag className="h-4 w-4" />
              Захиалах
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-white hover:bg-white/20" 
              onClick={() => handleNavigate("/profile/user")}
            >
              <User className="h-4 w-4" />
              Тохиргоо
            </Button>
          </>
        );
    }
  };
  
  // Мобайл хэсэгт харуулах цэсүүд
  const getMobileMenuItems = () => {
    // Үндсэн цэсүүд бүх хэрэглэгчид харагдана
    const baseMenuItems = (
      <>
        <div className="my-2 text-sm font-medium text-gray-500 uppercase">
          Үндсэн цэс
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start flex items-center gap-3" 
          onClick={() => handleNavigate("/")}
        >
          <ShoppingBag className="h-5 w-5" />
          Захиалах
        </Button>
      </>
    );
    
    // If not logged in, show only login button
    if (!user) {
      return (
        <>
          {baseMenuItems}
          <hr className="my-4" />
          <Button 
            variant="ghost" 
            className="w-full justify-start flex items-center gap-3" 
            onClick={() => handleNavigate("/login")}
          >
            <User className="h-5 w-5" />
            Нэвтрэх
          </Button>
        </>
      );
    }
    
    // Хэрэглэгчийн төрлөөс хамаарч харагдах нэмэлт цэсүүд
    const userRole = user.role || "customer";
    let roleMenuItems;
    
    switch (userRole) {
      case "business":
        roleMenuItems = (
          <>
            <div className="my-2 text-sm font-medium text-gray-500 uppercase mt-4">
              Бизнесийн цэс
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/dashboard/store")}
            >
              <Store className="h-5 w-5" />
              Бараа бүтээгдэхүүн
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/profile/business")}
            >
              <User className="h-5 w-5" />
              Тохиргоо
            </Button>
          </>
        );
        break;
      case "delivery":
        roleMenuItems = (
          <>
            <div className="my-2 text-sm font-medium text-gray-500 uppercase mt-4">
              Хүргэлтийн цэс
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/dashboard/driver")}
            >
              <Truck className="h-5 w-5" />
              Хүргэлтүүд
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/profile/driver")}
            >
              <User className="h-5 w-5" />
              Тохиргоо
            </Button>
          </>
        );
        break;
      default: // customer
        roleMenuItems = (
          <>
            <div className="my-2 text-sm font-medium text-gray-500 uppercase mt-4">
              Хэрэглэгчийн цэс
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/profile/user")}
            >
              <User className="h-5 w-5" />
              Тохиргоо
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start flex items-center gap-3" 
              onClick={() => handleNavigate("/order/history")}
            >
              <ClipboardList className="h-5 w-5" />
              Захиалгын түүх
            </Button>
          </>
        );
    }
    
    return (
      <>
        {baseMenuItems}
        {roleMenuItems}
        <hr className="my-4" />
        <Button 
          variant="ghost" 
          className="w-full justify-start flex items-center gap-3" 
          onClick={() => {
            // Reset onboarding to see again
            localStorage.removeItem('onboardingComplete');
            window.location.reload();
          }}
        >
          <HelpCircle className="h-5 w-5" />
          Танилцуулга харах
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start flex items-center gap-3" 
          onClick={() => handleNavigate("/login")}
        >
          <LogOut className="h-5 w-5" />
          Гарах
        </Button>
      </>
    );
  };

  return (
    <header className="header-gradient text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigate("/")}>
            <div className="flex items-center">
              <span className="font-bold text-xl text-white">GobiGo</span>
              <span className="ml-1 text-gray-200 text-sm">Хүргэлт</span>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            {getUserTypeNav()}
          </nav>
          
          {/* User menu - only show when logged in */}
          {user ? (
            <div className="hidden md:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full text-white hover:bg-white/20">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === "customer" ? (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigate("/profile/user")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Хувийн мэдээлэл</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigate("/order/history")}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        <span>Өмнөх захиалгууд</span>
                      </DropdownMenuItem>
                    </>
                  ) : user.role === "business" ? (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigate("/profile/business")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Бизнесийн мэдээлэл</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigate("/dashboard/store")}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Барааны жагсаалт</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigate("/profile/driver")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Хувийн мэдээлэл</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigate("/dashboard/driver")}>
                        <Truck className="mr-2 h-4 w-4" />
                        <span>Хүргэлтүүд</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    // Reset onboarding to see again
                    localStorage.removeItem('onboardingComplete');
                    window.location.reload();
                  }}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Танилцуулга харах</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/login")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Гарах</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={() => handleNavigate("/login")}
              >
                Нэвтрэх
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="mt-8 flex flex-col space-y-3">
                  {getMobileMenuItems()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}