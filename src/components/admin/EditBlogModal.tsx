import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published: boolean;
  category_id: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

interface EditBlogModalProps {
  blog: BlogPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditBlogModal({
  blog,
  open,
  onOpenChange,
  onSuccess,
}: EditBlogModalProps) {
  const [title, setTitle] = useState(blog.title);
  const [categoryId, setCategoryId] = useState(blog.category_id || "");
  const [content, setContent] = useState(blog.content);
  const [featuredImage, setFeaturedImage] = useState(blog.featured_image || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    blog.start_date ? new Date(blog.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    blog.end_date ? new Date(blog.end_date) : undefined
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(blog.title);
    setCategoryId(blog.category_id || "");
    setContent(blog.content);
    setFeaturedImage(blog.featured_image || "");
    setStartDate(blog.start_date ? new Date(blog.start_date) : undefined);
    setEndDate(blog.end_date ? new Date(blog.end_date) : undefined);
  }, [blog]);

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
      const slug = generateSlug(title);
      
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug,
          content,
          featured_image: featuredImage || null,
          category_id: categoryId || null,
          start_date: startDate?.toISOString() || null,
          end_date: endDate?.toISOString() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blog.id);

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Blog post je ažuriran.",
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
          <DialogTitle className="text-2xl">Uredi Blog Post</DialogTitle>
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
                        type="button"
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
                        type="button"
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
