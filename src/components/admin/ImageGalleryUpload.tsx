import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon, AlertCircle, Star } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface ImageGalleryUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
}

const DEFAULT_MAX_IMAGES = 50;

export function ImageGalleryUpload({
  images,
  onChange,
  label = "Galerija Slika",
  maxImages = DEFAULT_MAX_IMAGES,
}: ImageGalleryUploadProps) {
  const handleAddImages = (urls: string[]) => {
    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) return;
    const urlsToAdd = urls.slice(0, availableSlots);
    onChange([...images, ...urlsToAdd]);
  };

  const handleAddImage = (url: string) => {
    handleAddImages([url]);
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    onChange(newImages);
  };

  const remainingSlots = maxImages - images.length;
  const isAtLimit = remainingSlots <= 0;
  const isNearLimit = remainingSlots <= 5 && remainingSlots > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">{label}</Label>
        <div className={`text-sm ${isAtLimit ? "text-destructive" : isNearLimit ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}>
          {images.length}/{maxImages} slika
        </div>
      </div>

      {/* Image grid preview */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
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
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              
              {/* First image indicator (cover) */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Naslovna
                </span>
              )}
              
              {/* Set as cover button */}
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetAsCover(index)}
                  className="absolute bottom-1 left-1 p-1.5 bg-primary text-primary-foreground rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  title="Postavi kao naslovnu sliku"
                >
                  <Star className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nema slika. Uploadaj ili dodaj URL slike iznad.</p>
        </div>
      )}
      
      {/* Upload Component - disabled at limit */}
      {isAtLimit ? (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">Maksimalni broj slika ({maxImages}) je dosegnut. Uklonite neke slike za dodavanje novih.</p>
        </div>
      ) : (
        <ImageUpload
          onImagesUploaded={handleAddImages}
          onImageUploaded={handleAddImage}
          label=""
          acceptMultiple={true}
          maxFiles={remainingSlots}
        />
      )}
      
      {/* Capacity indicator */}
      {images.length > 0 && !isAtLimit && (
        <p className="text-xs text-muted-foreground">
          Preostalo mjesta: {remainingSlots} slika
        </p>
      )}
    </div>
  );
}
