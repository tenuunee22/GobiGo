import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchBar } from "./search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ChevronDown,
  X
} from "lucide-react";
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
interface SearchResult {
  id: string;
  name: string;
  type: 'restaurant' | 'product';
  imageUrl?: string;
  description?: string;
}
export function Header() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { items: cartItems, removeItem, getTotal, getTotalItems } = useCart();
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
        <Link href="/cart">
          <div className="px-3 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <ShoppingBag size={18} /> Сагс
          </div>
        </Link>
      </NavigationMenuItem>
    </>
  );
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
    </>
  );
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
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchOpen(true);
    setTimeout(() => {
      const mockResults = [
        {
          id: '1',
          name: 'Хүслэн Ресторан',
          type: 'restaurant' as const,
          imageUrl: 'https://example.com/img1.jpg',
          description: 'Монгол үндэсний хоолны ресторан'
        },
        {
          id: '2',
          name: 'Пицца',
          type: 'product' as const,
          imageUrl: 'https://example.com/img2.jpg',
          description: 'Пепперони пицца'
        },
        {
          id: '3',
          name: 'Монгол Амтат',
          type: 'restaurant' as const,
          imageUrl: 'https://example.com/img3.jpg',
          description: 'Үндэсний хоолны газар'
        }
      ];
      const results: SearchResult[] = mockResults.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(results);
    }, 300);
  };
  const handleRemoveFromCart = (id: string) => {
    removeItem(id);
    toast({
      title: "Бүтээгдэхүүн хасагдлаа",
      description: "Сагснаас бүтээгдэхүүн амжилттай хасагдлаа",
    });
  };
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
          {}
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
          {}
          {!isMobile && (
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList className="flex gap-1">
                {desktopNavItems()}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {}
          <div className="flex items-center gap-4">
            {}
            <div className="hidden md:block w-64">
              <SearchBar 
                placeholder="Рестораны нэр, хоол, хүргэлт хайх..." 
                expandOnMobile={false}
              />
            </div>
            {}
            <div className="md:hidden">
              <SearchBar 
                expandOnMobile={true}
              />
            </div>
            {}
            {(user && user.role === 'customer') && (
              <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs">
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <div className="font-medium">Миний захиалгууд</div>
                    <div className="text-sm text-gray-500">{cartItems.length} бүтээгдэхүүн</div>
                  </div>
                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-80 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border-b border-border">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.quantity} x {item.price.toLocaleString()}₮
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:text-red-500"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Нийт дүн</span>
                          <span className="font-bold">{getTotal().toLocaleString()}₮</span>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setIsCartOpen(false);
                            if (cartItems.length > 0) {
                              const order = {
                                id: Date.now().toString(),
                                items: cartItems,
                                totalAmount: getTotal(),
                                date: new Date(),
                              };
                              localStorage.setItem('currentOrder', JSON.stringify(order));
                              if (cartItems.length <= 3) {
                                window.location.href = "/api/stripe-static-checkout";
                              } else {
                                setLocation("/cart");
                              }
                            } else {
                              setLocation("/cart");
                            }
                          }}
                        >
                          Төлбөр хийх
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <div className="text-gray-500">Таны захиалга хоосон байна</div>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setIsCartOpen(false);
                          setLocation("/");
                        }}
                      >
                        Захиалга хийх
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
            {}
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
            {}
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
                    <div className="mb-4">
                      <SearchBar placeholder="Рестораны нэр, хоол, хүргэлт хайх..." expandOnMobile={false} />
                    </div>
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