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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Trash2, X } from "lucide-react";

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
  optional?: boolean;
}

export function CategorySelector({
  value,
  onChange,
  type,
  label = "Kategorija",
  optional = true,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
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

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete.id);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete.id);

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Kategorija je obrisana.",
      });

      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      if (value === categoryToDelete.id) {
        onChange("");
      }
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setCategoryToDelete(null);
    }
  };

  const handleClearSelection = () => {
    onChange("");
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
      <Label htmlFor="category">{label} {optional && <span className="text-muted-foreground text-sm">(opcionalno)</span>}</Label>
      
      {!showCreateForm ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Odaberi kategoriju" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between pr-2">
                    <SelectItem value={category.id} className="flex-1">
                      {category.name}
                    </SelectItem>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCategoryToDelete(category);
                      }}
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </SelectContent>
            </Select>
            
            {value && optional && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClearSelection}
                title="Ukloni odabir"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
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

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obriši kategoriju</AlertDialogTitle>
            <AlertDialogDescription>
              Jeste li sigurni da želite obrisati kategoriju "{categoryToDelete?.name}"? 
              Ova radnja se ne može poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
