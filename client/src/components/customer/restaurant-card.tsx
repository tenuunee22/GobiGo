import { Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  subCategory?: string;
  distance: string;
  rating: number;
  deliveryFee: number;
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
  // Function to get an appropriate emoji based on category
  const getCategoryEmoji = (cat: string): string => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('ресторан') || lowerCat.includes('restaurant')) return '🍽️';
    if (lowerCat.includes('хоол') || lowerCat.includes('food')) return '🍲';
    if (lowerCat.includes('бургер') || lowerCat.includes('burger')) return '🍔';
    if (lowerCat.includes('пицца') || lowerCat.includes('pizza')) return '🍕';
    if (lowerCat.includes('солонгос') || lowerCat.includes('korean')) return '🍜';
    if (lowerCat.includes('сүши') || lowerCat.includes('sushi')) return '🍣';
    if (lowerCat.includes('хинкали')) return '🥟';
    if (lowerCat.includes('кофе') || lowerCat.includes('coffee')) return '☕';
    if (lowerCat.includes('grocery') || lowerCat.includes('дэлгүүр')) return '🛒';
    if (lowerCat.includes('pharmacy') || lowerCat.includes('эмийн')) return '💊';
    return '🍴';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:translate-y-[-5px] slide-in-bottom"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img 
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700" 
          src={imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"} 
          alt={name} 
        />
        <div className="absolute top-3 right-3 shadow-md rounded-full bg-white p-2 pulse">
          <span className="wiggle inline-block">{getCategoryEmoji(category)}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{name}</h3>
            <p className="text-sm text-gray-500 fade-in-delayed">
              {category} {subCategory ? `• ${subCategory}` : ''} • <span className="inline-flex items-center">{distance} <span className="ml-1 jelly inline-block text-xs">📍</span></span>
            </p>
          </div>
          <div className="flex items-center bg-yellow-50 border border-yellow-100 rounded-full px-2 py-1 bounce-soft">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-yellow-700 ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className={deliveryFee === 0 ? "text-green-600 font-medium flex items-center" : "text-gray-500 flex items-center"}>
            {deliveryFee === 0 ? (
              <>Үнэгүй хүргэлт <span className="ml-1 tada inline-block">🎁</span></>
            ) : (
              <>{deliveryFee.toFixed(0)}₮ хүргэлт <span className="ml-1 wiggle inline-block">🚚</span></>
            )}
          </span>
          <span className="text-gray-500 flex items-center">
            {estimatedTime} <span className="ml-1 pulse inline-block">⏱️</span>
          </span>
        </div>
      </div>
    </div>
  );
}
