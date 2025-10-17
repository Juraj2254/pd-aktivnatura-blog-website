import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelector } from "./CategorySelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  published: boolean;
  category_id: string | null;
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(blog.title);
    setCategoryId(blog.category_id || "");
    setContent(blog.content);
  }, [blog]);

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
        description: "Molimo popunite sva polja",
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
          category_id: categoryId,
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
            label="Kategorija"
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
