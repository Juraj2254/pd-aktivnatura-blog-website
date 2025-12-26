import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Contact = () => {
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    iban: "HR1023600001102594146",
    ibanFormatted: "HR10 2360 0001 1025 9414 6",
    recipient: "Planinarsko društvo Aktivnatura",
    bank: "Zagrebačka banka",
  };

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.iban);
      setCopied(true);
      toast.success("IBAN kopiran u međuspremnik!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Greška pri kopiranju IBAN-a");
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="text-5xl md:text-6xl">🏔️</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Krenimo na avanturu!
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Imate pitanja o našim izletima? Želite se pridružiti? 
              <br />
              Javite nam se - uvijek smo tu za vas!
            </p>
          </div>


          {/* Contact Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <a 
              href="mailto:dolores.vesligaj@gmail.com"
              className="block text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">📧</div>
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="text-xs md:text-sm font-medium text-primary hover:underline break-all px-2">dolores.vesligaj@gmail.com</div>
            </a>
            <a 
              href="tel:+385997325535"
              className="block text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">📱</div>
              <div className="text-sm text-muted-foreground mb-1">Telefon</div>
              <div className="text-sm font-medium text-primary hover:underline">+385 99/732 5535</div>
            </a>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=TRG+FRANCUSKE+REPUBLIKE+11"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">📍</div>
              <div className="text-sm text-muted-foreground mb-1">Lokacija</div>
              <div className="text-sm font-medium text-primary hover:underline">TRG FRANCUSKE REPUBLIKE 11</div>
            </a>
          </div>

          {/* Bank Payment Section */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="text-center mb-6">
              <div className="inline-block mb-2">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-2xl font-semibold text-primary">Podaci za uplatu</h3>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm rounded-xl border border-border/50 p-6 space-y-4">
              {/* IBAN Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/30">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">IBAN</div>
                  <div className="font-mono text-sm sm:text-base font-medium text-foreground tracking-wide">
                    {bankDetails.ibanFormatted}
                  </div>
                </div>
                <button
                  onClick={copyIban}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-200 text-sm font-medium self-start sm:self-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Kopirano!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Kopiraj
                    </>
                  )}
                </button>
              </div>

              {/* Recipient Row */}
              <div className="pb-4 border-b border-border/30">
                <div className="text-sm text-muted-foreground mb-1">Primatelj</div>
                <div className="font-medium text-foreground">{bankDetails.recipient}</div>
              </div>

              {/* Bank Row */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Banka</div>
                <div className="font-medium text-foreground">{bankDetails.bank}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
