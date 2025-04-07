import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { addProduct } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

export function ProductForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("pizza");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.uid) {
      toast({
        title: "Нэвтрэх алдаа",
        description: "Бүтээгдэхүүн нэмэхийн тулд та нэвтэрсэн байх ёстой",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const productData = {
        name,
        price: parseFloat(price),
        category,
        status,
        description,
        createdAt: new Date(),
      };
      
      await addProduct(user.uid, productData);
      
      toast({
        title: "Бүтээгдэхүүн нэмэгдлээ",
        description: `${name} таны бүтээгдэхүүний жагсаалтад нэмэгдлээ`,
      });
      
      // Reset form
      setName("");
      setPrice("");
      setCategory("pizza");
      setStatus("active");
      setDescription("");
    } catch (error) {
      toast({
        title: "Бүтээгдэхүүн нэмэхэд алдаа гарлаа",
        description: "Дахин оролдоно уу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Шинэ бүтээгдэхүүн нэмэх</h2>
      </div>
      
      <div className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="product-name">Бүтээгдэхүүний нэр</Label>
              <Input
                id="product-name"
                name="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="price">Үнэ</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₮</span>
                </div>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Ангилал</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Ангилал сонгох" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pizza">Пицца</SelectItem>
                  <SelectItem value="sides">Дагалдах хоол</SelectItem>
                  <SelectItem value="beverages">Ундаа</SelectItem>
                  <SelectItem value="desserts">Амттан</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Төлөв</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Төлөв сонгох" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Идэвхтэй</SelectItem>
                  <SelectItem value="out_of_stock">Дууссан</SelectItem>
                  <SelectItem value="hidden">Нуугдсан</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Тайлбар</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700">Зураг</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Файл оруулах</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled={isLoading} />
                  </label>
                  <p className="pl-1">эсвэл чирж оруулах</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF 5MB хүртэл
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-3"
              disabled={isLoading}
            >
              Цуцлах
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              Бүтээгдэхүүн нэмэх
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
