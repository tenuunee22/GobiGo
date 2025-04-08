import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { GoogleMapComponent } from "@/components/shared/google-map";
import { GoogleMapWithDirections } from "@/components/shared/google-map-with-directions";
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
  const [animating, setAnimating] = useState(false);
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  const statusInfo = {
    placed: { emoji: "📝", label: "Захиалга өгсөн", description: "Таны захиалгыг хүлээн авлаа!" },
    preparing: { emoji: "👨‍🍳", label: "Бэлтгэж байна", description: "Таны хоолыг бэлтгэж байна" },
    "on-the-way": { emoji: "🛵", label: "Замд явж байна", description: "Хоол замдаа явж байна" },
    delivered: { emoji: "🎉", label: "Хүргэгдсэн", description: "Сайхан хооллоорой!" }
  };
  useEffect(() => {
    if (prevStatus && prevStatus !== status) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevStatus(status);
  }, [status, prevStatus]);
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {statusInfo[status]?.description || "Таны захиалга замд яваа"}
        </h2>
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
        <div className="relative mb-10">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-400 ease-in-out"
              style={{ width: `${getStatusPercentage()}%` }}
            ></div>
          </div>
          <div className="absolute top-6 left-0 w-full flex justify-between">
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 
                  ${status === "placed" || status === "preparing" || status === "on-the-way" || status === "delivered" 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-400"} 
                  ${status === "placed" && animating ? "animate-bounce" : ""} 
                  transition-all duration-300`}
              >
                <span className="text-lg" role="img" aria-label="Захиалга өгсөн">
                  {statusInfo.placed.emoji}
                </span>
              </div>
              <span className={`text-xs font-medium ${status === "placed" || status === "preparing" || status === "on-the-way" || status === "delivered" ? "text-gray-700" : "text-gray-400"}`}>
                {statusInfo.placed.label}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 
                  ${status === "preparing" || status === "on-the-way" || status === "delivered" 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-400"} 
                  ${status === "preparing" && animating ? "animate-bounce" : ""} 
                  transition-all duration-300`}
              >
                <span className="text-lg" role="img" aria-label="Бэлтгэж байна">
                  {statusInfo.preparing.emoji}
                </span>
              </div>
              <span className={`text-xs font-medium ${status === "preparing" || status === "on-the-way" || status === "delivered" ? "text-gray-700" : "text-gray-400"}`}>
                {statusInfo.preparing.label}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 
                  ${status === "on-the-way" || status === "delivered" 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-400"} 
                  ${status === "on-the-way" && animating ? "animate-bounce" : ""} 
                  transition-all duration-300`}
              >
                <span className="text-lg" role="img" aria-label="Замд явж байна">
                  {statusInfo["on-the-way"].emoji}
                </span>
              </div>
              <span className={`text-xs font-medium ${status === "on-the-way" || status === "delivered" ? "text-gray-700" : "text-gray-400"}`}>
                {statusInfo["on-the-way"].label}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 
                  ${status === "delivered" 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-400"} 
                  ${status === "delivered" && animating ? "animate-bounce" : ""} 
                  transition-all duration-300`}
              >
                <span className="text-lg" role="img" aria-label="Хүргэгдсэн">
                  {statusInfo.delivered.emoji}
                </span>
              </div>
              <span className={`text-xs font-medium ${status === "delivered" ? "text-gray-700" : "text-gray-400"}`}>
                {statusInfo.delivered.label}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-32 rounded-lg mb-4 relative overflow-hidden">
          {status === "on-the-way" && currentLocation && destination ? (
            <GoogleMapWithDirections 
              origin={currentLocation} 
              destination={destination} 
              driverName={driver?.name || "Жолооч"}
            />
          ) : (
            <GoogleMapComponent 
              center={destination || { lat: 47.9184676, lng: 106.9177016 }}
              markers={[
                {
                  position: destination || { lat: 47.9184676, lng: 106.9177016 },
                  title: "Хүргэлтийн хаяг"
                },
                ...(currentLocation ? [{
                  position: currentLocation,
                  title: "Жолоочийн байршил",
                  icon: "https:
                }] : [])
              ]}
              zoom={15}
            />
          )}
          <div className="absolute bottom-2 right-2">
            <button className="p-2 bg-white rounded-full shadow hover:shadow-md focus:outline-none" aria-label="Миний байршил">
              <svg xmlns="http:
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
              <span>{(item.quantity * item.price).toFixed(2)}₮</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Дэд дүн</span>
            <span>{subtotal.toFixed(2)}₮</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Хүргэлтийн төлбөр</span>
            <span>{deliveryFee.toFixed(2)}₮</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-200">
            <span>Нийт дүн</span>
            <span>{total.toFixed(2)}₮</span>
          </div>
        </div>
      </div>
    </section>
  );
}
