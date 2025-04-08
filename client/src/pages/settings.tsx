import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Lock, User, Map, CreditCard, ShieldCheck, Check, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const { user } = useAuth();
  const [cardList, setCardList] = useState([
    {
      id: "1",
      type: "visa",
      number: "**** **** **** 4242",
      expiry: "12/24",
      isDefault: true
    }
  ]);

  return (
    <div className="container mx-auto py-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Тохиргоо
      </motion.h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-2">
            <User className="h-4 w-4" /> Профайл
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col sm:flex-row items-center gap-2">
            <CreditCard className="h-4 w-4" /> Төлбөр
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex flex-col sm:flex-row items-center gap-2">
            <Lock className="h-4 w-4" /> Нууцлал
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Хувийн мэдээлэл
                  </CardTitle>
                  <CardDescription>
                    Хэрэглэгчийн профайлын мэдээлэл
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex flex-col md:flex-row gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="firstName" className="text-sm font-medium">Нэр</Label>
                        <div className="border p-3 rounded-md mt-1 bg-gray-50">{user?.name || user?.displayName || "Хэрэглэгч"}</div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="email" className="text-sm font-medium">Имэйл</Label>
                        <div className="border p-3 rounded-md mt-1 bg-gray-50">{user?.email || "Имэйл байхгүй"}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col md:flex-row gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="phone" className="text-sm font-medium">Утас</Label>
                        <div className="border p-3 rounded-md mt-1 bg-gray-50">{user?.phone || "Утас байхгүй"}</div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="role" className="text-sm font-medium">Төрөл</Label>
                        <div className="border p-3 rounded-md mt-1 capitalize bg-gray-50">
                          {user?.role === "customer" && (
                            <span className="inline-flex items-center">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Хэрэглэгч
                              </span>
                              Хоол захиалагч
                            </span>
                          )}
                          {user?.role === "business" && (
                            <span className="inline-flex items-center">
                              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Бизнес
                              </span>
                              Хоолны газрын эзэн
                            </span>
                          )}
                          {user?.role === "delivery" && (
                            <span className="inline-flex items-center">
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Хүргэлт
                              </span>
                              Хүргэлтийн ажилтан
                            </span>
                          )}
                          {!user?.role && "Тодорхойгүй"}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="default" className="flex gap-2">
                      Профайл засах <User className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" /> Хаяг байршил
                  </CardTitle>
                  <CardDescription>
                    Хүргэлтийн хаягаа тохируулах
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Одоогийн хаяг</Label>
                          <p className="text-gray-600 mt-1">
                            {user?.address || "Хаяг оруулаагүй байна"}
                          </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Map className="h-4 w-4" />
                            Хаяг нэмэх
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>



        <TabsContent value="payment">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Төлбөрийн аргууд
                </CardTitle>
                <CardDescription>
                  Төлбөрийн карт болон бусад төлбөрийн аргуудыг удирдах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {cardList.map((card, index) => (
                  <motion.div 
                    key={card.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg text-white">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{card.type === 'visa' ? 'Visa' : 'Mastercard'}</p>
                            {card.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Үндсэн
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{card.number}</p>
                          <p className="text-xs text-muted-foreground">Дуусах хугацаа: {card.expiry}</p>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg border border-dashed p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Карт нэмэх</h3>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, болон бусад картууд.</p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Нууцлал ба аюулгүй байдал
                </CardTitle>
                <CardDescription>
                  Аккаунтын нууцлал ба хандалтын тохиргоо
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-lg border p-5 hover:border-primary/50 transition-colors bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-lg text-white">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Нууц үг солих</p>
                        <p className="text-sm text-muted-foreground">Аккаунтын нууц үгээ шинэчлэх</p>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="px-4 flex items-center gap-2">
                        Солих <Lock className="h-4 w-4 ml-1" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-lg border p-5 hover:border-primary/50 transition-colors bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-lg text-white">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Хандалтын түүх</p>
                        <p className="text-sm text-muted-foreground">Сүүлийн үеийн нэвтрэлтийн мэдээлэл</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500 ml-auto">Сүүлд нэвтэрсэн:</div>
                      <div className="text-sm font-medium">Өнөөдөр, 08:12</div>
                      <div className="text-xs text-gray-500">Улаанбаатар IP: 202.9.40.XX</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-lg border p-5 hover:border-primary/50 transition-colors bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg text-white">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Гар утасны баталгаажуулалт</p>
                        <p className="text-sm text-muted-foreground">Нэмэлт аюулгүй байдал</p>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="px-4">Идэвхжүүлэх</Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}