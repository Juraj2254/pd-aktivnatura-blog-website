import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelector } from "./CategorySelector";
import { Loader2 } from "lucide-react";

export function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
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
        description: "Molimo popunite sva polja",
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
        category_id: categoryId,
        author_id: user?.id,
        published: false,
      });

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Blog post je kreiran.",
      });

      setTitle("");
      setCategoryId("");
      setContent("");
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
        <h2 className="text-2xl font-bold">Kreiraj Blog Post</h2>
        <p className="text-sm text-muted-foreground">
          Unesite naslov, odaberite kategoriju i kreirajte sadržaj
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
            placeholder="Unesite naslov blog posta..."
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
