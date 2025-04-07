import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProductFormProps {
  product?: any;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("main-dish");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price?.toString() || "");
      setCategory(product.category || "main-dish");
      setImageUrl(product.imageUrl || "");
      setAvailable(product.available !== false); // default to true if not specified
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !price.trim()) {
      alert("Нэр болон үнэ оруулна уу!");
      return;
    }
    
    const priceValue = parseInt(price.replace(/[^0-9]/g, ""), 10);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Зөв үнэ оруулна уу!");
      return;
    }
    
    // Prepare product data
    const productData = {
      name,
      description,
      price: priceValue,
      category,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      available,
      businessUid: user?.uid
    };
    
    onSave(productData);
  };

  const categories = [
    { value: "main-dish", label: "Үндсэн хоол" },
    { value: "appetizer", label: "Салад, зууш" },
    { value: "dessert", label: "Амттан" },
    { value: "drink", label: "Уух зүйл" },
    { value: "combo", label: "Комбо" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {product ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн нэмэх"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Бүтээгдэхүүний нэр</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Бүтээгдэхүүний нэрийг оруулна уу"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Бүтээгдэхүүний тайлбарыг оруулна уу"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="price">Үнэ (₮)</Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => {
                  // Allow only numbers and format with thousand separators
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value) {
                    setPrice(parseInt(value, 10).toLocaleString());
                  } else {
                    setPrice("");
                  }
                }}
                placeholder="Үнэ"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Ангилал</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Ангилал сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="imageUrl">Зургийн холбоос</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/food-image.jpg"
              />
              
              {imageUrl && (
                <div className="mt-2 relative">
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      // Handle image load error
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="available"
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="rounded-sm"
              />
              <Label htmlFor="available">Боломжтой</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Цуцлах
              </Button>
              <Button type="submit">
                {product ? "Шинэчлэх" : "Нэмэх"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}