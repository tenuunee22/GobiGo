import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBusinesses, getCustomerOrders } from "@/lib/firebase";
import { CategoryCard } from "@/components/customer/category-card";
import { RestaurantCard } from "@/components/customer/restaurant-card";
import { OrderTracking } from "@/components/customer/order-tracking";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Search, Pizza, ShoppingCart, PlusCircle, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurants/businesses
        const fetchedBusinesses = await getBusinesses();
        setBusinesses(fetchedBusinesses);
        
        // Fetch active orders if user is logged in
        if (user && user.uid) {
          const orders = await getCustomerOrders(user.uid);
          const active = orders.filter(order => 
            order.status !== "completed" && order.status !== "cancelled"
          );
          setActiveOrders(active);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  const categories = [
    { id: "restaurants", name: "Рестораны", icon: <Pizza className="h-6 w-6 text-primary" /> },
    { id: "groceries", name: "Хүнсний дэлгүүр", icon: <ShoppingCart className="h-6 w-6 text-primary" /> },
    { id: "pharmacy", name: "Эмийн сан", icon: <Pill className="h-6 w-6 text-primary" /> },
    { id: "retail", name: "Жижиглэн худалдаа", icon: <PlusCircle className="h-6 w-6 text-primary" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    // Filter businesses by category
    console.log("Filtering by category:", categoryId);
    // In a real implementation, this would filter businesses or navigate to a category page
  };

  const handleRestaurantClick = (businessId: string) => {
    // Navigate to restaurant detail page
    console.log("Navigating to business:", businessId);
    // In a real implementation, this would navigate to a business detail page
  };

  // Mock data for order tracking (in a real app, this would come from the database)
  const mockOrderItems = [
    { name: "Burger Combo", quantity: 2, price: 9.99 },
    { name: "Fries", quantity: 1, price: 3.99 },
  ];
  
  const mockDriver = {
    id: "driver1",
    name: "Michael Brown",
    arrivalTime: "10-15 mins"
  };

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
                <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 md:flex md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                alt="Food delivery" 
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
                <div key={i} className="bg-white rounded-lg shadow animate-pulse h-72">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
                    category={business.businessType || "Restaurant"}
                    subCategory={business.cuisine || ""}
                    distance={business.distance || "0.8 miles away"}
                    rating={business.rating || 4.8}
                    deliveryFee={business.deliveryFee || 0}
                    estimatedTime={business.estimatedTime || "25-35 min"}
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
        
        {/* Active order tracking section */}
        {activeOrders.length > 0 ? (
          <OrderTracking
            orderId={activeOrders[0].id}
            status="on-the-way"
            driver={mockDriver}
            items={mockOrderItems}
            subtotal={23.97}
            deliveryFee={2.49}
            total={26.46}
          />
        ) : null}
      </div>
    </div>
  );
}
