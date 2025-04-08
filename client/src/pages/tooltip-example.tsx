import React from "react";
import { FoodTooltip } from "@/components/ui/food-tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TooltipExample() {
  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Нүүр хуудас руу буцах
          </Button>
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Хоолтой холбоотой зураг бүхий туслах товчлуурууд</h1>
        <p className="text-gray-500 mb-8">Энэ хуудсанд <code className="bg-gray-100 p-1 rounded">FoodTooltip</code> компонентын янз бүрийн жишээнүүдийг үзүүлж байна.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Энгийн жишээнүүд</h2>
            <Card>
              <CardHeader>
                <CardTitle>Туслах товчлуур</CardTitle>
                <CardDescription>Янз бүрийн хоолны дүрстэй товчнууд.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span>Пицца</span>
                      <FoodTooltip 
                        content="Пицца нь Итали хоол бөгөөд дээрээ ялгаатай орцтой байдаг."
                        illustration="pizza"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Кофе</span>
                      <FoodTooltip 
                        content="Кофе нь кофены ургамлын үрээс бэлтгэсэн ундаа юм."
                        illustration="coffee"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Тахиа</span>
                      <FoodTooltip 
                        content="Тахианы мах нь уураг ихтэй, өөх багатай."
                        illustration="chicken"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Үхрийн мах</span>
                      <FoodTooltip 
                        content="Үхрийн мах нь төмөр ихтэй."
                        illustration="beef"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span>Алим</span>
                      <FoodTooltip 
                        content="Өдөрт нэг алим идэж байвал эмч танд хэрэггүй!"
                        illustration="apple"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Жигнэмэг</span>
                      <FoodTooltip 
                        content="Жигнэмэг нь чихэр ихтэй учир багаар иддэг байна."
                        illustration="cookie"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Зайрмаг</span>
                      <FoodTooltip 
                        content="Зайрмаг нь Монголчуудын дуртай зуны ундаа юм."
                        illustration="icecream"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>Сэндвич</span>
                      <FoodTooltip 
                        content="Сэндвич нь хурдан хооллоход хялбар бөгөөд олон төрлийн байдаг."
                        illustration="sandwich"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Өөр байршил, хэмжээтэй</h2>
            <Card>
              <CardHeader>
                <CardTitle>Байршил болон хэмжээ</CardTitle>
                <CardDescription>Ялгаатай талуудад харуулах боломжтой.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Button>
                      Дээш
                      <FoodTooltip 
                        content="Энэ товч дээр дээш харуулж байна (анхдагч)."
                        illustration="pizza"
                        side="top"
                      />
                    </Button>
                    
                    <Button>
                      Доош
                      <FoodTooltip 
                        content="Энэ товч дээр доош харуулж байна."
                        illustration="coffee"
                        side="bottom"
                      />
                    </Button>
                    
                    <Button>
                      Зүүн
                      <FoodTooltip 
                        content="Энэ товч дээр зүүн талд харуулж байна."
                        illustration="chicken"
                        side="left"
                      />
                    </Button>
                    
                    <Button>
                      Баруун
                      <FoodTooltip 
                        content="Энэ товч дээр баруун талд харуулж байна."
                        illustration="beef"
                        side="right"
                      />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <p>Жижиг хэмжээ:</p>
                      <FoodTooltip 
                        content="Энэ бол жижиг хэмжээтэй туслах зөвлөгөө."
                        illustration="apple"
                        size="sm"
                      >
                        <Button variant="outline" size="sm">Жижиг</Button>
                      </FoodTooltip>
                    </div>
                    
                    <div>
                      <p>Дунд хэмжээ (анхдагч):</p>
                      <FoodTooltip 
                        content="Энэ бол дунд хэмжээтэй туслах зөвлөгөө. Энэ нь анхдагч хэмжээ юм."
                        illustration="cookie"
                      >
                        <Button variant="outline">Дунд</Button>
                      </FoodTooltip>
                    </div>
                    
                    <div>
                      <p>Том хэмжээ:</p>
                      <FoodTooltip 
                        content="Энэ бол том хэмжээтэй туслах зөвлөгөө. Илүү их мэдээлэл багтаах боломжтой. Жишээлбэл, урт текст бичих, зааварчилгаа өгөх, олон мөрт текст гэх мэт."
                        illustration="sandwich"
                        size="lg"
                      >
                        <Button variant="outline" size="lg">Том</Button>
                      </FoodTooltip>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Бодит хэрэглээний жишээнүүд</h2>
          <p className="text-gray-500 mb-6">Форм болон бусад элементүүдэд ашиглах жишээ.</p>
          
          <Tabs defaultValue="form">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="form">Формын жишээ</TabsTrigger>
              <TabsTrigger value="checkout">Төлбөрийн жишээ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Хүргэлтийн хаяг</CardTitle>
                  <CardDescription>
                    Хүргэлтийн хаягийн мэдээллээ оруулна уу.
                    <FoodTooltip 
                      content="Хүргэлтийн мэдээлэл нь таны захиалга зөв хүрэхэд чухал. Мэдээллийг бүрэн зөв оруулна уу."
                      illustration="sandwich"
                      side="right"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="name">Бүтэн нэр</Label>
                      <FoodTooltip 
                        content="Таны нэрийг хүргэлтийн ажилтан ашиглана."
                        illustration="chicken"
                      />
                    </div>
                    <Input id="name" placeholder="Болд Баатар" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="phone">Утасны дугаар</Label>
                      <FoodTooltip 
                        content="Хүргэлтийн ажилтан тантай холбогдоход хэрэглэнэ."
                        illustration="coffee"
                      />
                    </div>
                    <Input id="phone" placeholder="9911-2233" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="address">Хаяг</Label>
                      <FoodTooltip 
                        content={
                          <div className="space-y-1">
                            <p>Дараах мэдээллийг оруулна уу:</p>
                            <ul className="list-disc pl-4">
                              <li>Хороо, Хороолол</li>
                              <li>Байр, орц, давхар</li>
                              <li>Хаалганы дугаар</li>
                            </ul>
                          </div>
                        }
                        illustration="pizza"
                        size="lg"
                      />
                    </div>
                    <Textarea id="address" placeholder="Баянзүрх дүүрэг, 2-р хороо, 15-р хороолол, 45-р байр, 3-р орц, 5 давхар, 507 тоот" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Хадгалах</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="checkout" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Төлбөрийн мэдээлэл</CardTitle>
                  <CardDescription>
                    Төлбөр төлөх мэдээллээ оруулна уу.
                    <FoodTooltip 
                      content="Төлбөрийн мэдээлэл нь аюулгүй, шифрлэгдсэн байдлаар дамжуулагдана."
                      illustration="icecream"
                      side="right"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="card-number">Картын дугаар</Label>
                      <FoodTooltip 
                        content="16 оронтой картын дугаараа оруулна уу."
                        illustration="apple"
                      />
                    </div>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="expiry">Дуусах хугацаа</Label>
                        <FoodTooltip 
                          content="Картын дуусах хугацааг MM/YY (сар/жил) форматаар оруулна уу."
                          illustration="beef"
                        />
                      </div>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="cvv">CVV код</Label>
                        <FoodTooltip 
                          content="Картын ард байрлах 3 оронтой аюулгүй код."
                          illustration="cookie"
                        />
                      </div>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="namecard">Картын эзэмшигч</Label>
                      <FoodTooltip 
                        content="Картан дээр бичсэн нэрийг оруулна уу."
                        illustration="chicken"
                      />
                    </div>
                    <Input id="namecard" placeholder="BOLD BAATAR" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Буцах</Button>
                  <Button>
                    Төлбөр төлөх
                    <FoodTooltip 
                      content="Төлбөр амжилттай хийгдсэний дараа захиалга баталгаажина."
                      illustration="pizza"
                      side="right"
                    />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}