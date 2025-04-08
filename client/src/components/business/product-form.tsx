import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/file-upload";
import { X } from "lucide-react";
import { uploadFile } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
interface ProductFormProps {
  product?: any;
  onSave: (productData: any) => void;
  onCancel: () => void;
}
export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [category, setCategory] = useState(product?.category || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Алдаа",
        description: "Бүтээгдэхүүний нэр оруулна уу",
        variant: "destructive",
      });
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Алдаа",
        description: "Зөв үнэ оруулна уу",
        variant: "destructive",
      });
      return;
    }
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
    };
    onSave(productData);
  };
  const handleFileSelect = async (file: File) => {
    if (!user || !user.uid) {
      toast({
        title: "Алдаа",
        description: "Хэрэглэгч олдсонгүй, дахин нэвтэрнэ үү",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadFile(user.uid, file, "products");
      setImageUrl(url);
      toast({
        title: "Амжилттай",
        description: "Зураг амжилттай оруулагдлаа",
      });
    } catch (error) {
      console.error("Error uploading product image:", error);
      toast({
        title: "Алдаа",
        description: "Зураг оруулахад алдаа гарлаа",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileRemove = () => {
    setImageUrl("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="product-image">Бүтээгдэхүүний зураг</Label>
          <div className="mt-1">
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              previewUrl={imageUrl}
              label="Бүтээгдэхүүний зураг оруулах"
              disabled={isUploading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="name">Нэр</Label>
          <div className="mt-1">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Бүтээгдэхүүний нэр"
              disabled={isUploading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Тайлбар</Label>
          <div className="mt-1">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Бүтээгдэхүүний тайлбар"
              disabled={isUploading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="price">Үнэ (₮)</Label>
          <div className="mt-1">
            <Input
              id="price"
              type="number"
              min="0"
              step="100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Бүтээгдэхүүний үнэ"
              disabled={isUploading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Ангилал</Label>
          <div className="mt-1">
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ангилал (жишээ: үндсэн хоол, салат, амттан)"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isUploading}
        >
          Цуцлах
        </Button>
        <Button 
          type="submit"
          disabled={isUploading}
        >
          {product ? "Хадгалах" : "Нэмэх"}
        </Button>
      </div>
    </form>
  );
}
