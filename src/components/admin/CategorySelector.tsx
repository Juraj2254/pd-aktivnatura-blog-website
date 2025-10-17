import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  type: "blog" | "trip";
  label?: string;
}

export function CategorySelector({
  value,
  onChange,
  type,
  label = "Kategorija",
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("type", type)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Greška",
        description: "Unesite naziv kategorije",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategoryName,
          slug,
          description: newCategoryDescription || null,
          type,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Kategorija je kreirana.",
      });

      setCategories([...categories, data]);
      onChange(data.id);
      setShowCreateForm(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="category">{label}</Label>
      
      {!showCreateForm ? (
        <div className="space-y-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Odaberi kategoriju" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Kreiraj Novu Kategoriju
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <div>
            <Label htmlFor="new-category-name">Naziv</Label>
            <Input
              id="new-category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Naziv kategorije"
              disabled={creating}
            />
          </div>
          
          <div>
            <Label htmlFor="new-category-description">Opis (opcionalno)</Label>
            <Textarea
              id="new-category-description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Opis kategorije"
              rows={2}
              disabled={creating}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={creating}
              className="flex-1"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kreiranje...
                </>
              ) : (
                "Spremi"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateForm(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
              }}
              disabled={creating}
            >
              Odustani
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
