import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  location: string | null;
  duration: string | null;
  difficulty: string | null;
  price: number | null;
  max_participants: number | null;
  featured_image: string | null;
  published: boolean;
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
  const [slug, setSlug] = useState(trip.slug);
  const [description, setDescription] = useState(trip.description || "");
  const [content, setContent] = useState(trip.content || "");
  const [location, setLocation] = useState(trip.location || "");
  const [duration, setDuration] = useState(trip.duration || "");
  const [difficulty, setDifficulty] = useState(trip.difficulty || "");
  const [price, setPrice] = useState(trip.price?.toString() || "");
  const [maxParticipants, setMaxParticipants] = useState(
    trip.max_participants?.toString() || ""
  );
  const [featuredImage, setFeaturedImage] = useState(trip.featured_image || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(trip.title);
    setSlug(trip.slug);
    setDescription(trip.description || "");
    setContent(trip.content || "");
    setLocation(trip.location || "");
    setDuration(trip.duration || "");
    setDifficulty(trip.difficulty || "");
    setPrice(trip.price?.toString() || "");
    setMaxParticipants(trip.max_participants?.toString() || "");
    setFeaturedImage(trip.featured_image || "");
  }, [trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("trips")
        .update({
          title,
          slug,
          description,
          content,
          location,
          duration,
          difficulty,
          price: price ? parseFloat(price) : null,
          max_participants: maxParticipants ? parseInt(maxParticipants) : null,
          featured_image: featuredImage || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", trip.id);

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Izlet je ažuriran.",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uredi Izlet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="edit-title">Naslov</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-slug">Slug (URL)</Label>
            <Input
              id="edit-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Opis</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="edit-content">Sadržaj</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Napiši detaljne informacije o izletu ovdje..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-location">Lokacija</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-duration">Trajanje</Label>
              <Input
                id="edit-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-difficulty">Težina</Label>
              <Input
                id="edit-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-price">Cijena (€)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-maxParticipants">
              Maksimalan broj sudionika
            </Label>
            <Input
              id="edit-maxParticipants"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="edit-featuredImage">Featured Image URL</Label>
            <Input
              id="edit-featuredImage"
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Spremanje..." : "Spremi Promjene"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Odustani
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
