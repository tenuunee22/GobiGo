import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  restaurantName: string;
  restaurantLogoUrl?: string;
  rating: number;
  price: number;
  deliveryTime: string;
  tags: string[];
  isFavorite: boolean;
}
export function RecipeRecommendationCarousel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [viewportRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: true
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const userPreferences = user?.preferences || [];
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Ногоотой Хуушуур',
          imageUrl: 'https://example.com/recipe.jpg',
          restaurantName: 'Хүслэн Ресторан',
          restaurantLogoUrl: 'https://example.com/restaurant.jpg',
          rating: 4.8,
          price: 8000,
          deliveryTime: '20-30 мин',
          tags: ['Монгол хоол', 'Үндэсний хоол', 'Түргэн хоол'],
          isFavorite: false
        },
        {
          id: '2',
          name: 'Өндөгтэй будаа',
          imageUrl: 'https://example.com/recipe.jpg',
          restaurantName: 'Garden Cafe',
          restaurantLogoUrl: 'https://example.com/restaurant.jpg',
          rating: 4.5,
          price: 9500,
          deliveryTime: '15-25 мин',
          tags: ['Солонгос хоол', 'Эрүүл хоол', 'Амттан'],
          isFavorite: true
        },
        {
          id: '3',
          name: 'Том Бургер',
          imageUrl: 'https://example.com/recipe.jpg',
          restaurantName: 'Big Burger',
          restaurantLogoUrl: 'https://example.com/restaurant.jpg',
          rating: 4.7,
          price: 12000,
          deliveryTime: '25-35 мин',
          tags: ['Бургер', 'Түргэн хоол', 'Америк хоол'],
          isFavorite: false
        },
        {
          id: '4',
          name: 'Пепперони Пицца',
          imageUrl: 'https://example.com/recipe.jpg',
          restaurantName: 'Pizza Hub',
          restaurantLogoUrl: 'https://example.com/restaurant.jpg',
          rating: 4.6,
          price: 24000,
          deliveryTime: '30-40 мин',
          tags: ['Итали хоол', 'Пицца', 'Түргэн хоол'],
          isFavorite: false
        },
        {
          id: '5',
          name: 'Буузны цуглаан',
          imageUrl: 'https://example.com/recipe.jpg',
          restaurantName: 'Монгол Гуанз',
          restaurantLogoUrl: 'https://example.com/restaurant.jpg',
          rating: 4.9,
          price: 15000,
          deliveryTime: '20-30 мин',
          tags: ['Монгол хоол', 'Үндэсний хоол', 'Буузны газар'],
          isFavorite: true
        }
      ];
      setRecipes(mockRecipes);
      setLoading(false);
    }, 1000);
  }, [user]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);
  const toggleFavorite = (id: string) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id 
        ? { ...recipe, isFavorite: !recipe.isFavorite } 
        : recipe
    ));
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      toast({
        title: recipe.isFavorite 
          ? "Хадгалсаннаас хасагдлаа" 
          : "Дуртай хоолонд нэмэгдлээ",
        description: recipe.isFavorite 
          ? `${recipe.name} дуртай хоолны жагсаалтаас хасагдлаа` 
          : `${recipe.name} дуртай хоолны жагсаалтад нэмэгдлээ`,
      });
    }
  };
  const addToCart = (recipe: Recipe) => {
    addItem({
      id: recipe.id,
      name: recipe.name,
      price: recipe.price,
      quantity: 1,
      imageUrl: recipe.imageUrl,
      businessId: `business-${recipe.restaurantName.toLowerCase().replace(/\s+/g, '-')}`,
      businessName: recipe.restaurantName
    });
    toast({
      title: "Сагсанд нэмэгдлээ",
      description: `${recipe.name} сагсанд нэмэгдлээ`,
    });
  };
  if (loading) {
    return (
      <div className="pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Танд санал болгох</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="min-w-[280px] w-[280px] flex-shrink-0 animate-pulse"
            >
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex gap-2 mb-2">
                {[1, 2].map((tag) => (
                  <div key={tag} className="h-6 bg-gray-200 rounded-full w-16"></div>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (recipes.length === 0) {
    return null;
  }
  return (
    <div className="pb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Танд санал болгох</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollPrev} 
            disabled={!prevBtnEnabled}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollNext} 
            disabled={!nextBtnEnabled}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              className="min-w-[280px] w-[280px] flex-shrink-0 mx-3 first:ml-0 last:mr-0"
            >
              <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                <div className="relative">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.name} 
                    className="w-full h-40 object-cover" 
                  />
                  <Button
                    onClick={() => toggleFavorite(recipe.id)}
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90",
                      recipe.isFavorite && "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart 
                      className={cn(recipe.isFavorite && "fill-current")} 
                      size={18} 
                    />
                  </Button>
                  <div className="absolute bottom-2 left-2 flex items-center">
                    <Avatar className="h-6 w-6 border border-white">
                      <img 
                        src={recipe.restaurantLogoUrl} 
                        alt={recipe.restaurantName} 
                      />
                    </Avatar>
                    <span className="ml-1 text-xs font-medium text-white drop-shadow-md">
                      {recipe.restaurantName}
                    </span>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold mb-1">{recipe.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {recipe.rating}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{recipe.deliveryTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{recipe.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">
                      {recipe.price.toLocaleString()}₮
                    </div>
                    <Button size="sm" onClick={() => addToCart(recipe)}>
                      Сагслах
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}