import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface FeaturedTrip {
  id: string;
  title: string;
  date: string;
  cover_image: string | null;
  is_active: boolean;
}

interface EditNextTripModalProps {
  trip: FeaturedTrip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditNextTripModal = ({
  trip,
  open,
  onOpenChange,
  onSuccess,
}: EditNextTripModalProps) => {
  const [coverImage, setCoverImage] = useState<string>(trip.cover_image || "");
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
    defaultValues: {
      title: trip.title,
      date: new Date(trip.date),
      cover_image: trip.cover_image || "",
    },
  });

  const selectedDate = watch("date");

  useEffect(() => {
    if (open) {
      reset({
        title: trip.title,
        date: new Date(trip.date),
        cover_image: trip.cover_image || "",
      });
      setCoverImage(trip.cover_image || "");
    }
  }, [open, trip, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('featured_trip')
        .update({
          title: data.title,
          date: data.date.toISOString(),
          cover_image: coverImage || null,
        })
        .eq('id', trip.id);

      if (error) throw error;

      toast({
        title: "Uspješno!",
        description: "Istaknuti izlet je ažuriran.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating featured trip:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom ažuriranja istaknuti izlet.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uredi Istaknuti Izlet</DialogTitle>
        </DialogHeader>

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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Odustani
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Spremanje..." : "Spremi promjene"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
