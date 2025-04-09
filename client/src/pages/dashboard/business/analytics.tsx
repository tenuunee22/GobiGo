import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IngredientVisualization, getRandomColor, getIngredientIcon } from '@/components/data-visualization/ingredient-visualization';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function BusinessAnalytics() {
  const { user } = useAuth();
  
  // Sample data for ingredient visualization
  const [ingredientData] = useState([
    { id: '1', name: 'Үхрийн мах', count: 120, icon: getIngredientIcon('мах'), color: getRandomColor() },
    { id: '2', name: 'Төмс', count: 95, icon: getIngredientIcon('төмс'), color: getRandomColor() },
    { id: '3', name: 'Сонгино', count: 85, icon: getIngredientIcon('сонгино'), color: getRandomColor() },
    { id: '4', name: 'Улаан лооль', count: 75, icon: getIngredientIcon('улаан лооль'), color: getRandomColor() },
    { id: '5', name: 'Өндөг', count: 65, icon: getIngredientIcon('өндөг'), color: getRandomColor() },
    { id: '6', name: 'Будаа', count: 60, icon: getIngredientIcon('будаа'), color: getRandomColor() },
    { id: '7', name: 'Бяслаг', count: 55, icon: getIngredientIcon('бяслаг'), color: getRandomColor() },
    { id: '8', name: 'Сармис', count: 45, icon: getIngredientIcon('сармис'), color: getRandomColor() },
  ]);

  // Sample data for category performance
  const categoryData = [
    { name: 'Үндсэн хоол', value: 45, color: '#3B82F6' },
    { name: 'Салат', value: 25, color: '#10B981' },
    { name: 'Амттан', value: 15, color: '#F59E0B' },
    { name: 'Уух зүйл', value: 15, color: '#EC4899' },
  ];

  // Sample data for monthly sales
  const monthlySalesData = [
    { name: '1-р сар', sales: 1200000 },
    { name: '2-р сар', sales: 1900000 },
    { name: '3-р сар', sales: 2100000 },
    { name: '4-р сар', sales: 1800000 },
    { name: '5-р сар', sales: 2400000 },
    { name: '6-р сар', sales: 2700000 },
    { name: '7-р сар', sales: 2900000 },
    { name: '8-р сар', sales: 3100000 },
    { name: '9-р сар', sales: 2800000 },
    { name: '10-р сар', sales: 2500000 },
    { name: '11-р сар', sales: 2200000 },
    { name: '12-р сар', sales: 3200000 },
  ];

  const formatSales = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M₮`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K₮`;
    }
    return `${value}₮`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Статистик Дүн Шинжилгээ
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.businessName || user?.name} - ний орц, борлуулалтын дүн шинжилгээ
        </p>
      </div>

      <Tabs defaultValue="ingredients" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="ingredients" className="text-base">Орцны шинжилгээ</TabsTrigger>
          <TabsTrigger value="categories" className="text-base">Ангиллын борлуулалт</TabsTrigger>
          <TabsTrigger value="sales" className="text-base">Сарын борлуулалт</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="space-y-6">
          <IngredientVisualization 
            data={ingredientData} 
            title="Хамгийн их борлуулалттай орц" 
          />
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Орцны шинжилгээ</h3>
              <p className="text-gray-700 mb-4">
                Дээрх график нь таны хамгийн их борлуулалттай орцнуудыг харуулж байна. 
                Тэдгээр орцнуудыг онцлон хийсэн хоолнуудыг хүмүүс илүү их захиалдаг бололтой. 
                Тиймээс эдгээр орцнуудыг хангамж сайтай байлгах, нөөцийг оновчтой тооцоолох нь чухал.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Санал болгох арга хэмжээ:</strong>
                <ul className="list-disc ml-6 mt-2">
                  <li>Эдгээр орц хэрэглэсэн шинэ хоолны жор гаргаж үзээрэй</li>
                  <li>Хамгийн их хэрэглэгддэг орцнуудыг нөөцлөх, тэдгээрт хөнгөлөлт авах боломжийг судлах</li>
                  <li>Эдгээр орцоор хийсэн онцлох хоолнуудаа хэрэглэгчиддээ сурталчлах</li>
                </ul>
              </p>
              
              <div className="flex justify-end mt-4">
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-500">
                  Дэлгэрэнгүй тайлан татах
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Ангиллаар борлуулалт
              </h3>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      className="bounce-soft"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Ангиллын шинжилгээ</h4>
                <p className="text-gray-700 mb-3">
                  Үндсэн хоолны ангилал нь таны борлуулалтын хамгийн том хувийг эзэлж байна. 
                  Амттан болон уух зүйлийн борлуулалтыг нэмэгдүүлэх боломжтой.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center slide-in-bottom" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-lg font-bold" style={{ color: category.color }}>{category.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Сарын борлуулалт (2025)
              </h3>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlySalesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatSales} />
                    <Tooltip formatter={(value) => formatSales(value as number)} />
                    <Legend />
                    <Bar 
                      dataKey="sales" 
                      name="Борлуулалт" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Борлуулалтын чиг хандлага</h4>
                <p className="text-gray-700 mb-3">
                  2025 оны борлуулалт тогтмол өсөж байгаа бөгөөд зуны саруудад онцгой өндөр байна. 
                  12-р сард хамгийн өндөр борлуулалттай байж, 3.2 сая төгрөгт хүрсэн байна.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center slide-in-left">
                    <div className="text-sm text-green-600">Хамгийн өндөр</div>
                    <div className="text-green-700 text-lg font-bold">12-р сар: 3.2 сая₮</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center slide-in-right">
                    <div className="text-sm text-blue-600">Дундаж борлуулалт</div>
                    <div className="text-blue-700 text-lg font-bold">2.4 сая₮ / сар</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}