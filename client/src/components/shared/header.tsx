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
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  User, 
  LogOut, 
  Store, 
  Truck, 
  ShoppingBag 
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
  
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigate("/")}>
            <div className="flex items-center">
              <span className="font-bold text-xl text-primary">GobiGo</span>
              <span className="ml-1 text-gray-500 text-sm">Хүргэлт</span>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              onClick={() => handleNavigate("/")}
            >
              <ShoppingBag className="h-4 w-4" />
              Захиалах
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              onClick={() => handleNavigate("/dashboard/store")}
            >
              <Store className="h-4 w-4" />
              Бизнес эзэд
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2" 
              onClick={() => handleNavigate("/dashboard/driver")}
            >
              <Truck className="h-4 w-4" />
              Хүргэлт
            </Button>
          </nav>
          
          {/* User menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleNavigate("/profile/user")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Хэрэглэгч</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/profile/business")}>
                  <Store className="mr-2 h-4 w-4" />
                  <span>Бизнес</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/profile/driver")}>
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Жолооч</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Гарах</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="mt-8 flex flex-col space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/")}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Захиалах
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/dashboard/store")}
                  >
                    <Store className="h-5 w-5" />
                    Бизнес эзэд
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/dashboard/driver")}
                  >
                    <Truck className="h-5 w-5" />
                    Хүргэлт
                  </Button>
                  
                  <hr className="my-4" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/profile/user")}
                  >
                    <User className="h-5 w-5" />
                    Хэрэглэгчийн профайл
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/profile/business")}
                  >
                    <Store className="h-5 w-5" />
                    Бизнесийн профайл
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/profile/driver")}
                  >
                    <Truck className="h-5 w-5" />
                    Жолоочийн профайл
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start flex items-center gap-3" 
                    onClick={() => handleNavigate("/login")}
                  >
                    <LogOut className="h-5 w-5" />
                    Гарах
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}