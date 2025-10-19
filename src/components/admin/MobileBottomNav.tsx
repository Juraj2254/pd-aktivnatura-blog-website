import { Home, FileText, Map, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileBottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const MobileBottomNav = ({ currentView, onViewChange }: MobileBottomNavProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      view: "home",
    },
    {
      id: "blog",
      icon: FileText,
      label: "Blog",
      hasSubmenu: true,
      submenuItems: [
        { label: "Kreiraj Blog", view: "create-blog" },
        { label: "Uredi Blogove", view: "edit-blogs" },
      ],
    },
    {
      id: "trips",
      icon: Map,
      label: "Izleti",
      hasSubmenu: true,
      submenuItems: [
        { label: "Kreiraj Izlet", view: "create-trip" },
        { label: "Uredi Izlete", view: "edit-trips" },
      ],
    },
    {
      id: "more",
      icon: LogOut,
      label: "Odjavi se",
      action: handleSignOut,
    },
  ];

  const isActive = (itemId: string, view?: string) => {
    if (view) return currentView === view;
    if (itemId === "blog") return currentView.includes("blog");
    if (itemId === "trips") return currentView.includes("trip");
    if (itemId === "home") return currentView === "home" || !currentView;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          if (item.hasSubmenu && item.submenuItems) {
            return (
              <Sheet key={item.id}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors min-w-[44px] min-h-[44px]",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto">
                  <SheetHeader>
                    <SheetTitle>{item.label}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-4">
                    {item.submenuItems.map((subItem) => (
                      <Button
                        key={subItem.view}
                        variant={currentView === subItem.view ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => onViewChange(subItem.view)}
                      >
                        {subItem.label}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.view) {
                  onViewChange(item.view);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 py-2 transition-colors min-w-[44px] min-h-[44px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
