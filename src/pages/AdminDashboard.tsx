import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileBottomNav } from "@/components/admin/MobileBottomNav";
import { CreateBlogForm } from "@/components/admin/CreateBlogForm";
import { CreateTripForm } from "@/components/admin/CreateTripForm";
import { EditBlogsList } from "@/components/admin/EditBlogsList";
import { EditTripsList } from "@/components/admin/EditTripsList";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("create-blog");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/admin-auth");
        } else {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/admin-auth");
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!data) {
      navigate("/admin-auth");
    } else {
      setIsAdmin(true);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (currentView) {
      case "create-blog":
        return (
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Kreiraj Blog Post</h1>
            <CreateBlogForm />
          </div>
        );
      case "edit-blogs":
        return <EditBlogsList />;
      case "create-trip":
        return (
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Kreiraj Izlet</h1>
            <CreateTripForm />
          </div>
        );
      case "edit-trips":
        return <EditTripsList />;
      default:
        return (
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Dobrodošli u Admin Panel</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Odaberite opciju iz sidebar-a za upravljanje sadržajem.
            </p>
          </div>
        );
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full pb-16">
        <header className="h-12 flex items-center border-b border-border px-3 bg-background sticky top-0 z-40">
          <h2 className="text-base font-semibold truncate">Admin Dashboard</h2>
        </header>
        
        <main className="flex-1 p-3 bg-background overflow-auto">
          {renderContent()}
        </main>

        <MobileBottomNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    );
  }

  // Desktop layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 sm:h-14 flex items-center border-b border-border px-3 sm:px-6 bg-background">
            <SidebarTrigger />
            <h2 className="ml-2 sm:ml-4 text-base sm:text-lg font-semibold truncate">Admin Dashboard</h2>
          </header>
          
          <main className="flex-1 p-3 sm:p-6 lg:p-8 bg-background overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
