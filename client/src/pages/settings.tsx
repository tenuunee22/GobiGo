import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Globe, Lock, Palette, User, Map, CreditCard, Languages, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [language, setLanguage] = useState("mn");
  const [theme, setTheme] = useState("system");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Тохиргоо</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-2">
            <User className="h-4 w-4" /> Профайл
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col sm:flex-row items-center gap-2">
            <Bell className="h-4 w-4" /> Мэдэгдэл
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex flex-col sm:flex-row items-center gap-2">
            <Palette className="h-4 w-4" /> Харагдац
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
            <Card>
              <CardHeader>
                <CardTitle>Хувийн мэдээлэл</CardTitle>
                <CardDescription>
                  Хэрэглэгчийн профайлын мэдээлэл шинэчлэх
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="firstName">Нэр</Label>
                      <div className="border p-3 rounded-md mt-1">{user?.name || user?.displayName || "Хэрэглэгч"}</div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="email">Имэйл</Label>
                      <div className="border p-3 rounded-md mt-1">{user?.email || "Имэйл байхгүй"}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="phone">Утас</Label>
                      <div className="border p-3 rounded-md mt-1">{user?.phone || "Утас байхгүй"}</div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="role">Төрөл</Label>
                      <div className="border p-3 rounded-md mt-1 capitalize">
                        {user?.role === "customer" && "Хэрэглэгч"}
                        {user?.role === "business" && "Бизнес эзэмшигч"}
                        {user?.role === "delivery" && "Хүргэлтийн ажилтан"}
                        {!user?.role && "Тодорхойгүй"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="default">Засах</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Хаяг байршил</CardTitle>
                <CardDescription>
                  Хүргэлтийн хаягаа тохируулах
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Одоогийн хаяг</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user?.address || "Хаяг оруулаагүй байна"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Map className="h-4 w-4" />
                      Хаяг нэмэх
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Мэдэгдэл</CardTitle>
              <CardDescription>
                Мэдэгдэл хүлээн авах тохиргоог удирдах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Бүх мэдэгдэл</span>
                  <span className="font-normal text-sm text-muted-foreground">Мэдэгдлийг бүгдийг идэвхжүүлэх эсвэл хаах</span>
                </Label>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="order-updates" className="flex flex-col space-y-1">
                  <span>Захиалгын шинэчлэлт</span>
                  <span className="font-normal text-sm text-muted-foreground">Захиалгын төлөв өөрчлөгдөх үед мэдэгдэл авах</span>
                </Label>
                <Switch 
                  id="order-updates" 
                  checked={orderUpdates}
                  onCheckedChange={setOrderUpdates}
                  disabled={!notificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Маркетинг имэйл</span>
                  <span className="font-normal text-sm text-muted-foreground">Урамшуулал, хямдрал, шинэ нэмэгдсэн зүйлсийн талаар мэдээлэл хүлээн авах</span>
                </Label>
                <Switch 
                  id="marketing" 
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                  disabled={!notificationsEnabled}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Хадгалах</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Харагдац ба хэл</CardTitle>
              <CardDescription>
                Апп-н харагдац ба хэлний тохиргоо
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-medium">Харагдацын горим</h3>
                <RadioGroup 
                  defaultValue={theme} 
                  onValueChange={setTheme}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Palette className="mb-3 h-6 w-6" />
                      Цайвар
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Palette className="mb-3 h-6 w-6" />
                      Бараан
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Palette className="mb-3 h-6 w-6" />
                      Системийн
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Хэл</h3>
                <RadioGroup 
                  defaultValue={language} 
                  onValueChange={setLanguage}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="mn" id="mn" className="sr-only" />
                    <Label
                      htmlFor="mn"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6" />
                        <span>Монгол</span>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="en" id="en" className="sr-only" />
                    <Label
                      htmlFor="en"
                      className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6" />
                        <span>English</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Хадгалах</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Төлбөрийн аргууд</CardTitle>
              <CardDescription>
                Төлбөрийн карт болон бусад төлбөрийн аргуудыг удирдах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Төлбөрийн карт</p>
                      <p className="text-sm text-muted-foreground">Visa/Mastercard төлбөрийн картаар төлөх</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Карт нэмэх</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Нууцлал ба аюулгүй байдал</CardTitle>
              <CardDescription>
                Аккаунтын нууцлал ба хандалтын тохиргоо
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Нууц үг солих</p>
                      <p className="text-sm text-muted-foreground">Аккаунтын нууц үгээ шинэчлэх</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Солих</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}