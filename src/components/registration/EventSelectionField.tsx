import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import EventLocationMap from "../EventLocationMap";
import type { UseFormReturn } from "react-hook-form";
import type { Event } from "@/types/api";

interface EventSelectionFieldProps {
  form: UseFormReturn<any>;
  events: Event[];
  selectedEvent?: Event;
}

export function EventSelectionField({
  form,
  events,
  selectedEvent,
}: EventSelectionFieldProps) {
  return (
    <>
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
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedEvent && (
        <div className="space-y-4">
          <div className="text-lg font-semibold">
            Preço: R$ {selectedEvent.price.toFixed(2)}
          </div>
          <EventLocationMap
            latitude={selectedEvent.location.latitude}
            longitude={selectedEvent.location.longitude}
            eventName={selectedEvent.name}
            address={selectedEvent.location.address}
          />
        </div>
      )}
    </>
  );
}
