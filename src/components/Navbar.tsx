import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Naslovnica", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Izleti", path: "/izleti" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="z-50 bg-background/95 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition-colors">
            <img src={logo} alt="AktivNatura" className="h-8 w-8" />
            <span className="hidden sm:inline">AktivNatura</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="hero" size="sm" className="bg-[#F70000] hover:bg-[#F70000]/90 text-white">
              <Phone className="h-4 w-4" />
              Nazovi nas
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="hero" size="sm" className="w-full bg-[#F70000] hover:bg-[#F70000]/90 text-white">
                <Phone className="h-4 w-4" />
                Nazovi nas
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
