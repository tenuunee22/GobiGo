import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Driver {
  id: string;
  name: string;
  imageUrl?: string;
  arrivalTime: string;
}

interface OrderTrackingProps {
  orderId: string;
  status: "placed" | "preparing" | "on-the-way" | "delivered";
  driver?: Driver;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  destination?: {
    lat: number;
    lng: number;
  };
}

export function OrderTracking({
  orderId,
  status,
  driver,
  items,
  subtotal,
  deliveryFee,
  total,
  currentLocation,
  destination,
}: OrderTrackingProps) {
  const getStatusPercentage = () => {
    switch (status) {
      case "placed":
        return 25;
      case "preparing":
        return 50;
      case "on-the-way":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Таны захиалга замд яваа</h2>
        
        {driver && (
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden mr-4">
              {driver.imageUrl ? (
                <img src={driver.imageUrl} alt={driver.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {driver.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
              <p className="text-sm text-gray-500">Таны хүргэлтийн жолооч • {driver.arrivalTime}-д ирнэ</p>
            </div>
            <div className="ml-auto">
              <Button>
                <Phone className="h-4 w-4 mr-2" />
                Холбогдох
              </Button>
            </div>
          </div>
        )}
        
        <div className="relative mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${getStatusPercentage()}%` }}
            ></div>
          </div>
          <div className="absolute top-4 left-0 w-full flex justify-between">
            <div className="flex flex-col items-center">
              <span className={`w-4 h-4 rounded-full ${status === "placed" || status === "preparing" || status === "on-the-way" || status === "delivered" ? "bg-primary" : "bg-gray-300"}`}></span>
              <span className={`text-xs font-medium mt-1 ${status === "placed" || status === "preparing" || status === "on-the-way" || status === "delivered" ? "text-gray-600" : "text-gray-400"}`}>Захиалга өгсөн</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`w-4 h-4 rounded-full ${status === "preparing" || status === "on-the-way" || status === "delivered" ? "bg-primary" : "bg-gray-300"}`}></span>
              <span className={`text-xs font-medium mt-1 ${status === "preparing" || status === "on-the-way" || status === "delivered" ? "text-gray-600" : "text-gray-400"}`}>Бэлтгэж байна</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`w-4 h-4 rounded-full ${status === "on-the-way" || status === "delivered" ? "bg-primary" : "bg-gray-300"}`}></span>
              <span className={`text-xs font-medium mt-1 ${status === "on-the-way" || status === "delivered" ? "text-gray-600" : "text-gray-400"}`}>Замд явж байна</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`w-4 h-4 rounded-full ${status === "delivered" ? "bg-primary" : "bg-gray-300"}`}></span>
              <span className={`text-xs font-medium mt-1 ${status === "delivered" ? "text-gray-600" : "text-gray-400"}`}>Хүргэгдсэн</span>
            </div>
          </div>
        </div>
        
        {/* Map placeholder - In a real implementation, this would be a Google Maps component */}
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Энд Google Maps Жолоочийн бодит цагийн байршил үзүүлэх болно
          </div>
          
          <div className="absolute bottom-4 right-4">
            <button className="p-2 bg-white rounded-full shadow hover:shadow-md focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Захиалгын дэлгэрэнгүй</h3>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Дэд дүн</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Хүргэлтийн төлбөр</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-200">
            <span>Нийт дүн</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
