import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelector } from "./CategorySelector";
import { ImageGalleryUpload } from "./ImageGalleryUpload";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Trip {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string | null;
  content: string;
  location: string | null;
  duration: string | null;
  difficulty: string | null;
  price: number | null;
  max_participants: number | null;
  featured_image: string | null;
  published: boolean;
  category_id: string | null;
  date: string | null;
}

interface EditTripModalProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTripModal({
  trip,
  open,
  onOpenChange,
  onSuccess,
}: EditTripModalProps) {
  const [title, setTitle] = useState(trip.title);
  const [subtitle, setSubtitle] = useState(trip.subtitle || "");
  const [categoryId, setCategoryId] = useState(trip.category_id || "");
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState(trip.content);
  const [date, setDate] = useState<Date | undefined>(
    trip.date ? new Date(trip.date) : undefined
  );
  const [attendees, setAttendees] = useState(
    trip.max_participants ? trip.max_participants.toString() : ""
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(trip.title);
    setSubtitle(trip.subtitle || "");
    setCategoryId(trip.category_id || "");
    setContent(trip.content);
    setDate(trip.date ? new Date(trip.date) : undefined);
    setAttendees(trip.max_participants ? trip.max_participants.toString() : "");
    
    // Parse images from featured_image field (JSON array or single URL)
    try {
      if (trip.featured_image) {
        const parsed = JSON.parse(trip.featured_image);
        setImages(Array.isArray(parsed) ? parsed : [trip.featured_image]);
      } else {
        setImages([]);
      }
    } catch {
      setImages(trip.featured_image ? [trip.featured_image] : []);
    }
  }, [trip]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !categoryId || !content.trim()) {
      toast({
        title: "Greška",
        description: "Molimo popunite sva obavezna polja",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(title);
      
      const { error } = await supabase
        .from("trips")
        .update({
          title,
          subtitle: subtitle || null,
          slug,
          content,
          category_id: categoryId,
          featured_image: images.length > 0 ? images[0] : null,
          date: date ? date.toISOString() : null,
          max_participants: attendees ? parseInt(attendees) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", trip.id);

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Trip je ažuriran.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Uredi Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="edit-title" className="text-base">Naslov</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg h-12 mt-2"
            />
          </div>

          <div>
            <Label htmlFor="edit-subtitle" className="text-base">Podnaslov</Label>
            <Input
              id="edit-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-base h-11 mt-2"
            />
          </div>

          <CategorySelector
            value={categoryId}
            onChange={setCategoryId}
            type="trip"
            label="Kategorija"
          />

          <ImageGalleryUpload
            images={images}
            onChange={setImages}
            label="Galerija Slika"
          />

          <div>
            <Label className="text-base mb-2 block">Sadržaj</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Napišite opis tripa ovdje..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base">Datum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11 mt-2",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Odaberi datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="edit-attendees" className="text-base">Broj Sudionika</Label>
              <Input
                id="edit-attendees"
                type="number"
                min="0"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="h-11 mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              size="lg"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Spremanje...
                </>
              ) : (
                "Spremi Promjene"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="lg"
            >
              Odustani
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
