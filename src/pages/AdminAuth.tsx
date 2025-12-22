import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import type { User, Session } from "@supabase/supabase-js";
import { z } from "zod";
import { SEO } from "@/components/SEO";

// Password validation schema
const passwordSchema = z.string()
  .min(12, "Lozinka mora imati najmanje 12 znakova")
  .regex(/[A-Z]/, "Lozinka mora sadržavati barem jedno veliko slovo")
  .regex(/[a-z]/, "Lozinka mora sadržavati barem jedno malo slovo")
  .regex(/[0-9]/, "Lozinka mora sadržavati barem jednu znamenku")
  .regex(/[^A-Za-z0-9]/, "Lozinka mora sadržavati barem jedan poseban znak (!@#$%^&*)")
  .refine((val) => {
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123', 'admin123'];
    return !commonPasswords.some(common => val.toLowerCase().includes(common));
  }, "Lozinka ne smije sadržavati uobičajene riječi");

const AdminAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate password in real-time during signup
  const validatePassword = (pwd: string) => {
    if (!isSignUp || pwd.length === 0) {
      setPasswordErrors([]);
      return true;
    }

    const result = passwordSchema.safeParse(pwd);
    if (!result.success) {
      const errors = result.error.errors.map(err => err.message);
      setPasswordErrors(errors);
      return false;
    }
    
    setPasswordErrors([]);
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role after auth state changes
        if (session?.user) {
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
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      navigate("/admin-dashboard");
    } else if (session) {
      // User is logged in but doesn't have admin role
      toast({
        title: "Pristup na čekanju",
        description: "Vaš račun je registriran, ali nema admin prava. Kontaktirajte postojećeg administratora za odobrenje.",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submitting
    if (!validatePassword(password)) {
      toast({
        title: "Neispravna lozinka",
        description: "Molimo ispravite greške u lozinki prije nego nastavite.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin-dashboard`
      }
    });

    if (error) {
      toast({
        title: "Greška pri registraciji",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspješna registracija",
        description: "Preusmjeravam na nadzornu ploču...",
      });
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Greška pri prijavi",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Uspješna prijava",
        description: "Preusmjeravam na nadzornu ploču...",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO title="Admin prijava" noindex />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Admin registracija" : "Admin prijava"}</CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Registrirajte se za pristup admin nadzornoj ploči" 
              : "Prijavite se s admin računom za pristup nadzornoj ploči"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={isSignUp && password.length > 0 && passwordErrors.length > 0 ? "border-destructive" : ""}
              />
              {isSignUp && password.length > 0 && (
                <div className="space-y-2 mt-2">
                  {passwordErrors.length > 0 ? (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="space-y-1">
                        {passwordErrors.map((error, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                          </div>
                        ))}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="py-2 border-green-500 bg-green-50 dark:bg-green-950">
                      <AlertDescription className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Lozinka ispunjava sve sigurnosne zahtjeve</span>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isSignUp ? "Registracija..." : "Prijava...") 
                : (isSignUp ? "Registriraj se" : "Prijavi se")}
            </Button>
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
              >
                {isSignUp 
                  ? "Već imate račun? Prijavite se" 
                  : "Nemate račun? Registrirajte se"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
