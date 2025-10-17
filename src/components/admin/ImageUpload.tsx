import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({
  onImageUploaded,
  label = "Upload Image",
  accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("trip-blog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("trip-blog-images").getPublicUrl(filePath);

      onImageUploaded(publicUrl);

      toast({
        title: "Uspjeh!",
        description: "Slika je uspješno uploadovana.",
      });
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message || "Greška prilikom uploada slike.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Greška",
        description: "Slika je prevelika. Maksimalna veličina je 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = accept.split(",");
    const fileType = file.type;
    if (!allowedTypes.some((type) => fileType.match(type.replace("*", ".*")))) {
      toast({
        title: "Greška",
        description: "Nepodržan format slike.",
        variant: "destructive",
      });
      return;
    }

    uploadImage(file);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />
        {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
      </div>
    </div>
  );
}
