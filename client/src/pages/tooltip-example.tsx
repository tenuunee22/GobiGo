import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FoodEmojiReaction, type FoodEmojiType } from "@/components/ui/food-emoji-reaction";
import { FoodReviewCard } from "@/components/ui/food-review-card";
import { FoodTooltip, DetailedFoodTooltip } from "@/components/ui/food-tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Heart, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TooltipExample() {
  const [selectedEmoji, setSelectedEmoji] = useState<FoodEmojiType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<"horizontal" | "grid" | "compact">("horizontal");
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
  
  // Жишээ дата
  const exampleFoodReactions: Record<FoodEmojiType, number> = {
    "🍕": 5,
    "🍔": 3,
    "🍜": 0,
    "🍣": 1,
    "🥗": 0,
    "😋": 7,
    "🔥": 2,
    "👍": 8,
    "❤️": 4
  };
  
  // Жишээ сэтгэгдэл
  const exampleReview = {
    id: "1",
    foodId: "food-1",
    userName: "Баттулга",
    userImage: "https://i.pravatar.cc/150?img=32",
    date: new Date().toISOString(),
    rating: 4,
    content: "Энэ хоол үнэхээр амттай байсан! Өмнө нь хэд хэдэн удаа захиалж байсан ч энэ удаа онцгой амттай санагдлаа. Ялангуяа ногоо нь маш шинэхэн, соус нь гайхалтай амттай байв. Та нар заавал үүнийг захиалаарай.",
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=300&auto=format&fit=crop"
    ],
    reactions: {
      "😋": 3,
      "👍": 5,
      "❤️": 2
    } as Record<FoodEmojiType, number>,
    userReaction: "👍" as FoodEmojiType,
    likes: 12,
    comments: 3
  };

  return (
    <div className="container py-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Хоолны эможи реакц жишээ
      </motion.h1>

      <Tabs defaultValue="reactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="reactions">Эможи реакц</TabsTrigger>
          <TabsTrigger value="tooltip">Эможи огтолцуур</TabsTrigger>
          <TabsTrigger value="review">Сэтгэгдэл</TabsTrigger>
        </TabsList>

        <TabsContent value="reactions">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Эможи реакцийн жагсаалт</CardTitle>
                <CardDescription>
                  Хоолны бүтээгдэхүүнд реакц үзүүлэх боломж
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Хэлбэр сонгох */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Харагдах байдал:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={selectedVariant === "horizontal" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedVariant("horizontal")}
                    >
                      Хэвтээ
                    </Button>
                    <Button 
                      variant={selectedVariant === "grid" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedVariant("grid")}
                    >
                      Хүснэгт
                    </Button>
                    <Button 
                      variant={selectedVariant === "compact" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedVariant("compact")}
                    >
                      Товч
                    </Button>
                  </div>
                </div>
                
                {/* Хэмжээ сонгох */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Хэмжээ:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={selectedSize === "sm" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedSize("sm")}
                    >
                      Жижиг
                    </Button>
                    <Button 
                      variant={selectedSize === "md" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedSize("md")}
                    >
                      Дунд
                    </Button>
                    <Button 
                      variant={selectedSize === "lg" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedSize("lg")}
                    >
                      Том
                    </Button>
                  </div>
                </div>
                
                {/* Үр дүн харах */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4">Үр дүн:</h3>
                  <div>
                    <FoodEmojiReaction 
                      foodId="example-1" 
                      initialReactions={exampleFoodReactions}
                      userReaction={selectedEmoji}
                      onReaction={setSelectedEmoji}
                      variant={selectedVariant}
                      size={selectedSize}
                    />
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    {selectedEmoji ? (
                      <p>Сонгосон эможи: <span className="text-xl">{selectedEmoji}</span></p>
                    ) : (
                      <p>Эможи сонгоогүй байна</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Эможи реакцийн тоглоом</CardTitle>
                <CardDescription>
                  Хоолны эможиг авах дадлага хийх боломж
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center">
                    <motion.div 
                      className="text-7xl mb-4"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      {selectedEmoji || "🍽️"}
                    </motion.div>
                    
                    <div className="text-center">
                      <h3 className="font-medium mb-2">Та өөрийн дуртай хоолны төрлийг сонгоно уу</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Эможи дээр дарж хоолны төрлөөр шүүх
                      </p>
                      
                      <FoodEmojiReaction 
                        foodId="example-2" 
                        userReaction={selectedEmoji}
                        onReaction={setSelectedEmoji}
                        variant="grid"
                        size="md"
                      />
                      
                      {selectedEmoji && (
                        <motion.div 
                          className="mt-6 p-3 bg-green-50 rounded-lg text-green-700 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Та {selectedEmoji} сонголоо. Танд энэ төрлийн хоол санал болгох боломжтой!
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tooltip">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Эможи огтолцуур</CardTitle>
                <CardDescription>
                  Товч дараад хоолны реакц харуулах
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-10">
                  <div className="p-4 border rounded-lg flex justify-center">
                    <FoodTooltip
                      onEmojiSelect={setSelectedEmoji}
                      position="bottom"
                    >
                      <Button variant="outline" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>Үнэлгээ өгөх</span>
                        {selectedEmoji && <span className="ml-1">{selectedEmoji}</span>}
                      </Button>
                    </FoodTooltip>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex justify-center">
                    <FoodTooltip
                      onEmojiSelect={setSelectedEmoji}
                      position="top"
                    >
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="rounded-full gap-2 bg-gradient-to-r from-purple-500 to-blue-500"
                      >
                        <Heart className="h-5 w-5" />
                        <span>Хоолны эможитой үнэлгээ</span>
                        {selectedEmoji && <span className="ml-1 text-xl">{selectedEmoji}</span>}
                      </Button>
                    </FoodTooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Дэлгэрэнгүй огтолцуур</CardTitle>
                <CardDescription>
                  Олон төрлийн хоолны реакц сонгох
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-10">
                  <div className="p-4 border rounded-lg flex justify-center">
                    <DetailedFoodTooltip
                      onEmojiSelect={setSelectedEmoji}
                      position="bottom"
                    >
                      <div className="border rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Хоолны үнэлгээ</span>
                        {selectedEmoji && <Badge className="ml-1">{selectedEmoji}</Badge>}
                      </div>
                    </DetailedFoodTooltip>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Сонгогдсон эможи:</h3>
                    <div className="p-8 border rounded-lg flex flex-col items-center justify-center bg-gray-50">
                      {selectedEmoji ? (
                        <motion.div 
                          className="text-6xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          {selectedEmoji}
                        </motion.div>
                      ) : (
                        <p className="text-muted-foreground">Эможи сонгоогүй байна</p>
                      )}
                      
                      <p className="mt-4 text-sm text-center">
                        Дээрх огтолцуураас эможи сонгоорой
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Хоолны сэтгэгдэл</CardTitle>
                <CardDescription>
                  Сэтгэгдэл үлдээж, реакц харуулах
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoodReviewCard 
                  review={exampleReview}
                  onReaction={(emoji) => {
                    console.log("Эможи сонгосон:", emoji);
                    setSelectedEmoji(emoji);
                  }}
                  onLike={() => console.log("Таалагдлаа дарсан")}
                  onComment={() => console.log("Сэтгэгдэл дарсан")}
                  onShare={() => console.log("Хуваалцах дарсан")}
                />
                
                <div className="mt-8 p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Сэтгэгдэл бичих
                  </h3>
                  
                  <div className="flex gap-2">
                    <FoodTooltip
                      onEmojiSelect={setSelectedEmoji}
                      position="top"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 h-9"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{selectedEmoji || "Эможи"}</span>
                      </Button>
                    </FoodTooltip>
                    
                    <Button variant="default" size="sm" className="h-9">Хадгалах</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}