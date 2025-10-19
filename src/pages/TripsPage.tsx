import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import tripsHero from "@/assets/trips-hero.jpg";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tripsHero})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/90" />
        </div>
      </section>

      {/* Trips Gallery */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {trips.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Trenutno nema dostupnih izleta. Provjerite uskoro!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {trips.map((trip, index) => (
              <Link
                key={trip.id}
                to={`/izleti/${trip.slug}`}
                className="group block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <article 
                  className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in bg-card"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    <img
                      src={trip.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"}
                      alt={trip.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredIndex === index ? "scale-110" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                    
                    {/* Category Badge */}
                    {trip.categories && (
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {trip.categories.name}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {trip.title}
                    </h2>
                    
                    {trip.subtitle && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {trip.subtitle}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {trip.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(trip.date)}</span>
                        </div>
                      )}
                      
                      {trip.max_participants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{trip.max_participants} sudionika</span>
                        </div>
                      )}
                      
                      {trip.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{trip.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TripsPage;
