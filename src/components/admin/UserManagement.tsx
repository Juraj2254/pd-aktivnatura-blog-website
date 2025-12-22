import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldOff, RefreshCw, Users } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);
  };

  const fetchUsers = async () => {
    setLoading(true);
    
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) {
      toast({
        title: "Greška",
        description: "Nije moguće dohvatiti korisnike: " + error.message,
        variant: "destructive",
      });
    } else {
      setUsers(data || []);
    }
    
    setLoading(false);
  };

  const handleAssignAdmin = async (userId: string) => {
    setActionLoading(userId);
    
    const { error } = await supabase.rpc('assign_admin_role', { _target_user_id: userId });
    
    if (error) {
      toast({
        title: "Greška",
        description: "Nije moguće dodijeliti admin ulogu: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspjeh",
        description: "Admin uloga uspješno dodijeljena.",
      });
      fetchUsers();
    }
    
    setActionLoading(null);
  };

  const handleRemoveAdmin = async (userId: string) => {
    setActionLoading(userId);
    
    const { error } = await supabase.rpc('remove_admin_role', { _target_user_id: userId });
    
    if (error) {
      toast({
        title: "Greška",
        description: error.message.includes("Cannot remove your own") 
          ? "Ne možete ukloniti vlastitu admin ulogu." 
          : "Nije moguće ukloniti admin ulogu: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspjeh",
        description: "Admin uloga uspješno uklonjena.",
      });
      fetchUsers();
    }
    
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7" />
            Upravljanje korisnicima
          </h1>
          <p className="text-muted-foreground mt-1">
            Dodijelite ili uklonite admin prava registriranim korisnicima
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Osvježi
        </Button>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nema registriranih korisnika.
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className={user.id === currentUserId ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {user.email}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground font-normal">(Vi)</span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm">
                      Registriran: {format(new Date(user.created_at), "d. MMMM yyyy.", { locale: hr })}
                      {user.last_sign_in_at && (
                        <> · Zadnja prijava: {format(new Date(user.last_sign_in_at), "d. MMM yyyy. HH:mm", { locale: hr })}</>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={user.is_admin ? "default" : "secondary"}>
                    {user.is_admin ? "Admin" : "Korisnik"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {user.is_admin ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAdmin(user.id)}
                    disabled={actionLoading === user.id || user.id === currentUserId}
                    className="text-destructive hover:text-destructive"
                  >
                    {actionLoading === user.id ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ShieldOff className="h-4 w-4 mr-2" />
                    )}
                    {user.id === currentUserId ? "Ne možete ukloniti vlastitu ulogu" : "Ukloni admin"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignAdmin(user.id)}
                    disabled={actionLoading === user.id}
                  >
                    {actionLoading === user.id ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Dodijeli admin
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
