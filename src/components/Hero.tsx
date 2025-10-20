import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-mountains.jpg";

export const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
          Otkrij prirodu s nama
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Pridruži se AktivNatura klubu i istraži najljepše planine Hrvatske
        </p>
        <Button 
          variant="hero" 
          size="lg" 
          className="text-lg bg-[#F70000] hover:bg-[#F70000]/90 text-white"
          asChild
        >
          <a 
            href="https://docs.google.com/spreadsheets/d/17WSd1XLRbwNPKmA0rDV-GUVA2rPH8gydr6EJsg_7Rwo/edit?gid=1652722319#gid=1652722319"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pogledaj kalendar izleta
          </a>
        </Button>
      </div>
    </section>
  );
};
