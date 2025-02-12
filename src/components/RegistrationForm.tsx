import React from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  eventId: z.string().min(1, "Please select an event"),
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

const defaultEvents: Event[] = [
  {
    id: "1",
    name: "Summer Conference 2024",
    date: "2024-06-15",
    price: 299.99,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Broadway, New York, NY 10007",
    },
  },
  {
    id: "2",
    name: "Tech Workshop",
    date: "2024-07-01",
    price: 149.99,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "456 Market St, San Francisco, CA 94105",
    },
  },
];

export default function RegistrationForm({
  events = defaultEvents,
  onSubmit = (data) => console.log(data),
  selectedEvent = "",
}: RegistrationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      eventId: selectedEvent,
    },
  });

  const selectedEventData = events.find(
    (event) => event.id === form.watch("eventId"),
  );

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Event</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
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
                  Price: ${selectedEventData.price.toFixed(2)}
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
              Register
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
