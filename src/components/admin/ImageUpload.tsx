import { useState, useRef, useId } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Loader2, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onImageUploaded?: (url: string) => void;
  label?: string;
  acceptMultiple?: boolean;
  bucket?: string;
  maxFileSize?: number; // in MB
  maxTotalSize?: number; // in MB
  maxFiles?: number;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_SIZE_MB = 50;
const MAX_FILES = 50;

export function ImageUpload({ 
  value,
  onChange,
  onImageUploaded, 
  label = "Slika",
  acceptMultiple = false,
  bucket = "trip-blog-images",
  maxFileSize = MAX_FILE_SIZE_MB,
  maxTotalSize = MAX_TOTAL_SIZE_MB,
  maxFiles = MAX_FILES,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const uploadInputId = useId();

  const handleImageUpdate = (url: string) => {
    if (onChange) onChange(url);
    if (onImageUploaded) onImageUploaded(url);
  };

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];
    let totalSize = 0;

    // Check max files limit
    if (files.length > maxFiles) {
      errors.push(`Maksimalno ${maxFiles} slika odjednom. Odabrano: ${files.length}`);
      return { valid: [], errors };
    }

    for (const file of files) {
      const fileSizeMB = file.size / (1024 * 1024);
      
      // Check individual file size
      if (fileSizeMB > maxFileSize) {
        errors.push(`"${file.name}" prelazi ${maxFileSize}MB (${fileSizeMB.toFixed(1)}MB)`);
        continue;
      }

      totalSize += fileSizeMB;
      valid.push(file);
    }

    // Check total size
    if (totalSize > maxTotalSize) {
      errors.push(`Ukupna veličina (${totalSize.toFixed(1)}MB) prelazi ${maxTotalSize}MB`);
      return { valid: [], errors };
    }

    return { valid, errors };
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const { valid, errors } = validateFiles(fileArray);

    // Show validation errors
    if (errors.length > 0) {
      toast({
        title: "Greška pri validaciji",
        description: (
          <div className="flex flex-col gap-1">
            {errors.map((error, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        ),
        variant: "destructive",
      });

      if (valid.length === 0) {
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: valid.length });

    try {
      let successCount = 0;

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        setUploadProgress({ current: i + 1, total: valid.length });
        
        const url = await uploadFile(file);
        if (url) {
          successCount++;
          handleImageUpdate(url);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Uspjeh!",
          description: successCount === 1 
            ? "Slika je uploadana." 
            : `${successCount} slika je uploadano.`,
        });
      }

      if (successCount < valid.length) {
        toast({
          title: "Upozorenje",
          description: `${valid.length - successCount} slika nije uspješno uploadano.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Neuspješan upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      handleImageUpdate(urlInput.trim());
      setUrlInput("");
      toast({
        title: "Uspjeh!",
        description: "URL slike je dodat.",
      });
    }
  };

  const handleRemoveImage = () => {
    handleImageUpdate("");
    toast({
      title: "Uspjeh!",
      description: "Slika je uklonjena.",
    });
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{label}</Label>}
      
      {/* Show current image if exists */}
      {value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-3 mt-3">
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={acceptMultiple}
              onChange={handleFileChange}
              className="hidden"
              id={uploadInputId}
              disabled={uploading}
            />
            <label 
              htmlFor={uploadInputId}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  {uploadProgress && (
                    <p className="text-sm text-muted-foreground">
                      Uploadanje {uploadProgress.current} od {uploadProgress.total}...
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {value ? "Promijeni sliku" : "Klikni za upload slike"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {acceptMultiple 
                      ? `max ${maxFileSize}MB po slici • max ${maxFiles} slika • ${maxTotalSize}MB ukupno`
                      : `PNG, JPG, WEBP, GIF (max ${maxFileSize}MB)`
                    }
                  </p>
                </>
              )}
            </label>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-3 mt-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              size="icon"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
