import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit } from "lucide-react";
import type { Event } from "@/types/api";

interface EventsListProps {
  events: Event[];
  onCreateEvent: () => void;
  onEditEvent: (event: Event) => void;
}

export function EventsList({
  events,
  onCreateEvent,
  onEditEvent,
}: EventsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Eventos</h2>
        <Button onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditEvent(event)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Data:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Preço:</span> R${" "}
                  {event.price?.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Capacidade:</span>{" "}
                  {event.capacity} pessoas
                </p>
                <p>
                  <span className="font-medium">Local:</span>{" "}
                  {event.location?.address}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
