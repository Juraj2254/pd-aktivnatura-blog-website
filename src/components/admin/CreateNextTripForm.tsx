import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan").max(200, "Naslov je predugačak"),
  date: z.date({ required_error: "Datum je obavezan" }),
  cover_image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateNextTripForm = () => {
  const [coverImage, setCoverImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedDate = watch("date");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // First, deactivate any existing featured trips
      const { error: deactivateError } = await supabase
        .from('featured_trip')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      // Create new featured trip
      const { error: insertError } = await supabase
        .from('featured_trip')
        .insert({
          title: data.title,
          date: data.date.toISOString(),
          cover_image: coverImage || null,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast({
        title: "Uspješno!",
        description: "Istaknuti izlet je kreiran.",
      });

      // Reset form
      reset();
      setCoverImage("");
    } catch (error) {
      console.error("Error creating featured trip:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom kreiranja istaknuti izlet.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Kreiraj Istaknuti Izlet
        </h2>
        <p className="text-muted-foreground">
          Istaknuti izlet će se prikazati kao popup posjetiteljima stranice.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Naslov *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Unesite naslov izleta"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Datum *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "dd. MMMM yyyy.", { locale: hr })
                ) : (
                  <span>Odaberite datum</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setValue("date", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Naslovna slika</Label>
          <ImageUpload
            onImageUploaded={setCoverImage}
            value={coverImage}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Kreiranje..." : "Kreiraj Istaknuti Izlet"}
        </Button>
      </form>
    </div>
  );
};
