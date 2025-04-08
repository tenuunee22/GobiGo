import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Lock, User, Map, CreditCard, ShieldCheck, Check, Plus, Trash2, Key } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

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
    <div className="mobile-container mx-auto py-6 md:py-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 flex items-center gap-2"
      >
        <span className="bg-gradient-to-r from-primary to-indigo-500 p-2 rounded-lg text-white">
          <User className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        Хэрэглэгчийн тохиргоо
      </motion.h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-5 md:mb-8">
          <TabsTrigger value="profile" className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10">
            <User className="h-4 w-4" /> 
            <span className="mt-1 sm:mt-0">Профайл</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10">
            <CreditCard className="h-4 w-4" /> 
            <span className="mt-1 sm:mt-0">Төлбөр</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10">
            <Lock className="h-4 w-4" /> 
            <span className="mt-1 sm:mt-0">Нууцлал</span>
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
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <User className="h-5 w-5 text-primary" /> Хувийн мэдээлэл
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Хэрэглэгчийн профайлын мэдээлэл
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-4">
                    <motion.div 
                      className="flex flex-col md:flex-row gap-3 md:gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="firstName" className="text-xs md:text-sm font-medium">Нэр</Label>
                        <div className="border p-2 md:p-3 rounded-md mt-1 bg-gray-50 text-sm md:text-base">{user?.name || user?.displayName || "Хэрэглэгч"}</div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="email" className="text-xs md:text-sm font-medium">Имэйл</Label>
                        <div className="border p-2 md:p-3 rounded-md mt-1 bg-gray-50 text-sm md:text-base overflow-hidden text-ellipsis">{user?.email || "Имэйл байхгүй"}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col md:flex-row gap-3 md:gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="phone" className="text-xs md:text-sm font-medium">Утас</Label>
                        <div className="border p-2 md:p-3 rounded-md mt-1 bg-gray-50 text-sm md:text-base">{user?.phone || "Утас байхгүй"}</div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="role" className="text-xs md:text-sm font-medium">Төрөл</Label>
                        <div className="border p-2 md:p-3 rounded-md mt-1 capitalize bg-gray-50 text-sm md:text-base">
                          {user?.role === "customer" && (
                            <span className="inline-flex items-center">
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Хэрэглэгч
                              </span>
                              <span className="hidden sm:inline">Хоол захиалагч</span>
                            </span>
                          )}
                          {user?.role === "business" && (
                            <span className="inline-flex items-center">
                              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Бизнес
                              </span>
                              <span className="hidden sm:inline">Хоолны газрын эзэн</span>
                            </span>
                          )}
                          {user?.role === "delivery" && (
                            <span className="inline-flex items-center">
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mr-2">
                                Хүргэлт
                              </span>
                              <span className="hidden sm:inline">Хүргэлтийн ажилтан</span>
                            </span>
                          )}
                          {!user?.role && "Тодорхойгүй"}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 md:p-6 pt-0">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link href="/profile/user">
                      <Button variant="default" className="mobile-button px-4 md:px-5 flex gap-2 text-sm md:text-base">
                        <span>Профайл засах</span> <User className="h-4 w-4" />
                      </Button>
                    </Link>
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
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Map className="h-5 w-5 text-primary" /> Хаяг байршил
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Хүргэлтийн хаягаа тохируулах
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3 md:p-4 bg-gray-50 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        <div>
                          <Label className="font-medium text-sm md:text-base">Одоогийн хаяг</Label>
                          <p className="text-gray-600 mt-1 text-xs md:text-sm">
                            {user?.address || "Хаяг оруулаагүй байна"}
                          </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="self-end sm:self-center">
                          <Link href="/profile/user">
                            <Button variant="outline" size="sm" className="mobile-button px-3 h-9 text-xs md:text-sm">
                              <Map className="h-4 w-4 mr-1 md:mr-2" />
                              <span>Хаяг нэмэх</span>
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 md:p-4 text-center hover:border-primary/30 transition-colors">
                      <div className="text-xs md:text-sm text-gray-500">
                        Та өөрийн байршлыг зөв оруулснаар хүргэлтийг шуурхай авах боломжтой.
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
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <CreditCard className="h-5 w-5 text-primary" /> Төлбөрийн аргууд
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Төлбөрийн карт болон бусад төлбөрийн аргуудыг удирдах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4 md:p-6 pt-0">
                {cardList.map((card, index) => (
                  <motion.div 
                    key={card.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mobile-payment-card rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Том дэлгэцэнд харагдах - хэвтээ */}
                    <div className="hidden sm:flex sm:justify-between sm:items-center">
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
                    
                    {/* Утасны хэмжээнд харагдах - босоо */}
                    <div className="sm:hidden">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg text-white">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-medium text-sm">{card.type === 'visa' ? 'Visa' : 'Mastercard'}</p>
                            {card.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Үндсэн
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{card.number}</p>
                          <p className="text-xs text-muted-foreground">Дуусах хугацаа: {card.expiry}</p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg border border-dashed p-5 md:p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1 text-base">Карт нэмэх</h3>
                  <p className="text-xs md:text-sm text-muted-foreground max-w-[220px] md:max-w-none">Visa, Mastercard, болон бусад картууд.</p>
                  
                  <motion.div className="mt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/profile/user">
                      <Button className="mobile-button px-5 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Шинэ карт нэмэх
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* QPay хэрэглэх боломж */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mobile-payment-card rounded-lg border bg-gray-50 hover:border-green-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-none">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-2 md:p-3 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                        <svg className="h-6 w-6 md:h-8 md:w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-base">QPay нэмэх</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Монголын үндэсний QR төлбөрийн систем ашиглах</div>
                    </div>
                    <div className="flex items-center">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/profile/user">
                          <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                            <Plus className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Холбох</span>
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
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
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Нууцлал ба аюулгүй байдал
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Аккаунтын нууцлал ба хандалтын тохиргоо
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-4 md:p-6 pt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mobile-payment-card rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-gray-50"
                >
                  {/* Том дэлгэцэнд харагдах - хэвтээ */}
                  <div className="hidden sm:flex sm:justify-between sm:items-center">
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
                      <Link href="/profile/user">
                        <Button variant="outline" size="sm" className="px-4 flex items-center gap-2">
                          Солих <Key className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                  
                  {/* Утасны хэмжээнд харагдах - босоо */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg text-white">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Нууц үг солих</p>
                        <p className="text-xs text-muted-foreground">Аккаунтын нууц үгээ шинэчлэх</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/profile/user">
                          <Button variant="outline" size="sm" className="px-3 h-8 text-xs">
                            Солих
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mobile-payment-card rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-gray-50"
                >
                  {/* Том дэлгэцэнд харагдах - хэвтээ */}
                  <div className="hidden sm:flex sm:justify-between sm:items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-lg text-white">
                        <Bell className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Хандалтын түүх</p>
                        <p className="text-sm text-muted-foreground">Сүүлийн үеийн нэвтрэлтийн мэдээлэл</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <div className="text-xs text-gray-500">Сүүлд нэвтэрсэн:</div>
                      <div className="text-sm font-medium">Өнөөдөр, 08:12</div>
                      <div className="text-xs text-gray-500">Улаанбаатар IP: 202.9.40.XX</div>
                    </div>
                  </div>
                  
                  {/* Утасны хэмжээнд харагдах - босоо */}
                  <div className="sm:hidden">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg text-white">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Хандалтын түүх</p>
                          <p className="text-xs text-muted-foreground">Сүүлийн үеийн нэвтрэлтийн мэдээлэл</p>
                        </div>
                      </div>
                      <div className="ml-10 bg-gray-100 p-2 rounded-md">
                        <div className="text-xs font-medium">Өнөөдөр, 08:12</div>
                        <div className="text-xs text-gray-500">Улаанбаатар IP: 202.9.40.XX</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mobile-payment-card rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md bg-gray-50"
                >
                  {/* Том дэлгэцэнд харагдах - хэвтээ */}
                  <div className="hidden sm:flex sm:justify-between sm:items-center">
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
                  
                  {/* Утасны хэмжээнд харагдах - босоо */}
                  <div className="sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg text-white">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Гар утасны баталгаажуулалт</p>
                        <p className="text-xs text-muted-foreground">Нэмэлт аюулгүй байдал</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="px-3 h-8 text-xs">
                          Идэвхжүүлэх
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 px-1"
                >
                  <p className="text-xs text-gray-500">
                    Та өөрийн хувийн мэдээллийг хамгаалахын тулд шаардлагатай тохиолдолд утасны баталгаажуулалтыг идэвхжүүлэхийг зөвлөж байна.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}