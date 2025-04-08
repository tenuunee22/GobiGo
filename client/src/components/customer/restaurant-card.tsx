import { Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  subCategory?: string;
  distance: string;
  rating: number | string;
  deliveryFee: number | string;
  estimatedTime: string;
  onClick: () => void;
}

export function RestaurantCard({
  id,
  name,
  imageUrl,
  category,
  subCategory,
  distance,
  rating,
  deliveryFee,
  estimatedTime,
  onClick,
}: RestaurantCardProps) {
  // Format rating safely for display
  const formattedRating = () => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }
    if (typeof rating === 'string') {
      const numRating = parseFloat(rating);
      return isNaN(numRating) ? rating : numRating.toFixed(1);
    }
    return "5.0"; // Default fallback
  };

  // Format delivery fee safely for display
  const formattedDeliveryFee = () => {
    if (deliveryFee === 0) {
      return "Үнэгүй хүргэлт";
    }
    
    if (typeof deliveryFee === 'number') {
      return `${deliveryFee.toFixed(0)}₮ хүргэлт`;
    }
    
    if (typeof deliveryFee === 'string') {
      if (deliveryFee === "0") return "Үнэгүй хүргэлт";
      const numFee = parseFloat(deliveryFee);
      return isNaN(numFee) ? `${deliveryFee}₮ хүргэлт` : `${numFee.toFixed(0)}₮ хүргэлт`;
    }
    
    return "2500₮ хүргэлт"; // Default fallback
  };

  // Check if delivery is free
  const isFreeDelivery = () => {
    return deliveryFee === 0 || deliveryFee === "0";
  };

  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img 
        className="w-full h-48 object-cover" 
        src={imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"} 
        alt={name} 
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{category} {subCategory ? `• ${subCategory}` : ''} • {distance}</p>
          </div>
          <div className="flex items-center bg-green-100 rounded px-2 py-1">
            <Star className="h-4 w-4 text-green-600 fill-current" />
            <span className="text-sm font-medium text-green-700 ml-1">
              {formattedRating()}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={isFreeDelivery() ? "text-green-600 font-medium" : "text-gray-500"}>
            {formattedDeliveryFee()}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-gray-500">{estimatedTime}</span>
        </div>
      </div>
    </div>
  );
}
