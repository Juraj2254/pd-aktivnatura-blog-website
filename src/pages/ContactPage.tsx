import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { SEO } from "@/components/SEO";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Kontakt"
        description="Kontaktirajte Planinarsko Društvo AktivNatura. Javite nam se za više informacija o izletima, članstvu ili bilo kakva pitanja."
        canonical="/kontakt"
      />
      <Navbar />
      <main className="pt-16">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
