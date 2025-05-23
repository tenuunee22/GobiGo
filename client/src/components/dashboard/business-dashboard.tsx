import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessOrders } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/components/business/order-item";
import { ProductForm } from "@/components/business/product-form";
import { WelcomeBanner } from "@/components/shared/welcome-banner";
import { ClipboardList, DollarSign, Star } from "lucide-react";
export function BusinessDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("active-orders");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.uid) return;
      try {
        setLoading(true);
        const orders = await getBusinessOrders(user.uid);
        const active = orders.filter(order => 
          ["new", "accepted", "ready", "picked_up"].includes(order.status)
        );
        const history = orders.filter(order => 
          ["delivered", "declined", "cancelled"].includes(order.status)
        );
        setActiveOrders(active);
        setOrderHistory(history);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Failed to load orders",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, toast]);
  const handleOrderStatusChange = () => {
    if (user && user.uid) {
      getBusinessOrders(user.uid)
        .then(orders => {
          const active = orders.filter(order => 
            ["new", "accepted", "ready", "picked_up"].includes(order.status)
          );
          const history = orders.filter(order => 
            ["delivered", "declined", "cancelled"].includes(order.status)
          );
          setActiveOrders(active);
          setOrderHistory(history);
        })
        .catch(error => {
          console.error("Error refreshing orders:", error);
        });
    }
  };
  const stats = {
    todaysOrders: activeOrders.length,
    todaysRevenue: activeOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    customerRating: 4.8
  };
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        {user && <WelcomeBanner className="mb-6" />}
        {}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Бизнесийн хяналтын самбар</h1>
          <p className="text-gray-600 mt-2">Өнөөдрийн борлуулалт, {user?.businessName || user?.name || "Дэлгүүрийн эзэн"}</p>
        </div>
        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Өнөөдрийн захиалгууд</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.todaysOrders}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <DollarSign className="h-8 w-8" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Өнөөдрийн орлого</p>
                <h3 className="text-2xl font-bold text-gray-900">${stats.todaysRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <Star className="h-8 w-8" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Хэрэглэгчийн үнэлгээ</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.customerRating}/5.0</h3>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "active-orders" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("active-orders")}
              >
                Идэвхтэй захиалгууд
              </button>
              <button 
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "order-history" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("order-history")}
              >
                Захиалгын түүх
              </button>
              <button 
                className={`px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === "manage-products" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("manage-products")}
              >
                Бүтээгдэхүүн удирдах
              </button>
            </nav>
          </div>
          {}
          <div className="p-6">
            {activeTab === "active-orders" && (
              <div className="flow-root">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 h-24 rounded-md"></div>
                    ))}
                  </div>
                ) : activeOrders.length > 0 ? (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {activeOrders.map((order) => (
                      <OrderItem
                        key={order.id}
                        id={order.id}
                        orderNumber={order.orderNumber || order.id.slice(-6)}
                        customerName={order.customerName || "Customer"}
                        items={order.items || []}
                        total={order.total || 0}
                        status={order.status}
                        address={order.deliveryAddress || "No address provided"}
                        requestedTime={order.requestedTime || "ASAP"}
                        onStatusChange={handleOrderStatusChange}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Одоогоор идэвхтэй захиалга байхгүй байна.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "order-history" && (
              <div className="flow-root">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 h-24 rounded-md"></div>
                    ))}
                  </div>
                ) : orderHistory.length > 0 ? (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <OrderItem
                        key={order.id}
                        id={order.id}
                        orderNumber={order.orderNumber || order.id.slice(-6)}
                        customerName={order.customerName || "Customer"}
                        items={order.items || []}
                        total={order.total || 0}
                        status={order.status}
                        address={order.deliveryAddress || "No address provided"}
                        requestedTime={order.requestedTime || "ASAP"}
                        onStatusChange={handleOrderStatusChange}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Одоогоор захиалгын түүх байхгүй байна.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "manage-products" && (
              <ProductForm 
                onSave={(productData) => {
                  toast({
                    title: "Бүтээгдэхүүн амжилттай хадгалагдлаа",
                    description: "Таны мэдээлэл амжилттай шинэчлэгдлээ",
                  });
                }}
                onCancel={() => {
                  toast({
                    title: "Цуцлагдлаа",
                    description: "Бүтээгдэхүүн нэмэх үйлдэл цуцлагдлаа",
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
