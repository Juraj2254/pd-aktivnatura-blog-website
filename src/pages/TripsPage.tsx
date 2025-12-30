import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import tripsHero from "@/assets/trips-hero.jpg";
import { FocusCards } from "@/components/ui/focus-cards";
import { SEO } from "@/components/SEO";

interface Trip {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  featured_image: string | null;
  date: string | null;
  max_participants: number | null;
  location: string | null;
  category_id: string | null;
  categories?: {
    name: string;
    slug: string;
  };
}

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq("published", true)
        .order("date", { ascending: true });

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <SEO
          title="Izleti"
          description="Pregledaj naše planirane izlete i avanture u prirodi. Pridruži se AktivNatura planinskom društvu na uzbudljivim planinarskim turama."
          canonical="/izleti"
        />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Izleti"
        description="Pregledaj naše planirane izlete i avanture u prirodi. Pridruži se AktivNatura planinskom društvu na uzbudljivim planinarskim turama."
        canonical="/izleti"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden"
        aria-label="Planinski pejzaž - pozadinska slika planinskih izleta"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tripsHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Planirani Izleti
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Istražite najljepše planine Hrvatske s AktivNatura društvom
          </p>
        </div>
      </section>

      {/* Trips Gallery */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {trips.length === 0 ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            {/* SEO-friendly message - this content is visible to crawlers */}
            <p className="text-lg text-muted-foreground">
              Trenutno nema dostupnih izleta. Pratite nas za nove avanture u prirodi!
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              U međuvremenu, pročitajte naš <a href="/blog" className="text-primary hover:underline">blog</a> za savjete i priče iz planinarenja.
            </p>
          </div>
        ) : (
          <FocusCards
            cards={trips.map((trip) => ({
              id: trip.id,
              title: trip.title,
              slug: trip.slug,
              src: trip.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070",
              category: trip.categories?.name,
              date: trip.date ? formatDate(trip.date) : undefined,
              attendees: trip.max_participants || undefined,
            }))}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TripsPage;
