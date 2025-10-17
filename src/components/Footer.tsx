import { Mountain, Facebook, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8" />
            <span className="text-xl font-bold">AktivNatura</span>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a 
              href="#" 
              className="hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="#" 
              className="hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a 
              href="#" 
              className="hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/80">
            © 2025 Planinarsko Društvo AktivNatura. Sva prava pridržana.
          </p>
        </div>
      </div>
    </footer>
  );
};
