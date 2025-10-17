import { useState } from "react";
import { Menu, X, Mountain } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/80 transition-colors">
            <Mountain className="h-6 w-6" />
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
            <Button variant="hero" size="sm">
              Pridruži se
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
              <Button variant="hero" size="sm" className="w-full">
                Pridruži se
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
