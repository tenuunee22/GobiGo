import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BouncingLoader } from "@/components/ui/bouncing-loader";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { RestaurantCardSkeleton } from "@/components/ui/restaurant-card-skeleton";
import { CategoryLoader } from "@/components/ui/category-loader";
import { DeliveryAnimation } from "@/components/ui/delivery-animation";
import { DeliveryChat } from "@/components/shared/delivery-chat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoadingDemo() {
  const [showFullscreenLoader, setShowFullscreenLoader] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "gradient">("light");
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg">("md");
  const [showBackground, setShowBackground] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState<"preparing" | "on-the-way" | "arriving" | "delivered">("on-the-way");
  const [showDeliveryChat, setShowDeliveryChat] = useState(false);
  
  // Helper to toggle the full screen loader with auto-off timer
  const toggleFullscreenLoader = () => {
    setShowFullscreenLoader(true);
    // Auto-hide after 3 seconds for demo purposes
    setTimeout(() => {
      setShowFullscreenLoader(false);
    }, 3000);
  };
  
  return (
    <div className="container py-8 max-w-4xl">
      <LoadingOverlay 
        isLoading={showFullscreenLoader} 
        theme={selectedTheme}
        message="Хоолны мэдээллийг ачааллаж байна..."
      />
      
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
        Анимэйшн жишээ
      </h1>
      <p className="text-gray-600 mb-6">
        Хүлээх явцад үзүүлэх дүрс хөдөлгөөнт анимэйшн жишээнүүд
      </p>
      
      <Tabs defaultValue="fullscreen" className="mb-8">
        <TabsList>
          <TabsTrigger value="fullscreen">Бүтэн дэлгэц</TabsTrigger>
          <TabsTrigger value="components">Хэсэгчилсэн</TabsTrigger>
          <TabsTrigger value="skeletons">Skeleton loader</TabsTrigger>
          <TabsTrigger value="chat">Хүргэлтийн чат</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fullscreen">
          <Card>
            <CardHeader>
              <CardTitle>Бүтэн дэлгэцийн анимэйшн</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Өнгө сонгох</Label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={selectedTheme === "light" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedTheme("light")}
                      >
                        Цайвар
                      </Button>
                      <Button 
                        variant={selectedTheme === "dark" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedTheme("dark")}
                      >
                        Бараан
                      </Button>
                      <Button 
                        variant={selectedTheme === "gradient" ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSelectedTheme("gradient")}
                      >
                        Градиент
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={toggleFullscreenLoader}>
                    Бүтэн дэлгэцийн анимэйшн харах
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 h-48 relative">
                  <LoadingOverlay 
                    isLoading={true} 
                    fullScreen={false} 
                    theme={selectedTheme} 
                    message="Жишээ анимэйшн"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Анимэйшн элементүүд</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="size">Хэмжээ</Label>
                    <div className="flex space-x-2">
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
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="background">Цайвар дэвсгэртэй</Label>
                    <Switch 
                      id="background" 
                      checked={showBackground} 
                      onCheckedChange={setShowBackground} 
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 flex items-center justify-center">
                  <BouncingLoader 
                    size={selectedSize} 
                    showBackground={showBackground} 
                  />
                </div>
                
                <div className="sm:col-span-2 mt-4">
                  <h3 className="text-lg font-medium mb-3">Категори уншиж байна</h3>
                  <div className="border rounded-lg p-4">
                    <CategoryLoader count={8} />
                  </div>
                </div>
                
                <div className="sm:col-span-2 mt-4">
                  <h3 className="text-lg font-medium mb-3">Хүргэлтийн явц</h3>
                  <div className="border rounded-lg p-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label>Хүргэлтийн төлөв</Label>
                        <Select 
                          value={deliveryStatus} 
                          onValueChange={(value) => setDeliveryStatus(value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Хүргэлтийн төлөв сонгох" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preparing">Бэлтгэж байна</SelectItem>
                            <SelectItem value="on-the-way">Замд явж байна</SelectItem>
                            <SelectItem value="arriving">Ойртож байна</SelectItem>
                            <SelectItem value="delivered">Хүргэгдсэн</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex space-x-2 mt-4">
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
                      
                      <div className="flex items-center justify-center">
                        <DeliveryAnimation status={deliveryStatus} size={selectedSize} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skeletons">
          <Card>
            <CardHeader>
              <CardTitle>Скелетон лоадерууд</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-3">Ресторан карт скелетон</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <RestaurantCardSkeleton count={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Хүргэлтийн чат</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Хэрэглэгч хүргэгчтэй холбогдох боломжтой чат систем. Хүргэлтийн явцыг мэдээлэх болон хүргэлт хийгдэх байрлалын талаар харилцах боломжтой.
                </p>
                
                <div className="flex justify-between">
                  <Button onClick={() => setShowDeliveryChat(!showDeliveryChat)}>
                    {showDeliveryChat ? "Хүргэлтийн чат хаах" : "Хүргэлтийн чат харуулах"}
                  </Button>
                </div>

                <div className="h-96 border rounded-lg p-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <p className="text-center">
                      {showDeliveryChat ? "Хүргэлтийн чат харагдаж байна" : "Хүргэлтийн чат-ийг харуулахын тулд товчийг дарна уу"}
                      <br/>
                      <span className="text-sm">Баруун доод талд харагдана</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {showDeliveryChat && (
                <DeliveryChat
                  orderId="12345"
                  customerName="Батаа"
                  driverName="Дорж"
                  onSendMessage={(message) => console.log("Sent message:", message)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}