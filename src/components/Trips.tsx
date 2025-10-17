import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Grid3x3, Images } from "lucide-react";
import trip1 from "@/assets/trip-1.jpg";
import trip2 from "@/assets/trip-2.jpg";
import trip3 from "@/assets/trip-3.jpg";
import TripsGallery from "./TripsGallery";

const trips = [
  {
    id: 1,
    title: "Uspon na Velebit",
    description: "Jednodnevni izlet na najdulji planinski lanac u Hrvatskoj",
    image: trip1,
    date: "15. Lipanj 2025",
    location: "Sjeverni Velebit",
  },
  {
    id: 2,
    title: "Osvajanje Dinare",
    description: "Vrhunac Hrvatske - nezaboravan pogled na more i planine",
    image: trip2,
    date: "22. Lipanj 2025",
    location: "Dinara",
  },
  {
    id: 3,
    title: "Šetnja šumskim stazama",
    description: "Opuštajuća šetnja kroz zelene šume Gorskog kotara",
    image: trip3,
    date: "29. Lipanj 2025",
    location: "Gorski Kotar",
  },
];

export const Trips = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid');

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg active:shadow-xl active:scale-[0.98] transition-all touch-manipulation">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-105 active:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{trip.title}</CardTitle>
                  <CardDescription>{trip.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.location}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Saznaj više
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
