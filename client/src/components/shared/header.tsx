import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Home,
  User,
  Store,
  LogOut,
  Menu,
  Package,
  Search,
  Clock,
  ShoppingBag,
  DollarSign,
  Car,
  Settings,
  ChevronDown
} from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [greeting, setGreeting] = useState("");
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Өглөөний мэнд");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Өдрийн мэнд");
    } else {
      setGreeting("Оройн мэнд");
    }
  }, []);
  
  // Change header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Амжилттай гарлаа",
        description: "Таны бүртгэлээс гарлаа",
      });
    } catch (error) {
      toast({
        title: "Алдаа гарлаа",
        description: "Гарах үед алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    }
  };

  // Get correct profile link based on user role
  const getProfileLink = () => {
    if (!user) return "/login";
    
    switch (user.role) {
      case "business":
        return "/profile/business";
      case "delivery":
        return "/profile/driver";
      case "customer":
      default:
        return "/profile/user";
    }
  };
  
  // Content for customer
  const customerNav = () => (
    <>
      <NavigationMenuItem>
        <Link href="/dashboard">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Home size={18} /> Нүүр
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/search">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Search size={18} /> Хайх
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/orders">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Clock size={18} /> Захиалгууд
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/cart">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <ShoppingBag size={18} /> Сагс
          </div>
        </Link>
      </NavigationMenuItem>
    </>
  );
  
  // Content for business
  const businessNav = () => (
    <>
      <NavigationMenuItem>
        <Link href="/">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Store size={18} /> Дэлгүүр
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/products">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Package size={18} /> Бүтээгдэхүүн
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/business-orders">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Clock size={18} /> Захиалгууд
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/dashboard/store">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <DollarSign size={18} /> Орлого
          </div>
        </Link>
      </NavigationMenuItem>
    </>
  );
  
  // Content for delivery driver
  const deliveryNav = () => (
    <>
      <NavigationMenuItem>
        <Link href="/dashboard/driver">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Car size={18} /> Хүргэлт
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/delivery-history">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Clock size={18} /> Хүргэлтийн түүх
          </div>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/dashboard/store">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <DollarSign size={18} /> Орлого
          </div>
        </Link>
      </NavigationMenuItem>
    </>
  );
  
  // Mobile drawer content
  const mobileNavItems = () => {
    if (!user) return customerNav();
    
    switch (user.role) {
      case "business":
        return businessNav();
      case "delivery":
        return deliveryNav();
      case "customer":
      default:
        return customerNav();
    }
  };
  
  // Desktop navigation content
  const desktopNavItems = () => {
    if (!user) return customerNav();
    
    switch (user.role) {
      case "business":
        return businessNav();
      case "delivery":
        return deliveryNav();
      case "customer":
      default:
        return customerNav();
    }
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Welcome Message */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xl font-bold text-primary cursor-pointer">GobiGo</span>
            </Link>
            
            {user && (
              <div className="hidden md:block ml-4 text-sm text-gray-600">
                {greeting}, {user.name || user.displayName || "Хэрэглэгч"}!
              </div>
            )}
          </div>
          
          {/* Navigation - Desktop */}
          {!isMobile && (
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex gap-1">
                {desktopNavItems()}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name || user.displayName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(user.name || user.displayName || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={16} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Миний бүртгэл</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getProfileLink()}>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <User size={16} /> Профайл
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Settings size={16} /> Тохиргоо
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut size={16} className="mr-2" /> Гарах
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Нэвтрэх</Link>
              </Button>
            )}
            
            {/* Mobile Menu Trigger */}
            {isMobile && (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>GobiGo</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 py-2 space-y-2">
                    <NavigationMenu className="flex flex-col w-full">
                      <NavigationMenuList className="flex flex-col w-full gap-1">
                        {mobileNavItems()}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Хаах</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}