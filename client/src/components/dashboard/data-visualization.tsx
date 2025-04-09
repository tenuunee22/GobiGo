import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Food ingredient icons with their associated data
const INGREDIENTS = [
  { name: "Мах", icon: "🥩", count: 56, color: "#FF6B6B" },
  { name: "Будаа", icon: "🍚", count: 42, color: "#F6CD61" },
  { name: "Ногоо", icon: "🥦", count: 38, color: "#4ECDC4" },
  { name: "Талх", icon: "🍞", count: 29, color: "#E5C59E" },
  { name: "Жимс", icon: "🍎", count: 24, color: "#FF8C64" },
  { name: "Өндөг", icon: "🥚", count: 18, color: "#F0F3BD" },
];

// Sales data for charts
const DAILY_DATA = [
  { name: 'Даваа', value: 120000, icon: '📊' },
  { name: 'Мягмар', value: 150000, icon: '📈' },
  { name: 'Лхагва', value: 180000, icon: '📈' },
  { name: 'Пүрэв', value: 220000, icon: '📈' },
  { name: 'Баасан', value: 250000, icon: '📈' },
  { name: 'Бямба', value: 280000, icon: '📈' },
  { name: 'Ням', value: 190000, icon: '📉' },
];

const WEEKLY_DATA = [
  { name: '1-р 7 хоног', value: 800000, icon: '📊' },
  { name: '2-р 7 хоног', value: 1200000, icon: '📈' },
  { name: '3-р 7 хоног', value: 950000, icon: '📉' },
  { name: '4-р 7 хоног', value: 1400000, icon: '📈' },
];

const MONTHLY_DATA = [
  { name: '1-р сар', value: 3500000, icon: '📊' },
  { name: '2-р сар', value: 4200000, icon: '📈' },
  { name: '3-р сар', value: 3800000, icon: '📉' },
  { name: '4-р сар', value: 4500000, icon: '📈' },
  { name: '5-р сар', value: 5100000, icon: '📈' },
  { name: '6-р сар', value: 4800000, icon: '📉' },
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-medium">{label}</p>
        <p className="text-amber-500 font-bold">
          {payload[0].value.toLocaleString()}₮
        </p>
      </div>
    );
  }
  return null;
};

export function InteractiveIngredients() {
  // Animation controls for bouncing effect
  const controls = useAnimation();
  
  // State to track which ingredient is currently highlighted
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Function to start bouncing animation
  const startBouncing = (index: number) => {
    setActiveIndex(index);
    controls.start(i => ({
      y: i === index ? [0, -20, 0] : 0,
      scale: i === index ? [1, 1.2, 1] : 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }));
  };
  
  // Automatically bounce ingredients in sequence
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const autoBounce = () => {
      const nextIndex = (activeIndex === null ? 0 : (activeIndex + 1) % INGREDIENTS.length);
      startBouncing(nextIndex);
      
      // Schedule next bounce
      timeout = setTimeout(autoBounce, 2000);
    };
    
    autoBounce();
    
    return () => clearTimeout(timeout);
  }, [activeIndex, INGREDIENTS.length, controls]);
  
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
            Хамгийн их захиалагдсан орцууд
          </span>
          <span className="tada inline-block">🍲</span>
        </CardTitle>
        <CardDescription>Сүүлийн 7 хоногийн захиалгын мэдээлэл</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
          {INGREDIENTS.map((item, index) => (
            <motion.div
              key={item.name}
              className="flex flex-col items-center cursor-pointer"
              custom={index}
              animate={controls}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startBouncing(index)}
            >
              <motion.div 
                className={`text-4xl mb-2 ${activeIndex === index ? 'drop-shadow-lg' : ''}`}
              >
                {item.icon}
              </motion.div>
              <p className="text-center text-sm font-medium">{item.name}</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${activeIndex === index ? 'bg-amber-100 text-amber-800' : ''}`}
              >
                {item.count}
              </Badge>
            </motion.div>
          ))}
        </div>
        
        <div className="h-[200px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INGREDIENTS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {INGREDIENTS.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    fillOpacity={activeIndex === index ? 1 : 0.7} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesDataVisualization() {
  const [activeTab, setActiveTab] = useState("daily");
  
  const getDataForTab = () => {
    switch (activeTab) {
      case "daily": return DAILY_DATA;
      case "weekly": return WEEKLY_DATA;
      case "monthly": return MONTHLY_DATA;
      default: return DAILY_DATA;
    }
  };
  
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
            Борлуулалтын мэдээлэл
          </span>
          <span className="tada inline-block">💰</span>
        </CardTitle>
        <CardDescription>Хугацааны хооронд борлуулсан бүтээгдэхүүний мэдээлэл</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-amber-50">
            <TabsTrigger 
              value="daily"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              Өдөр тутам
            </TabsTrigger>
            <TabsTrigger 
              value="weekly"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              7 хоног
            </TabsTrigger>
            <TabsTrigger 
              value="monthly"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
            >
              Сар
            </TabsTrigger>
          </TabsList>
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getDataForTab()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            {getDataForTab().map((item, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-amber-600 font-semibold">
                  {(item.value / 1000).toFixed(0)}K₮
                </div>
              </motion.div>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}