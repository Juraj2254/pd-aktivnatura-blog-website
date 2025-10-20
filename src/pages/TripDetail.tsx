import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

interface Trip {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  featured_image: string | null;
  date: string | null;
  max_participants: number | null;
  location: string | null;
  difficulty: string | null;
  duration: string | null;
  categories?: {
    name: string;
    slug: string;
  };
}

const TripDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchTrip();
    }
  }, [slug]);

  const fetchTrip = async () => {
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
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Izlet nije pronađen");
      }
      
      setTrip(data);
    } catch (error: any) {
      console.error("Error fetching trip:", error);
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

  if (!trip) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Izlet nije pronađen</h1>
          <Link to="/izleti">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad na izlete
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={trip.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link to="/izleti">
            <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-white/90 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6 md:p-10 lg:p-12">
          {/* Category Badge */}
          {trip.categories && (
            <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              {trip.categories.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
            {trip.title}
          </h1>

          {/* Subtitle */}
          {trip.subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              {trip.subtitle}
            </p>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-6 md:p-8 bg-muted/30 rounded-lg border border-border">
            {trip.date && (
              <div className="flex flex-col">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Datum</span>
                <span className="text-sm font-medium">{formatDate(trip.date)}</span>
              </div>
            )}
            
            {trip.max_participants && (
              <div className="flex flex-col">
                <Users className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Sudionici</span>
                <span className="text-sm font-medium">{trip.max_participants}</span>
              </div>
            )}
            
            {trip.location && (
              <div className="flex flex-col">
                <MapPin className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Lokacija</span>
                <span className="text-sm font-medium">{trip.location}</span>
              </div>
            )}
            
            {trip.duration && (
              <div className="flex flex-col">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground">Trajanje</span>
                <span className="text-sm font-medium">{trip.duration}</span>
              </div>
            )}
          </div>

          {/* Content */}
          {trip.content && (
            <div 
              className="prose prose-base md:prose-lg max-w-none dark:prose-invert mb-12"
              dangerouslySetInnerHTML={{ __html: trip.content }}
            />
          )}

          {/* CTA */}
          <div className="mt-16 pt-10 border-t border-border">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Zainteresirani?</h3>
              <TypewriterEffectSmooth
                words={[
                  { text: "Kontaktirajte" },
                  { text: "nas" },
                  { text: "za" },
                  { text: "više" },
                  { text: "informacija" },
                  { text: "i" },
                  { text: "prijavu" },
                ]}
                className="mb-6 justify-center"
              />
              <Link to="/kontakt">
                <Button size="lg" variant="default">
                  Kontaktiraj nas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <div className="py-16" />
      
      <Footer />
    </div>
  );
};

export default TripDetail;
