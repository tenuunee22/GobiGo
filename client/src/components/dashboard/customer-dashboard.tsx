import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBusinesses, getCustomerOrders } from "@/lib/firebase";
import { CategoryCard } from "@/components/customer/category-card";
import { RestaurantCard } from "@/components/customer/restaurant-card";
import { OrderTracking } from "@/components/customer/order-tracking";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/contexts/loading-context";
import { useLocation } from "wouter";
import { Search, Pizza, ShoppingCart, PlusCircle, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FoodLoader } from "@/components/shared/food-loader";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add user location state
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Байршил авахад алдаа гарлаа:", error);
          toast({
            title: "Байршил авах боломжгүй байна",
            description: "Байршлаа идэвхжүүлнэ үү",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        showLoading("Рестораныг ачааллаж байна...", "burger");
        
        // Fetch restaurants/businesses
        const fetchedBusinesses = await getBusinesses();
        
        // Add simulated distance calculation based on user location
        const businessesWithDistance = fetchedBusinesses.map(business => {
          // Randomly generate distances between 0.3 and 5.0 km
          const randomDistance = (Math.random() * 4.7 + 0.3).toFixed(1);
          return {
            ...business,
            distance: `${randomDistance} км зайтай`,
            // In a real app, you would calculate this based on actual coordinates
          };
        });
        
        setBusinesses(businessesWithDistance);
        
        // Fetch active orders if user is logged in
        if (user && user.uid) {
          // Switch the food type for order loading
          showLoading("Захиалгыг ачааллаж байна...", "pizza");
          const orders = await getCustomerOrders(user.uid);
          const active = orders.filter(order => 
            order.status !== "completed" && order.status !== "cancelled"
          );
          setActiveOrders(active);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Өгөгдөл ачааллахад алдаа гарлаа",
          description: "Дахин оролдоно уу",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        hideLoading();
      }
    };
    
    fetchData();
  }, [user, toast, userLocation, showLoading, hideLoading]);

  const categories = [
    { id: "restaurants", name: "Рестораны", icon: <Pizza className="h-6 w-6 text-primary" /> },
    { id: "groceries", name: "Хүнсний дэлгүүр", icon: <ShoppingCart className="h-6 w-6 text-primary" /> },
    { id: "pharmacy", name: "Эмийн сан", icon: <Pill className="h-6 w-6 text-primary" /> },
    { id: "retail", name: "Жижиглэн худалдаа", icon: <PlusCircle className="h-6 w-6 text-primary" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Filter businesses by category
    toast({
      title: `${categoryId} ангилал сонгогдлоо`,
      description: "Ангилалд тохирох газруудыг харуулж байна",
    });
    
    // Show loading animation with noodles food character 
    showLoading("Ангилалын мэдээллийг ачааллаж байна...", "noodles");
    setLoading(true);
    
    // Simulate filtering by adding a small delay
    setTimeout(() => {
      // Filter businesses based on the category
      let filteredBusinesses = [...businesses];
      // In a real app, this would use actual filtering logic
      // For demo purposes, we're just shuffling the array
      filteredBusinesses.sort(() => Math.random() - 0.5);
      setBusinesses(filteredBusinesses);
      setLoading(false);
      hideLoading();
    }, 1200); // Longer delay to show the animation
  };

  const handleRestaurantClick = (businessId: string) => {
    // Show loading animation while navigating
    showLoading("Ресторан руу шилжиж байна...", "burger");
    
    toast({
      title: "Ресторан сонгогдлоо",
      description: "Ресторан руу шилжиж байна...",
    });
    
    // Add slight delay for smooth transition
    setTimeout(() => {
      // Navigate to restaurant detail page
      setLocation(`/restaurant/${businessId}`);
    }, 800);
  };

  // Mock data for order tracking (in a real app, this would come from the database)
  const mockOrderItems = [
    { name: "Бургер Комбо", quantity: 2, price: 9999 },
    { name: "Шарсан төмс", quantity: 1, price: 3990 },
    { name: "Кола", quantity: 1, price: 1990 },
  ];
  
  const mockDriver = {
    id: "driver1",
    name: "Бат-Эрдэнэ",
    arrivalTime: "10-15 минут"
  };
  
  // Test animation by changing status
  const [demoStatus, setDemoStatus] = useState<"placed" | "preparing" | "on-the-way" | "delivered">("placed");
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeOrders.length > 0) {
      // Auto cycle through statuses for demo purposes
      timer = setTimeout(() => {
        switch (demoStatus) {
          case "placed":
            setDemoStatus("preparing");
            break;
          case "preparing":
            setDemoStatus("on-the-way");
            break;
          case "on-the-way":
            setDemoStatus("delivered");
            break;
          case "delivered":
            // Reset after 5 seconds in delivered state
            setTimeout(() => setDemoStatus("placed"), 5000);
            break;
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [demoStatus, activeOrders.length]);

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="bg-primary rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-12 md:px-12 text-white md:flex justify-between items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Өлссөн үү? Бид таны төлөө бэлэн</h2>
              <p className="text-xl mb-6">Хоолоо хэдхэн минутын дотор хүлээн авна</p>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Рестораны, хоол, бараа бүтээгдэхүүн хайх..."
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      // Show donut character during search
                      showLoading(`"${searchQuery}" гэж хайж байна...`, "donut");
                      setLoading(true);
                      toast({
                        title: "Хайлт",
                        description: `"${searchQuery}" гэж хайж байна...`
                      });
                      
                      // Simulate search delay
                      setTimeout(() => {
                        // Filter businesses based on search query (case-insensitive)
                        const filtered = [...businesses].filter(business => 
                          (business.name || business.businessName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (business.category || business.businessType || "").toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        
                        setBusinesses(filtered.length ? filtered : businesses);
                        setLoading(false);
                        hideLoading();
                      }, 1000);
                    }
                  }}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 md:flex md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="Хоол хүргэлт" 
                className="rounded-lg w-full md:max-w-xs shadow-lg" 
              />
            </div>
          </div>
        </div>
        
        {/* Categories section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ангилалууд</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </section>
        
        {/* Restaurants section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Алдартай рестораны</h2>
            <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium">Бүгдийг харах</a>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow h-72 flex flex-col">
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <FoodLoader 
                      foodType={i === 1 ? "burger" : i === 2 ? "pizza" : "noodles"} 
                      text="" 
                      size="medium" 
                    />
                  </div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.length > 0 ? (
                businesses.map((business) => (
                  <RestaurantCard
                    key={business.id}
                    id={business.id}
                    name={business.businessName || business.name}
                    imageUrl={business.imageUrl}
                    category={business.businessType || "Ресторан"}
                    subCategory={business.cuisine || ""}
                    distance={business.distance || "1.3 км зайтай"}
                    rating={business.rating || 4.8}
                    deliveryFee={business.deliveryFee || 0}
                    estimatedTime={business.estimatedTime || "25-35 мин"}
                    onClick={() => handleRestaurantClick(business.id)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">Ресторан олдсонгүй. Хайлтаа өөрчилж үзнэ үү.</p>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Active order tracking section with demo status animation */}
        {(activeOrders.length > 0 || true) ? ( // Force show order for demo
          <OrderTracking
            orderId={activeOrders.length > 0 ? activeOrders[0].id : "demo-123"}
            status={demoStatus}
            driver={mockDriver}
            items={mockOrderItems}
            subtotal={23970}
            deliveryFee={2490}
            total={26460}
          />
        ) : null}
      </div>
    </div>
  );
}
