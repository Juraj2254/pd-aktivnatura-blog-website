-- Create function to get all users (security definer to access auth.users)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  is_admin boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id AND ur.role = 'admin') as is_admin
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Create function to assign admin role
CREATE OR REPLACE FUNCTION public.assign_admin_role(_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Check if role already exists
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _target_user_id AND role = 'admin') THEN
    RETURN true; -- Already an admin
  END IF;
  
  -- Insert the admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, 'admin');
  
  RETURN true;
END;
$$;

-- Create function to remove admin role
CREATE OR REPLACE FUNCTION public.remove_admin_role(_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Prevent removing own admin role
  IF _target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove your own admin role.';
  END IF;
  
  -- Delete the admin role
  DELETE FROM public.user_roles 
  WHERE user_id = _target_user_id AND role = 'admin';
  
  RETURN true;
END;
$$;