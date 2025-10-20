import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Trips } from "@/components/Trips";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { NextTripPopup } from "@/components/NextTripPopup";

const Index = () => {
  return (
    <div className="min-h-screen">
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
