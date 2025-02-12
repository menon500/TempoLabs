import React from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import { useEventStore } from "../lib/store";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const eventFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.date(),
  price: z.string().min(1, "Preço é obrigatório"),
  capacity: z.string().min(1, "Capacidade é obrigatória"),
  location: z.string().min(1, "Localização é obrigatória"),
  backgroundImage: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventCreationFormProps {
  onSubmit?: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  isOpen?: boolean;
}

export default function EventCreationForm({
  onSubmit = (data) => console.log(data),
  initialData,
  isOpen = true,
}: EventCreationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || new Date(),
      price: initialData?.price || "",
      capacity: initialData?.capacity || "",
      location: initialData?.location || "",
      backgroundImage: initialData?.backgroundImage || "",
    },
  });

  const [date, setDate] = React.useState<Date>(initialData?.date || new Date());
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    initialData?.backgroundImage || null,
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Tamanho máximo: 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setValue("backgroundImage", imageUrl);
        useEventStore.getState().setBackgroundImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-4 md:p-6 bg-card shadow-lg overflow-y-auto max-h-[90vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Evento</Label>
          <Input
            id="title"
            placeholder="Digite o título do evento"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Digite a descrição do evento"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Data do Evento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setValue("date", newDate);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade Máxima</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="100"
              {...register("capacity")}
            />
            {errors.capacity && (
              <p className="text-sm text-red-500">{errors.capacity.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            placeholder="Digite o endereço do evento"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundImage">Imagem do Evento</Label>
          <Input
            id="backgroundImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div className="h-[300px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Visualização do Mapa</p>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {initialData ? "Salvar Alterações" : "Criar Evento"}
        </Button>
      </form>
    </Card>
  );
}
