import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, MapPin, Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { SEO } from "@/components/SEO";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface Trip {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  // Strip HTML tags for meta description
  const getPlainText = (html: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").substring(0, 155);
  };

  // Get all gallery images (fallback to featured_image for old data)
  const getGalleryImages = (): string[] => {
    if (trip?.gallery_images && trip.gallery_images.length > 0) {
      return trip.gallery_images;
    }
    if (trip?.featured_image) {
      return [trip.featured_image];
    }
    return [];
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SEO title="Učitavanje izleta..." noindex />
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
        <SEO title="Izlet nije pronađen" noindex />
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

  const galleryImages = getGalleryImages();

  return (
    <div className="min-h-screen">
      <SEO
        title={trip.title}
        description={trip.subtitle || getPlainText(trip.content) || `Pridruži se izletu ${trip.title} s AktivNatura planinskim društvom.`}
        canonical={`/izleti/${slug}`}
        ogImage={trip.featured_image || undefined}
        ogType="article"
      />
      <Navbar />

      {/* Hero Image (featured image / cover) */}
      <div className="relative w-full overflow-hidden h-[clamp(320px,60vh,720px)]">
        <img
          src={trip.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070"}
          alt={trip.title}
          className="absolute inset-0 w-full h-full !object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link to="/izleti">
            <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-white/90 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
          </Link>
        </div>

        {/* Title overlay on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="container mx-auto">
            {trip.categories && (
              <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-medium mb-3 backdrop-blur-sm">
                {trip.categories.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight max-w-4xl">
              {trip.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6 md:p-10 lg:p-12 -mt-8 md:-mt-16 relative z-10">
          {/* Subtitle */}
          {trip.subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              {trip.subtitle}
            </p>
          )}

          {/* Meta Info Grid - only show if at least one field has a value */}
          {(trip.date || trip.max_participants || trip.location || trip.duration) && (
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
          )}

          {/* Content */}
          {trip.content && (
            <div 
              className="prose prose-base md:prose-lg max-w-none dark:prose-invert prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto mb-12"
              dangerouslySetInnerHTML={{ __html: trip.content }}
            />
          )}

          {/* Image Gallery */}
          {galleryImages.length > 1 && (
            <div className="mt-12 pt-10 border-t border-border">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold">Galerija Fotografija</h2>
                <span className="text-sm text-muted-foreground">({galleryImages.length} slika)</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <img
                      src={image}
                      alt={`${trip.title} - slika ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                ))}
              </div>
            </div>
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

      {/* Lightbox */}
      <ImageLightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

      <div className="py-16" />
      
      <Footer />
    </div>
  );
};

export default TripDetail;
