import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const eventFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.date(),
  price: z.string().min(1, "Preço é obrigatório"),
  capacity: z.string().min(1, "Capacidade é obrigatória"),
  location: z.object({
    address: z.string().min(1, "Endereço é obrigatório"),
  }),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventCreationFormProps {
  onSubmit?: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

export default function EventCreationForm({
  onSubmit = (data) => console.log(data),
  initialData,
}: EventCreationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      date: initialData?.date || new Date(),
      price: initialData?.price || "",
      capacity: initialData?.capacity || "",
      location: initialData?.location || {
        address: "",
      },
    },
  });

  const [date, setDate] = React.useState<Date>(initialData?.date || new Date());

  const handleFormSubmit = (data: EventFormData) => {
    try {
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        capacity: parseInt(data.capacity),
        date: date.toISOString(),
      };
      onSubmit(formattedData);
    } catch (error) {
      console.error("Error formatting form data:", error);
      alert(
        "Erro ao processar dados do formulário. Por favor, verifique os campos.",
      );
    }
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto p-4">
      <h2 className="text-lg font-semibold">
        {initialData ? "Editar Evento" : "Criar Novo Evento"}
      </h2>
      <p className="text-sm text-muted-foreground">
        Preencha os detalhes do evento abaixo. Todos os campos marcados com *
        são obrigatórios.
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Evento *</Label>
          <Input
            id="name"
            placeholder="Digite o nome do evento"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição *</Label>
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
          <Label>Data do Evento *</Label>
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
            <Label htmlFor="price">Preço (R$) *</Label>
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
            <Label htmlFor="capacity">Capacidade Máxima *</Label>
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
          <Label htmlFor="location.address">Endereço *</Label>
          <Input
            id="location.address"
            placeholder="Digite o endereço do evento"
            {...register("location.address")}
          />
          {errors.location?.address && (
            <p className="text-sm text-red-500">
              {errors.location.address.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            {initialData ? "Salvar Alterações" : "Criar Evento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
