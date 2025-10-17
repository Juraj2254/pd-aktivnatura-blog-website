import { useState } from "react";
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

export function CreateTripForm() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date>();
  const [attendees, setAttendees] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        description: "Molimo popunite sva obavezna polja (naslov, kategorija, sadržaj)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const slug = generateSlug(title);
      
      const { error } = await supabase.from("trips").insert({
        title,
        subtitle: subtitle || null,
        slug,
        content,
        category_id: categoryId,
        featured_image: images.length > 0 ? JSON.stringify(images) : null,
        date: date ? date.toISOString() : null,
        max_participants: attendees ? parseInt(attendees) : null,
        created_by: user?.id,
        published: false,
      });

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Trip je kreiran.",
      });

      setTitle("");
      setSubtitle("");
      setCategoryId("");
      setImages([]);
      setContent("");
      setDate(undefined);
      setAttendees("");
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
    <form onSubmit={handleSubmit} className="max-w-[900px] mx-auto space-y-6 p-6 bg-background rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Kreiraj Trip</h2>
        <p className="text-sm text-muted-foreground">
          Unesite detalje putovanja i kreirajte sadržaj
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base">Naslov</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-lg h-12 mt-2"
            placeholder="Unesite naslov tripa..."
          />
        </div>

        <div>
          <Label htmlFor="subtitle" className="text-base">Podnaslov</Label>
          <Input
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="text-base h-11 mt-2"
            placeholder="Unesite podnaslov (opcionalno)..."
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
            <Label htmlFor="attendees" className="text-base">Broj Sudionika</Label>
            <Input
              id="attendees"
              type="number"
              min="0"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="h-11 mt-2"
              placeholder="Unesite broj sudionika..."
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        size="lg"
        className="w-full h-12"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Kreiranje...
          </>
        ) : (
          "Kreiraj Trip"
        )}
      </Button>
    </form>
  );
}
