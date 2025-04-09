import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ImagePlus, X, Camera, FileUp, FileImage } from "lucide-react";
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  label?: string;
  previewUrl?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
  disabled?: boolean;
}
export function FileUpload({
  onFileSelect,
  onFileRemove,
  label = "Файл оруулах",
  previewUrl,
  maxSizeMB = 5,
  acceptedTypes = "image/*",
  disabled = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(previewUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSize = maxSizeMB * 1024 * 1024; 
  useEffect(() => {
    setPreview(previewUrl);
  }, [previewUrl]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };
  const handleFile = (file?: File) => {
    if (!file) {
      setError("Файл сонгогдоогүй байна");
      return;
    }
    if (file.size > maxSize) {
      setError(`Файлын хэмжээ хэтэрсэн байна. Дээд хэмжээ: ${maxSizeMB}MB`);
      return;
    }
    if (acceptedTypes !== "*" && !file.type.match(acceptedTypes.replace(/\*/g, ".*"))) {
      setError(`Зөвшөөрөгдөөгүй файлын төрөл. Зөвшөөрөгдсөн төрлүүд: ${acceptedTypes}`);
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
    setError(null);
    onFileSelect(file);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleBrowseClick = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };
  const handleClear = () => {
    setPreview(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileRemove) {
      onFileRemove();
    }
  };
  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-64 rounded-md object-contain"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <FileImage className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <div className="text-sm font-medium mb-1">
              {acceptedTypes.includes("image")
                ? "Зураг оруулахын тулд энд дарна уу"
                : "Файл оруулахын тулд энд дарна уу"}
            </div>
            <p className="text-xs text-gray-500">
              Файлаа энд чирч оруулж эсвэл <span className="text-primary">сонгоно</span> уу
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Дээд хэмжээ: {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center text-sm text-red-500 mt-1">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBrowseClick}
          disabled={disabled}
          className="flex-1"
        >
          <FileUp className="h-4 w-4 mr-2" />
          Файл сонгох
        </Button>
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4 mr-2" />
            Устгах
          </Button>
        )}
      </div>
    </div>
  );
}