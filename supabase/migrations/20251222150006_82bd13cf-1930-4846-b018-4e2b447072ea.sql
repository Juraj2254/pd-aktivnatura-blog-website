-- Function to auto-assign admin role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$;

-- Trigger on auth.users table to auto-assign admin role
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_role();

-- RLS policy for users to view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Grant admin role to existing user (dolores.vesligaj@gmail.com)
INSERT INTO public.user_roles (user_id, role)
VALUES ('23ef4a29-b9d4-4060-a8ba-3237ec356761', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;