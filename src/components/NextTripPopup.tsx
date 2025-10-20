import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Phone } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

interface FeaturedTrip {
  id: string;
  title: string;
  date: string;
  cover_image: string | null;
  is_active: boolean;
}

export const NextTripPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [featuredTrip, setFeaturedTrip] = useState<FeaturedTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndShowPopup = async () => {
      // Check localStorage to see if user already closed popup
      const storedData = localStorage.getItem('nextTripPopupClosed');
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          // If closed within last 7 days for same trip, don't show
          const closedDate = new Date(parsed.timestamp);
          const daysSinceClosed = (Date.now() - closedDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceClosed < 7 && parsed.tripId) {
            setLoading(false);
            return;
          }
        } catch (e) {
          // Invalid data, clear it
          localStorage.removeItem('nextTripPopupClosed');
        }
      }

      // Fetch active featured trip
      const { data, error } = await supabase
        .from('featured_trip')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setFeaturedTrip(data);
        
        // Show popup after 10 seconds
        setTimeout(() => {
          setIsOpen(true);
        }, 10000);
      }
      
      setLoading(false);
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    if (featuredTrip) {
      // Store in localStorage that user closed this popup
      localStorage.setItem('nextTripPopupClosed', JSON.stringify({
        closed: true,
        tripId: featuredTrip.id,
        timestamp: new Date().toISOString()
      }));
    }
    setIsOpen(false);
  };

  if (loading || !featuredTrip) {
    return null;
  }

  const formattedDate = format(new Date(featuredTrip.date), "dd. MMMM yyyy.", { locale: hr });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogClose 
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

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
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {featuredTrip.title}
            </h2>
            <p className="text-muted-foreground">
              📅 {formattedDate}
            </p>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => window.location.href = 'tel:+385997325535'}
          >
            <Phone className="mr-2 h-5 w-5" />
            Kontaktiraj nas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
