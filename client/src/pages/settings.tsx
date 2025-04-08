import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Check, CreditCard, Key, Lock, Map, Plus, Shield, ShieldCheck, Trash2, User } from "lucide-react";
export default function Settings() {
  const { user } = useAuth();
  const cardList = [
    { id: "1", type: "visa", number: "•••• •••• •••• 4242", expiry: "12/24", isDefault: true },
    { id: "2", type: "mastercard", number: "•••• •••• •••• 8840", expiry: "06/25", isDefault: false },
  ];
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
      <motion.h1 
        className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 rounded-lg text-white">
          <User className="h-6 w-6" />
        </span>
        Хэрэглэгчийн тохиргоо
      </motion.h1>
      <Tabs defaultValue="profile" className="w-full fade-in">
        <TabsList className="grid w-full grid-cols-3 mb-5 md:mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-1 rounded-xl shadow-sm">
          <TabsTrigger 
            value="profile" 
            className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <span className="flex items-center gap-1">
              <span className="jelly"><User className="h-4 w-4" /></span>
              <span className="mt-1 sm:mt-0">Профайл</span>
              <span className="text-xs pulse ml-1">👤</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <span className="flex items-center gap-1">
              <span className="bounce-soft"><CreditCard className="h-4 w-4" /></span>
              <span className="mt-1 sm:mt-0">Төлбөр</span>
              <span className="text-xs tada ml-1">💳</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className="text-xs md:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 h-14 sm:h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <span className="flex items-center gap-1">
              <span className="wiggle"><Lock className="h-4 w-4" /></span>
              <span className="mt-1 sm:mt-0">Нууцлал</span>
              <span className="text-xs jelly ml-1">🔒</span>
            </span>
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
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mobile-payment-card rounded-lg border bg-gray-50 hover:border-green-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-none">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-2 md:p-3 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                        <span className="font-bold text-xl md:text-2xl">Q</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm md:text-base">QPay дансаар төлөх</h3>
                      <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                        Монгол дотоодын бүх банкны картаар шууд төлөх
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="h-8 rounded-full bg-gradient-to-r from-green-600 to-teal-600 text-xs">
                            <span className="mr-1">+</span> QPay холбох
                          </Button>
                        </motion.div>
                        <span className="text-xs text-gray-500">Шуурхай төлөлт</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="privacy">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden border-purple-100 hover:shadow-md transition-all duration-300">
                <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-violet-50">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-1.5 rounded-md wiggle">
                      <Lock className="h-4 w-4" />
                    </span>
                    <span className="bg-gradient-to-r from-purple-700 to-violet-700 text-transparent bg-clip-text">
                      Хандалтын тохиргоо
                    </span>
                    <span className="text-xs tada ml-1">🔐</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Нууц үг болон бусад аюулгүй байдлын тохиргоо
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-4 space-y-4 fade-in-delayed">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-200 transition-colors shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor" className="text-sm font-medium flex items-center">
                        <span className="text-xs bounce-soft mr-1.5">🔑</span>
                        Хоёр үе шаттай баталгаажуулалт
                      </Label>
                      <p className="text-xs text-muted-foreground">Нэмэлт аюулгүй байдлын хамгаалалт идэвхжүүлэх</p>
                    </div>
                    <Switch id="twoFactor" className="ml-3 data-[state=checked]:bg-purple-600" />
                  </div>
                  <div className="bg-white rounded-md overflow-hidden p-3 shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg text-white jelly">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm flex items-center">
                          <span>Нууц үг солих</span>
                          <span className="text-xs pulse ml-1">🔄</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Аккаунтын нууц үгээ шинэчлэх</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/profile/user">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="px-3 h-8 text-xs hover:bg-purple-50 hover:text-purple-700 border-purple-200"
                          >
                            <span className="flex items-center gap-1">
                              <span>Солих</span>
                              <Key className="h-3 w-3 wiggle" />
                            </span>
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-blue-100 hover:shadow-md transition-all duration-300">
                <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-md jelly">
                      <Bell className="h-4 w-4" />
                    </span>
                    <span className="bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">
                      Мэдэгдлийн тохиргоо
                    </span>
                    <span className="text-xs bounce-soft ml-1">🔔</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Мэдэгдэл хүлээн авах тохиргоо
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-4 space-y-4 fade-in-delayed">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderNotifications" className="text-sm font-medium flex items-center">
                        <span className="text-xs tada mr-1.5">📦</span>
                        Захиалгын мэдэгдэл
                      </Label>
                      <p className="text-xs text-muted-foreground">Захиалга, хүргэлтийн төлөв өөрчлөгдөхөд мэдэгдэл авах</p>
                    </div>
                    <Switch id="orderNotifications" defaultChecked className="ml-3 data-[state=checked]:bg-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingNotifications" className="text-sm font-medium flex items-center">
                        <span className="text-xs wiggle mr-1.5">🎁</span>
                        Урамшууллын мэдэгдэл
                      </Label>
                      <p className="text-xs text-muted-foreground">Хямдрал, урамшууллын талаарх мэдэгдэл авах</p>
                    </div>
                    <Switch id="marketingNotifications" className="ml-3 data-[state=checked]:bg-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors shadow-sm">
                    <div className="space-y-0.5">
                      <Label htmlFor="securityNotifications" className="text-sm font-medium flex items-center">
                        <span className="text-xs pulse mr-1.5">🔒</span>
                        Аюулгүй байдлын мэдэгдэл
                      </Label>
                      <p className="text-xs text-muted-foreground">Шинэ нэвтрэлт, бусад аюулгүй байдлын мэдэгдэл авах</p>
                    </div>
                    <Switch id="securityNotifications" defaultChecked className="ml-3 data-[state=checked]:bg-blue-600" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 md:p-6 pt-0 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs hover:bg-red-50 hover:text-red-700 border-red-100 transition-all duration-300"
                  >
                    <span className="flex items-center">
                      <span>Бүх мэдэгдэл унтраах</span>
                      <span className="ml-1 text-xs jelly">🔕</span>
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden border-teal-100 hover:shadow-md transition-all duration-300">
                <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-teal-50 to-green-50">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <span className="bg-gradient-to-r from-teal-600 to-green-600 text-white p-1.5 rounded-md bounce-soft">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <span className="bg-gradient-to-r from-teal-700 to-green-700 text-transparent bg-clip-text">
                      Хувийн мэдээллийн тохиргоо
                    </span>
                    <span className="text-xs tada ml-1">🛡️</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Таны мэдээллийн хадгалалт, хуваалцалтын тохиргоо
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-4 space-y-4 fade-in-delayed">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-teal-100 hover:border-teal-200 transition-colors shadow-sm">
                    <div className="space-y-0.5 mb-2 sm:mb-0">
                      <Label className="text-sm font-medium flex items-center">
                        <span className="text-xs jelly mr-1.5">📍</span>
                        Байршлын мэдээлэл
                      </Label>
                      <p className="text-xs text-muted-foreground">Таны байршлын мэдээллийг хэрхэн ашиглах тохиргоо</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs hover:bg-teal-50 hover:text-teal-700 border-teal-200 transition-all duration-300"
                    >
                      <span className="flex items-center">
                        <span>Тохируулах</span>
                        <span className="ml-1 text-xs wiggle">⚙️</span>
                      </span>
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-teal-100 hover:border-teal-200 transition-colors shadow-sm">
                    <div className="space-y-0.5 mb-2 sm:mb-0">
                      <Label htmlFor="cookiePolicy" className="text-sm font-medium flex items-center">
                        <span className="text-xs bounce-soft mr-1.5">🍪</span>
                        Cookie-н тохиргоо
                      </Label>
                      <p className="text-xs text-muted-foreground">Cookie ашиглалтын тохиргоог удирдах</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs hover:bg-green-50 hover:text-green-700 border-green-200 transition-all duration-300"
                      >
                        <span className="flex items-center">
                          <span>Cookie зөвшөөрөх</span>
                          <span className="ml-1 text-xs pulse">✅</span>
                        </span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs hover:bg-red-50 hover:text-red-700 border-red-200 transition-all duration-300"
                      >
                        <span className="flex items-center">
                          <span>Cookie хаах</span>
                          <span className="ml-1 text-xs tada">❌</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-teal-100 hover:border-teal-200 transition-colors shadow-sm">
                    <div className="space-y-0.5 mb-2 sm:mb-0">
                      <Label className="text-sm font-medium flex items-center">
                        <span className="text-xs wiggle mr-1.5">📂</span>
                        Миний өгөгдөл
                      </Label>
                      <p className="text-xs text-muted-foreground">Таны бүх мэдээллийг харах, татаж авах</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs hover:bg-blue-50 hover:text-blue-700 border-blue-200 transition-all duration-300"
                      >
                        <span className="flex items-center">
                          <span>Өгөгдөл татах</span>
                          <span className="ml-1 text-xs bounce-soft">📥</span>
                        </span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="text-xs transition-all duration-300 bg-gradient-to-r from-red-500 to-rose-600"
                      >
                        <span className="flex items-center">
                          <span>Бүгдийг устгах</span>
                          <span className="ml-1 text-xs jelly">🗑️</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
