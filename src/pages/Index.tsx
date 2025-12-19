import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Trips } from "@/components/Trips";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { NextTripPopup } from "@/components/NextTripPopup";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AktivNatura - Planinarsko Društvo"
        description="Pridruži se AktivNatura planinskom društvu i istraži najljepše planine Hrvatske. Organiziramo redovite izlete za sve uzraste i razine kondicije."
        canonical="/"
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Trips />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <NextTripPopup />
    </div>
  );
};

export default Index;
