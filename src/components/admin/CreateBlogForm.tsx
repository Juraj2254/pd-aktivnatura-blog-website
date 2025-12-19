import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelector } from "./CategorySelector";
import { ImageUpload } from "./ImageUpload";
import { Loader2, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
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
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Greška",
        description: "Molimo popunite naslov i sadržaj",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const slug = generateSlug(title);
      
      const { error } = await supabase.from("blog_posts").insert({
        title,
        slug,
        content,
        featured_image: featuredImage || null,
        category_id: categoryId || null,
        author_id: user?.id,
        published: false,
        start_date: startDate?.toISOString() || null,
        end_date: endDate?.toISOString() || null,
      });

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Blog post je kreiran.",
      });

      setTitle("");
      setCategoryId("");
      setContent("");
      setFeaturedImage("");
      setStartDate(undefined);
      setEndDate(undefined);
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
    <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto space-y-6 p-4 sm:p-6 bg-background rounded-lg">

      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base">Naslov</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-lg h-12 mt-2"
            placeholder="Unesite naslov blog posta..."
          />
        </div>

        <CategorySelector
          value={categoryId}
          onChange={setCategoryId}
          type="blog"
          label="Kategorija (opcionalno)"
          optional={true}
        />

        {/* Date Range Section */}
        <div className="space-y-3">
          <Label className="text-base">Raspon datuma (opcionalno)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Početak</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: hr }) : "Odaberi datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {startDate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setStartDate(undefined)}
                    title="Ukloni datum"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Kraj</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: hr }) : "Odaberi datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {endDate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEndDate(undefined)}
                    title="Ukloni datum"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <ImageUpload
          value={featuredImage}
          onChange={setFeaturedImage}
          bucket="trip-blog-images"
          label="Naslovna slika"
        />

        <div>
          <Label className="text-base mb-2 block">Sadržaj</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Napišite sadržaj blog posta ovdje..."
          />
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
          "Kreiraj Blog Post"
        )}
      </Button>
    </form>
  );
}
