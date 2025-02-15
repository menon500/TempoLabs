import React from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import EventLocationMap from "./EventLocationMap";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThemeToggle } from "./ThemeToggle";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(2, "Endereço é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  isMinor: z.enum(["sim", "nao"]),
  minorDocument: z.string().optional(),
  hasAllergies: z.enum(["sim", "nao"]),
  allergiesNotes: z.string().optional(),
  eventId: z.string().min(1, "Por favor selecione um evento"),
});

interface Event {
  id: string;
  name: string;
  date: string;
  price: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface RegistrationFormProps {
  events?: Event[];
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  selectedEvent?: string;
}

const defaultEvents: Event[] = [];

import { api } from "@/lib/api";

export default function RegistrationForm({
  events = defaultEvents,
  onSubmit = async (data) => {
    try {
      const selectedEvent = events.find((event) => event.id === data.eventId);
      if (!selectedEvent) {
        throw new Error("Event not found");
      }

      const registrationData = {
        ...data,
        eventName: selectedEvent.name,
      };

      await api.registrations.create(registrationData);
      alert("Inscrição realizada com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating registration:", error);
      alert("Erro ao realizar inscrição. Tente novamente.");
    }
  },
  selectedEvent = "",
}: RegistrationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      phone: "",
      address: "",
      neighborhood: "",
      number: "",
      isMinor: "nao",
      hasAllergies: "nao",
      eventId: selectedEvent,
    },
  });

  const selectedEventData = events.find(
    (event) => event.id === form.watch("eventId"),
  );

  const isMinor = form.watch("isMinor") === "sim";
  const hasAllergies = form.watch("hasAllergies") === "sim";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for storage/preview
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("minorDocument", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background relative">
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mr-4"
        >
          Voltar
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-2xl mx-auto mt-8 p-6 bg-card shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua Principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMinor"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>É menor de 18 anos?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">Sim</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">Não</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMinor && (
              <div className="space-y-2">
                <FormLabel>Upload da Autorização</FormLabel>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="hasAllergies"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    É alérgico a algum medicamento ou alimento?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">Sim</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">Não</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasAllergies && (
              <FormField
                control={form.control}
                name="allergiesNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações sobre alergias</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva suas alergias aqui..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selecionar Evento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name} - {event.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedEventData && (
              <div className="space-y-4">
                <div className="text-lg font-semibold">
                  Preço: R$ {selectedEventData.price.toFixed(2)}
                </div>
                <EventLocationMap
                  latitude={selectedEventData.location.latitude}
                  longitude={selectedEventData.location.longitude}
                  eventName={selectedEventData.name}
                  address={selectedEventData.location.address}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              Inscrever-se
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
