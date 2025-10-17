import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import { EditTripModal } from "./EditTripModal";

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

export function EditTripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrips(data || []);
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

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovaj izlet?")) return;

    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: "Izlet je obrisan.",
      });
      fetchTrips();
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("trips")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Uspjeh!",
        description: `Izlet je ${!currentStatus ? "objavljen" : "sakriven"}.`,
      });
      fetchTrips();
    } catch (error: any) {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Uredi Izlete</h2>
      {trips.length === 0 ? (
        <p className="text-muted-foreground">Nema izleta.</p>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{trip.title}</span>
                  <span
                    className={`text-sm ${
                      trip.published ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {trip.published ? "Objavljeno" : "Draft"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Lokacija:</strong> {trip.location}
                </p>
                <p className="text-sm text-muted-foreground mb-4">{trip.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(trip)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Uredi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(trip.id, trip.published)}
                  >
                    {trip.published ? "Sakrij" : "Objavi"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(trip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedTrip && (
        <EditTripModal
          trip={selectedTrip}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={fetchTrips}
        />
      )}
    </div>
  );
}
