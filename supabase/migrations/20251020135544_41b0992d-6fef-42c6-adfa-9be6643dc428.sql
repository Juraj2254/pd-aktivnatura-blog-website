-- Create featured_trip table
CREATE TABLE public.featured_trip (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  cover_image text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.featured_trip ENABLE ROW LEVEL SECURITY;

-- Anyone can view active featured trips
CREATE POLICY "Anyone can view active featured trip"
  ON public.featured_trip
  FOR SELECT
  USING (is_active = true);

-- Admins can insert featured trips
CREATE POLICY "Admins can insert featured trip"
  ON public.featured_trip
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update featured trips
CREATE POLICY "Admins can update featured trip"
  ON public.featured_trip
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete featured trips
CREATE POLICY "Admins can delete featured trip"
  ON public.featured_trip
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_featured_trip_updated_at
  BEFORE UPDATE ON public.featured_trip
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();