import { Home, FileText, MapPin, LogOut, PlusCircle, Edit, Star, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { open } = useSidebar();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-sidebar-foreground truncate">
          {open ? "Admin Panel" : "AP"}
        </h2>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-2">Navigacija</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={!open ? "Početna stranica" : undefined}>
                  <Link to="/" className="text-sm">
                    <Home className="h-4 w-4" />
                    {open && <span className="ml-2">Početna stranica</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-2">Blog Postovi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("create-blog")}
                  isActive={currentView === "create-blog"}
                  tooltip={!open ? "Kreiraj Blog" : undefined}
                  className="text-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  {open && <span className="ml-2">Kreiraj Blog</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("edit-blogs")}
                  isActive={currentView === "edit-blogs"}
                  tooltip={!open ? "Uredi Blogove" : undefined}
                  className="text-sm"
                >
                  <Edit className="h-4 w-4" />
                  {open && <span className="ml-2">Uredi Blogove</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-2">Izleti</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("create-trip")}
                  isActive={currentView === "create-trip"}
                  tooltip={!open ? "Kreiraj Izlet" : undefined}
                  className="text-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  {open && <span className="ml-2">Kreiraj Izlet</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("edit-trips")}
                  isActive={currentView === "edit-trips"}
                  tooltip={!open ? "Uredi Izlete" : undefined}
                  className="text-sm"
                >
                  <Edit className="h-4 w-4" />
                  {open && <span className="ml-2">Uredi Izlete</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-2">Istaknuti Izlet</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("create-next-trip")}
                  isActive={currentView === "create-next-trip"}
                  tooltip={!open ? "Kreiraj Istaknuti Izlet" : undefined}
                  className="text-sm"
                >
                  <Star className="h-4 w-4" />
                  {open && <span className="ml-2">Kreiraj Istaknuti Izlet</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("edit-next-trip")}
                  isActive={currentView === "edit-next-trip"}
                  tooltip={!open ? "Uredi Istaknuti Izlet" : undefined}
                  className="text-sm"
                >
                  <Edit className="h-4 w-4" />
                  {open && <span className="ml-2">Uredi Istaknuti Izlet</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm px-2">Administracija</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onViewChange("manage-users")}
                  isActive={currentView === "manage-users"}
                  tooltip={!open ? "Upravljanje korisnicima" : undefined}
                  className="text-sm"
                >
                  <Users className="h-4 w-4" />
                  {open && <span className="ml-2">Upravljanje korisnicima</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 sm:p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip={!open ? "Odjavi se" : undefined} className="text-sm">
              <LogOut className="h-4 w-4" />
              {open && <span className="ml-2">Odjavi se</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
