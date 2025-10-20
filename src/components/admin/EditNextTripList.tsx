import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { EditNextTripModal } from "./EditNextTripModal";
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

interface FeaturedTrip {
  id: string;
  title: string;
  date: string;
  cover_image: string | null;
  is_active: boolean;
  created_at: string;
}

export const EditNextTripList = () => {
  const [featuredTrip, setFeaturedTrip] = useState<FeaturedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchFeaturedTrip = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('featured_trip')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching featured trip:", error);
    } else {
      setFeaturedTrip(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeaturedTrip();
  }, []);

  const handleDeactivate = async () => {
    if (!featuredTrip) return;

    const { error } = await supabase
      .from('featured_trip')
      .update({ is_active: false })
      .eq('id', featuredTrip.id);

    if (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom deaktiviranja izleta.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspješno!",
        description: "Istaknuti izlet je deaktiviran.",
      });
      fetchFeaturedTrip();
    }
  };

  const handleDelete = async () => {
    if (!featuredTrip) return;

    const { error } = await supabase
      .from('featured_trip')
      .delete()
      .eq('id', featuredTrip.id);

    if (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom brisanja izleta.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspješno!",
        description: "Istaknuti izlet je obrisan.",
      });
      setDeleteDialogOpen(false);
      fetchFeaturedTrip();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Učitavanje...</div>;
  }

  if (!featuredTrip) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Uredi Istaknuti Izlet
        </h2>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Trenutno nema aktivnog istaknuti izleta.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Kreirajte novi istaknuti izlet da biste ga prikazali posjetiteljima.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Uredi Istaknuti Izlet
        </h2>
        <p className="text-muted-foreground">
          Upravljajte trenutno aktivnim istaknuti izletom.
        </p>
      </div>

      <Card className="overflow-hidden">
        {featuredTrip.cover_image && (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={featuredTrip.cover_image}
              alt={featuredTrip.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {featuredTrip.title}
            </h3>
            <p className="text-muted-foreground mt-1">
              📅 {format(new Date(featuredTrip.date), "dd. MMMM yyyy.", { locale: hr })}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Uredi
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDeactivate}
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Deaktiviraj
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </Button>
          </div>
        </div>
      </Card>

      <EditNextTripModal
        trip={featuredTrip}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchFeaturedTrip}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija ne može se poništiti. Istaknuti izlet će biti trajno obrisan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
