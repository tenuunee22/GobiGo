import { useState } from "react";
import { motion } from "framer-motion";
import { FeatureTooltip } from "@/components/shared/feature-tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  ShoppingBag,
  Truck,
  User,
  CreditCard,
  Bell,
  Map,
  Star,
  Gift,
  Clock,
  BarChart3,
  Mail,
  Phone,
  TrendingUp,
  DollarSign,
  ListOrdered
} from "lucide-react";
const staggerDelay = 0.1;
export default function Help() {
  const [activeTab, setActiveTab] = useState("customer");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text mb-4">
          GobiGo Платформын Онцлогууд{" "}
          <span className="tada inline-block">🌟</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          GobiGo нь уламжлалт хоол хүргэлтийн үйлчилгээг орчин үеийн шийдлүүдээр
          хангаж, хэрэглэгч, ресторан, хүргэлтийн ажилчдад тохирсон өвөрмөц
          туршлагыг санал болгодог.
        </p>
      </motion.div>
      <Tabs
        defaultValue="customer"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="bg-amber-50 p-1 border border-amber-100">
            <TabsTrigger
              value="customer"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg px-6 py-2"
            >
              <User className="mr-2 h-4 w-4" />
              Хэрэглэгч
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg px-6 py-2"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ресторан & Дэлгүүр
            </TabsTrigger>
            <TabsTrigger
              value="driver"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg px-6 py-2"
            >
              <Truck className="mr-2 h-4 w-4" />
              Хүргэлтийн Ажилчин
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="customer">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Truck className="h-5 w-5 text-amber-500" />
                      <span>Захиалга Хянах</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Захиалга Хянах"
                      description="Захиалсан хоолоо бэлтгэлт, хүргэлтийн явцыг шууд дэлгэцээсээ хянах боломжтой."
                      emoji="🚚"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н хамгийн шилдэг онцлогуудын нэг бол бодит цагийн захиалга хянах систем юм. Энэ нь:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Бодит цагийн байршил хянах</li>
                          <li>Захиалгын төлөв шинэчлэлт</li>
                          <li>Хоол бэлтгэлт, хүргэлтийн хугацааны тооцоо</li>
                          <li>Хүргэлтийн жолоочтой холбогдох боломж</li>
                        </ul>
                        <p>
                          Энэ систем нь Google Maps API-г ашиглан захиалгыг хаанаас хаана хүргэж буйг зөв шууд мэдээллээр хангана.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Захиалгаа бодит цагийн байрлалтай хамт хянах
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Захиалга хийсний дараа "Миний захиалга" хэсэгт бодит цагийн
                      мэдээллийг харах боломжтой. Захиалгын төлөв нь зургаан шатнаас
                      бүрдэнэ: захиалга хүлээн авсан, баталгаажуулсан, бэлтгэж байгаа,
                      хүргэж байгаа, хүргэсэн, дууссан.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>
                      Хэрэглэгчдийн 95% нь энэ онцлогийг өндрөөр үнэлдэг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span>Ухаалаг Зөвлөмж</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Ухаалаг Зөвлөмж"
                      description="Таны хэрэглэх зуршил, дуртай хоолон дээр үндэслэн, таны амтанд тохирсон санал болгоно."
                      emoji="✨"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          Бидний хэрэглэгчид нууцлалыг нь хадгалсан машин сургалтын систем нь таны дуртай зүйлсийг таньж, ижил төстэй хоол, дэлгүүрүүдийг танд илүү хурдан олоход тусална.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Өмнөх захиалгад суурилсан зөвлөмж</li>
                          <li>Улирлын онцлох санал</li>
                          <li>Таны хайлтад тохирсон шүүлтүүр</li>
                          <li>Орон нутгийн топ рестораны зөвлөмж</li>
                        </ul>
                        <p>
                          Тухайн өдөр, цаг, байршил, цаг агаарын байдалтай уялдуулан ухаалаг зөвлөмжүүдийг танд санал болгодог.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Таны дуртай хоол, захиалгын түүхэд суурилсан зөвлөмж
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Алгоритм маань таны захиалгын түүх, дуртай хоол, үнэлгээг
                      шинжилж, таны дуртай байж болох шинэ рестораны хоолыг таньж
                      зөвлөдөг. Хэрэглэгч олон захиалга хийх тусам зөвлөмж улам
                      нарийвчлагдана.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Gift className="h-4 w-4 text-amber-500" />
                    <span>
                      Зөвлөмж ашиглан захиалсан хэрэглэгчдийн 78% нь шинэ хоол, ресторан нээж олсон.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CreditCard className="h-5 w-5 text-amber-500" />
                      <span>Хялбар Төлбөр</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Хялбар Төлбөр"
                      description="Олон төрлийн төлбөрийн хэрэгсэл ашиглан хялбар, аюулгүй төлбөр хийх."
                      emoji="💳"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н төлбөрийн систем нь төлбөр тооцоог аюулгүй, хялбар болгохоор зохион бүтээгдсэн:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Карт, мобайл банк, QPay холболт</li>
                          <li>Төлбөрийн хэрэгслээ хадгалах</li>
                          <li>Баримт, нэхэмжлэхийн түүх</li>
                          <li>Захиалга үүсгэхээс өмнө төлбөрийн тооцоо</li>
                          <li>Хуваалцах төлбөрийн систем</li>
                        </ul>
                        <p>
                          Бүх төлбөрүүд Stripe болон QPay гүйлгээгээр даамжин банк, картын мэдээллийн бүрэн аюулгүй байдлыг хангана.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Карт, мобайл банк, QPay зэрэг олон сонголттой төлбөрийн систем
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Захиалгаа баталгаажуулах үед дуртай төлбөрийн хэрэгслээ сонгоно.
                      Төлбөрийн хэрэгслээ хадгалснаар дараагийн захиалгаа илүү хурдан
                      хийх боломжтой. Бүх төлбөрийн мэдээлэл шифрлэгдэж, аюулгүй
                      байдал хангагдана.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    <span>
                      Төлбөрийн аюулгүй байдлын стандартуудыг 100% дагаж мөрддөг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Map className="h-5 w-5 text-amber-500" />
                      <span>Газрын Зураг & Байршил</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Газрын Зураг & Байршил"
                      description="Таны байршилд ойрхон газруудыг олж, зөв хаяг оруулах боломжийг олгоно."
                      emoji="🗺️"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          Google Maps-тай интеграци хийсэн GobiGo нь хаяг болон хүргэлтийн байршлыг хялбар, зөв олоход тусалдаг:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Одоогийн байршил дээр үндэслэсэн хайлт</li>
                          <li>Хүргэлтийн бүс, хязгаарын мэдээлэл</li>
                          <li>Хаягийн автомат бүрдүүлэлт</li>
                          <li>Хадгалсан байршлууд</li>
                          <li>Хоол хүргэлтийн хүрэх цагийн зөв тооцоолол</li>
                        </ul>
                        <p>
                          Хэрэглэгчид өөрийн гэр, ажлын газар, түр байрлаж буй газруудаа хадгалж, хурдан сонголт хийх боломжтой.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Таны орчин тойрны дэлгүүр, рестораныг газрын зургаар харах
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Аппликейшн нь таны GPS байршлыг ашиглан ойролцоох рестораныг
                      харуулна. Газрын зургаас шууд байршил сонгох боломжтой, мөн
                      хаягийн мэдээллийг бүрэн оруулахад тусална. Хүргэлтийн цаг нь
                      зайнаас хамаарч автоматаар тооцоологдоно.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Lightning className="h-4 w-4 text-amber-500" />
                    <span>
                      Дундажаар 30% илүү хурдан хүргэлт - зөв байршлын мэдээллийн ачаар.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Bell className="h-5 w-5 text-amber-500" />
                      <span>Мэдэгдэл</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Мэдэгдэл"
                      description="Захиалгын төлөв, хөнгөлөлт, санал болгох зэрэг мэдэгдлүүдийг авах."
                      emoji="🔔"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          Чухал үйл явдлуудыг алдахгүйн тулд GobiGo хэрэглэгчиддээ дараах мэдэгдлүүдийг хүргэнэ:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Захиалгын төлөвийн мэдэгдэл (баталгаажсан, бэлдэж байгаа, замд явж байгаа)</li>
                          <li>Таны дуртай рестораны урамшуулал, шинэ хоол</li>
                          <li>Тусгай хөнгөлөлт, урамшууллын мэдэгдэл</li>
                          <li>Хүргэлтийн ажилтан ойртох үеийн мэдэгдэл</li>
                          <li>Системийн шинэчлэл, онцлох мэдээ</li>
                        </ul>
                        <p>
                          Хэрэглэгчид аль төрлийн мэдэгдлийг авахаа тохиргооноос өөрчлөх боломжтой, мөн өдөр/шөнөөр мэдэгдэл авахаа зохицуулж болно.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Захиалгын төлөв өөрчлөгдөх бүрт мэдэгдэл
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Хэрэглэгч профайл хэсгээс авахыг хүссэн мэдэгдлийн төрлийг сонгох
                      боломжтой. Захиалгын төлөв бүр дээр шинэчлэлт гарахад мэдэгдэл
                      илгээгдэнэ. Мэдэгдлийг имэйл, текст мессеж, аппын push
                      мэдэгдлээр авах боломжтой.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>
                      Мэдэгдэл ашиглаж буй хэрэглэгчид захиалга авалтыг 40% илүү ашигладаг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Gift className="h-5 w-5 text-amber-500" />
                      <span>Урамшууллын Хөтөлбөр</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Урамшууллын Хөтөлбөр"
                      description="Захиалга бүрээс оноо цуглуулж хөнгөлөлт, бэлэг урамшууллыг авах."
                      emoji="🎁"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo дээр захиалга хийх бүрт та урамшууллын оноо цуглуулж, олон төрлийн хөнгөлөлт авах боломжтой:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Захиалгын үнийн 5% урамшууллын оноо</li>
                          <li>Онооны түвшинд суурилсан статус (Хүрэл, Мөнгөн, Алтан)</li>
                          <li>Түвшин бүрт өвөрмөц хөнгөлөлт</li>
                          <li>Оноогоор солих бүтээгдэхүүн</li>
                          <li>Хязгаарлагдмал урамшуулал, тусгай санал</li>
                        </ul>
                        <p>
                          Тогтмол захиалга хийдэг, найзаа урих, шинэ рестораныг анх туршиж үзэх зэрэг үйлдлээр нэмэлт оноо цуглуулах боломжтой.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Оноо цуглуулж, хөнгөлөлт, бэлэг урамшуулал авах
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Захиалга бүрт үнийн 5% оноо цуглуулна. Цуглуулсан оноогоороо
                      үнэгүй хүргэлт, хоолны хөнгөлөлт, купон авах боломжтой. Онооны
                      түвшин өсөх тусам олгох хөнгөлөлт, боломж нэмэгдэнэ. Онооны
                      түвшин, урамшууллыг "Миний профайл" хэсгээс харах боломжтой.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Repeat className="h-4 w-4 text-amber-500" />
                    <span>
                      Урамшууллын хөтөлбөр ашиглагч хэрэглэгчид 60% илүү тогтмол захиалдаг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        <TabsContent value="business">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BarChart3 className="h-5 w-5 text-amber-500" />
                      <span>Бизнес Аналитик</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Бизнес Аналитик"
                      description="Борлуулалт, захиалга, үнэлгээний тайлан, дүн шинжилгээг авах."
                      emoji="📊"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н бизнес эзэмшигчдэд зориулсан аналитик хэрэгслүүд бизнесийн шийдвэр гаргахад туслах мэдээллээр хангана:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Борлуулалтын тайлан (өдөр, 7 хоног, сар)</li>
                          <li>Хамгийн их борлуулалттай бүтээгдэхүүн</li>
                          <li>Оргил цагийн үзүүлэлт</li>
                          <li>Хэрэглэгчийн үнэлгээ, сэтгэгдлийн дүн шинжилгээ</li>
                          <li>Хөрвөлтийн харьцаа (нүүр хуудас үзсэн/захиалга хийсэн)</li>
                        </ul>
                        <p>
                          Мэдээллийг ойлгомжтой графикаар харуулж, дата экспортлох боломжтой бөгөөд бизнесийн стратеги шийдвэр гаргахад туслана.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Дэлгэрэнгүй бизнес статистик, борлуулалтын график
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Бизнесийн хяналтын самбараас хугацааны интервал, категори
                      сонгон статистик харах боломжтой. Борлуулалтын чиг хандлага,
                      хэрэглэгчийн зан төлөв, санал хүсэлтийн дүн шинжилгээг
                      автоматаар гаргаж, хэрэглэгчид танд юу дуртайг харуулна.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span>
                      Аналитик ашигладаг дэлгүүрүүдийн орлого дунджаар 22% өсдөг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ShoppingBag className="h-5 w-5 text-amber-500" />
                      <span>Меню Удирдлага</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Меню Удирдлага"
                      description="Хялбархан бүтээгдэхүүн, категори, үнэ нэмэх, засах, устгах."
                      emoji="📋"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н меню удирдлагын систем нь бизнесийг өөрийн онлайн меню хялбархан шинэчлэх боломжоор хангана:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Drag-and-drop хялбар интерфейс</li>
                          <li>Бүтээгдэхүүний дэлгэрэнгүй тодорхойлолт</li>
                          <li>Зураг, үнэ, хүртээмжтэй байдлын удирдлага</li>
                          <li>Категори, шүүлтүүрийн зохион байгуулалт</li>
                          <li>Хязгаарлагдмал, улирлын бүтээгдэхүүн тохиргоо</li>
                        </ul>
                        <p>
                          Менюг бүрэн цаг тухайд нь шинэчлэх боломжтой, ямар ч төхөөрөмжөөс удирдах боломжтой.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Бүтээгдэхүүн, үнэ, зураг шинэчлэх хялбар хэрэгсэл
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Бизнес хяналтын самбараас "Бүтээгдэхүүн" хэсэгт орж шинэ
                      бүтээгдэхүүн нэмэх, одоо байгааг засах, өөрчлөх боломжтой.
                      Категори үүсгэх, бүтээгдэхүүний хүртээмжтэй байдлыг тохируулах,
                      загварчлах зэрэг нэмэлт боломжуудыг санал болгодог.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Smile className="h-4 w-4 text-amber-500" />
                    <span>
                      Идэвхитэй меню удирдлага хийдэг бизнесүүд хэрэглэгчийн сэтгэл ханамж 35% өндөр.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ListOrdered className="h-5 w-5 text-amber-500" />
                      <span>Захиалга Удирдлага</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Захиалга Удирдлага"
                      description="Ирсэн захиалгуудыг хянах, баталгаажуулах, төлөв өөрчлөх боломж."
                      emoji="📦"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н захиалга удирдлагын систем нь бизнесүүдэд ирсэн захиалгуудын урсгалыг үр ашигтай удирдах боломжийг олгоно:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Бодит цагийн захиалгын мэдэгдэл</li>
                          <li>Захиалга баталгаажуулах/татгалзах</li>
                          <li>Төлөв шинэчлэх (хүлээн авсан, бэлдэж байгаа, хүргэхэд бэлэн)</li>
                          <li>Бэлтгэх хугацаа тохируулах</li>
                          <li>Хэрэглэгчтэй шууд харилцах боломж</li>
                        </ul>
                        <p>
                          Систем нь ачаалалтай цагт захиалгын урсгалыг удирдахад тусалж, хүлээгдэж буй захиалгын төлөв, хугацааны талаар хэрэглэгчдэд мэдээлнэ.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Ирж буй захиалгуудыг шууд удирдах хяналтын самбар
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Шинэ захиалга ирэхэд дуут мэдэгдэл өгнө. Захиалгыг
                      баталгаажуулах, бэлтгэх явцын төлөвийг шинэчлэх боломжтой. Хэрэв
                      захиалганд тусгай хүсэлт, нэмэлт чиглэл байвал харах боломжтой.
                      Захиалгын түүх, тайланг удирдлагын самбараас харах боломжтой.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>
                      Захиалга боловсруулах хугацааг дунджаар 45% хурдасгадаг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        <TabsContent value="driver">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Map className="h-5 w-5 text-amber-500" />
                      <span>Хүргэлтийн Чиглэл</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Хүргэлтийн Чиглэл"
                      description="Google Maps-тай холбогдсон хамгийн богино зам, дэлгэрэнгүй чиглэл."
                      emoji="🧭"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н хүргэлтийн жолооч нарт зориулсан навигацийн систем нь дараах давуу талуудтай:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Бодит цагийн замын нөхцөл, түгжрэлд тохирсон чиглэл</li>
                          <li>Оновчтой маршрутын тооцоолол (олон хүргэлтийн хувьд)</li>
                          <li>Зогсоол, барилгын орц, хаалганы мэдээлэл</li>
                          <li>Цаг агаарын нөхцөлд тохирсон анхааруулга</li>
                          <li>Google Maps-тай бүрэн интеграци хийсэн</li>
                        </ul>
                        <p>
                          Жолооч нар хэрэглэгчийн байршил руу хамгийн богино, хурдан замыг олж, чирэгдэл багатай хүргэлт хийх боломжтой.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Хүргэлт хийх газар руу хамгийн хурдан зам
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Жолооч нар захиалга хүлээн авмагц системээс авто чиглүүлэгч
                      ажиллаж эхэлнэ. Замын нөхцөл байдал, түгжрэлийг тооцож хамгийн
                      хурдан зам санал болгоно. Хэрэв хэд хэдэн захиалга авсан бол
                      хамгийн үр ашигтай дарааллаар хүргэх чиглэлийг санал болгоно.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <Truck className="h-4 w-4 text-amber-500" />
                    <span>
                      Хүргэлтийн хурдыг 25%, үр ашгийг 30% нэмэгдүүлдэг.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span>Уян Хатан Хуваарь</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Уян Хатан Хуваарь"
                      description="Өөрийн хүссэн цагаар, чөлөөтэй ажиллах боломж."
                      emoji="⏰"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н хүргэлтийн ажилчид өөрсдийн ажлын цагийг өөрсдөө захиран зохицуулах боломжтой:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Ажиллах цагаа сонгох</li>
                          <li>Оргил ачааллын цагт нэмэлт урамшуулалтай ажиллах</li>
                          <li>Долоо хоногийн өдрүүдээр тохиргоо хийх</li>
                          <li>Яаралтай амрах, ажиллах боломж</li>
                          <li>Ажлын байршил, бүсээ сонгох</li>
                        </ul>
                        <p>
                          Системээс аль хэсэгт хүргэлтийн эрэлт их байгааг харуулж, жолооч нарт зориудын өндөр үнэтэй захиалга гүйцэтгэх боломжийг олгоно.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Өөрийн цагаар ажиллах, орлогоо нэмэгдүүлэх боломж
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Хүргэлтийн ажилчин аппликэйшнээс "Идэвхтэй" төлөвт шилжээд
                      захиалга хүлээн авч эхэлнэ. Ажиллах хугацааг долоо хоногоор
                      урьдчилан төлөвлөх эсвэл өдөр тутам шийдэх боломжтой. Оргил
                      цагт илүү өндөр урамшуулалтай захиалга хүлээн авах
                      боломжтой.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span>
                      Уян хатан хуваарьтай жолооч нар дунджаар 40% илүү орлого олдог.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
            {}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-amber-100 h-full">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <DollarSign className="h-5 w-5 text-amber-500" />
                      <span>Бодит Орлого</span>
                    </CardTitle>
                    <FeatureTooltip
                      title="Бодит Орлого"
                      description="Хэр хурдан хэр их мөнгө олж байгаагаа бодит цагт харах."
                      emoji="💰"
                      showDetailedView={true}
                    >
                      <div className="space-y-4">
                        <p>
                          GobiGo-н хүргэлтийн ажилчид үр дүнгээ шууд харж, орлогын зорилт тавьж ажиллах боломжтой:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Бодит цагийн орлогын тооцоо</li>
                          <li>Өдөр, долоо хоногийн дүнгийн харьцуулалт</li>
                          <li>Орлогын зорилт тавих боломж</li>
                          <li>Бэлэн мөнгө, цахим төлбөрийн задаргаа</li>
                          <li>Урамшуулал, нэмэлт орлогын дэлгэрэнгүй</li>
                        </ul>
                        <p>
                          Ажилчид дуусгасан захиалга бүрээс хэдэн төгрөг хийж байгаагаа шууд харж, төлбөр хэзээ орохыг мэдэх боломжтой.
                        </p>
                      </div>
                    </FeatureTooltip>
                  </div>
                  <CardDescription>
                    Хийсэн хүргэлт бүрийн орлогыг бодит цагт харах
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 text-amber-800">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Хэрхэн ажилладаг вэ?
                    </h4>
                    <p className="text-sm">
                      Жолооч нар захиалга бүр гүйцэтгэх бүрд захиалгын орлого шууд
                      бүртгэгдэнэ. Өдөр, долоо хоног, сарын орлогын графикаас өөрийн
                      бүтээмжээ харах боломжтой. Түүнчлэн ямар цагт хамгийн их
                      орлого олох боломжтойг харуулсан мэдээ, зөвлөгөөг өгдөг.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-800 text-sm">
                    <ChartBarIcon className="h-4 w-4 text-amber-500" />
                    <span>
                      Орлогоо хянадаг жолооч нар илүү үр ашигтай замыг сонгодог.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Асуулт байна уу?</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 gap-2">
              <Mail className="h-4 w-4" />
              Бидэнтэй холбогдох
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="border-amber-200 gap-2">
              <Phone className="h-4 w-4" />
              976-7711-5566
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function Lightning(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-1 4 3-5h-4l1-4Z" />
    </svg>
  );
}
function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function Award(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
function Repeat(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function Settings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function Layout(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}
function Navigation(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
function PieChart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
function ChartBarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}
function Smile(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http:
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}