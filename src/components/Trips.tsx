import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Grid3x3, Images, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import TripsGallery from "./TripsGallery";

interface Trip {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  featured_image: string | null;
  date: string | null;
  location: string | null;
}

export const Trips = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('gallery');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("id, title, subtitle, slug, featured_image, date, location")
        .eq("published", true)
        .order("date", { ascending: true })
        .limit(3);

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      toast.error("Greška pri učitavanju izleta");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Datum će biti najavljen";
    const date = new Date(dateString);
    return date.toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Naši izleti
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pridruži nam se na jednom od naših nadolazećih izleta
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant={viewMode === 'grid' ? 'outline' : 'ghost'}
              size="default"
              onClick={() => setViewMode('grid')}
              className="min-h-[44px] touch-manipulation"
            >
              <Grid3x3 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Grid Prikaz</span>
            </Button>
            <Button
              variant={viewMode === 'gallery' ? 'outline' : 'ghost'}
              size="default"
              onClick={() => setViewMode('gallery')}
              className="min-h-[44px] touch-manipulation"
            >
              <Images className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Galerija</span>
            </Button>
          </div>
        </div>

        {viewMode === 'gallery' ? (
          <TripsGallery />
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              Trenutno nema objavljenih izleta. Provjerite uskoro!
            </p>
            <Link to="/izleti">
              <Button variant="outline">
                Pogledaj sve izlete
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg active:shadow-xl active:scale-[0.98] transition-all touch-manipulation">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={trip.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"} 
                    alt={trip.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-105 active:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{trip.title}</CardTitle>
                  {trip.subtitle && <CardDescription>{trip.subtitle}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(trip.date)}</span>
                  </div>
                  {trip.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.location}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link to={`/izleti/${trip.slug}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Saznaj više
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
