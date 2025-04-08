import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Store, Utensils, Truck } from 'lucide-react';
import { useLocation } from 'wouter';
export function RoleSelection() {
  const { user, completeRoleSelection } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleRoleSelection = async (role: "customer" | "business" | "delivery") => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await completeRoleSelection(role);
      toast({
        title: "Хэрэглэгчийн төрөл амжилттай тохируулагдлаа",
        description: "Тавтай морил!",
      });
      switch(role) {
        case 'business':
          setLocation('/dashboard/store');
          break;
        case 'delivery':
          setLocation('/dashboard/driver');
          break;
        case 'customer':
        default:
          setLocation('/dashboard');
          break;
      }
    } catch (error) {
      console.error("Error setting user role:", error);
      toast({
        title: "Алдаа гарлаа",
        description: "Хэрэглэгчийн төрөл тохируулахад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  const roleOptions = [
    { 
      id: "customer", 
      title: "Хэрэглэгч",
      description: "Хоол ба бараа захиалах",
      icon: <Store className="h-12 w-12 text-blue-500" />,
      color: "from-blue-400 to-blue-600"
    },
    { 
      id: "business", 
      title: "Бизнес",
      description: "Ресторан эсвэл дэлгүүр",
      icon: <Utensils className="h-12 w-12 text-purple-500" />,
      color: "from-purple-400 to-purple-600"
    },
    { 
      id: "delivery", 
      title: "Хүргэлт",
      description: "Хүргэлтийн жолооч",
      icon: <Truck className="h-12 w-12 text-green-500" />,
      color: "from-green-400 to-green-600"
    }
  ];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white text-center py-8">
          <CardTitle className="text-3xl">Тавтай морил, {user?.name || user?.displayName}!</CardTitle>
          <CardDescription className="text-white opacity-90 text-lg">
            GobiGo-д ашиглах хэрэглэгчийн төрлөө сонгоно уу
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            {roleOptions.map((role) => (
              <motion.div 
                key={role.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
                onClick={() => handleRoleSelection(role.id as "customer" | "business" | "delivery")}
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${role.color} p-6 flex justify-center`}>
                    {role.icon}
                  </div>
                  <div className="p-5 flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{role.title}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Та хэдийд ч хэрэглэгчийн төрлөө профайл хэсэгт очиж өөрчлөх боломжтой.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
