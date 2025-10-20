import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="AktivNatura Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">AktivNatura</span>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <a 
              href="https://www.facebook.com/AktivNatura" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="https://www.instagram.com/aktivnaturaplaninar/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
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
