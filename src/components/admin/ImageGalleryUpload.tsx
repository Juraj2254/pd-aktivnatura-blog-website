import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface ImageGalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export function ImageGalleryUpload({
  images,
  onChange,
  label = "Galerija Slika",
}: ImageGalleryUploadProps) {
  const handleAddImage = (url: string) => {
    onChange([...images, url]);
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <ImageUpload
        label={label}
        onImageUploaded={handleAddImage}
        acceptMultiple={true}
      />

      {/* Image grid preview */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={imageUrl}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+URL";
                }}
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Order indicator */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nema slika. Uploaduj ili dodaj URL slike iznad.</p>
        </div>
      )}
      
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Ukupno slika: {images.length}
        </p>
      )}
    </div>
  );
}
