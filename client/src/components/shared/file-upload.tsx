import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, Upload, X, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  previewUrl?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Зураг оруулах",
  previewUrl,
  disabled = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(previewUrl);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: 'Файл хэтэрхий том байна',
        description: `${maxSizeMB}MB-ээс бага хэмжээтэй файл оруулна уу`,
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent callback
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileRemove) {
      onFileRemove();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto max-h-60 object-contain"
              />
            </CardContent>
          </Card>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 rounded-full h-8 w-8"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
          `}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {accept.includes('image') ? (
              <ImageIcon className="h-10 w-10 text-gray-400" />
            ) : (
              <FileImage className="h-10 w-10 text-gray-400" />
            )}
            <div className="font-medium text-gray-700">{label}</div>
            <div className="text-sm text-gray-500">
              Чирч оруулах эсвэл дарж файл сонгоно уу
            </div>
            <div className="text-xs text-gray-400">
              Файлын дээд хэмжээ: {maxSizeMB}MB
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 flex items-center gap-1"
              disabled={disabled}
            >
              <Upload className="h-4 w-4" />
              <span>Файл сонгох</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}