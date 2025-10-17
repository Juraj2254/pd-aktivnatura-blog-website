import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  label?: string;
  acceptMultiple?: boolean;
}

export function ImageUpload({ 
  onImageUploaded, 
  label = "Slika",
  acceptMultiple = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trip-blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trip-blog-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      
      toast({
        title: "Uspjeh!",
        description: "Slika je uploadovana.",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (acceptMultiple) {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
      }
    } else {
      await uploadFile(files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageUploaded(urlInput.trim());
      setUrlInput("");
      toast({
        title: "Uspjeh!",
        description: "URL slike je dodat.",
      });
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-base">{label}</Label>}
      
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
              id={`file-upload-${Math.random()}`}
              disabled={uploading}
            />
            <label 
              htmlFor={`file-upload-${Math.random()}`}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Klikni za upload slike</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP, GIF (max 5MB)
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
