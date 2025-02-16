import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Event, Registration } from "@/types/api";

export function useAdminDashboard() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [eventsData, registrationsData] = await Promise.all([
        api.events.list(),
        api.registrations.list(),
      ]);

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setRegistrations(
        Array.isArray(registrationsData) ? registrationsData : [],
      );
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (data: any) => {
    try {
      const newEvent = await api.events.create(data);
      setEvents([...events, newEvent]);
      setShowEventForm(false);
      loadData();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Erro ao criar evento. Por favor, tente novamente.");
    }
  };

  const handleUpdateEvent = async (data: any) => {
    try {
      if (!editingEvent?.id) return;
      const updatedEvent = await api.events.update(editingEvent.id, data);
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? updatedEvent : event,
        ),
      );
      setShowEventForm(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Erro ao atualizar evento. Por favor, tente novamente.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updatedRegistration = await api.registrations.updateStatus(
        id,
        newStatus,
      );
      setRegistrations(
        registrations.map((reg) => (reg.id === id ? updatedRegistration : reg)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erro ao atualizar status. Por favor, tente novamente.");
    }
  };

  const handleUpdatePayment = async (id: string, newPaymentStatus: string) => {
    try {
      const updatedRegistration = await api.registrations.updatePayment(
        id,
        newPaymentStatus,
      );
      setRegistrations(
        registrations.map((reg) => (reg.id === id ? updatedRegistration : reg)),
      );
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Erro ao atualizar pagamento. Por favor, tente novamente.");
    }
  };

  return {
    showEventForm,
    setShowEventForm,
    editingEvent,
    setEditingEvent,
    selectedTab,
    setSelectedTab,
    events,
    registrations,
    isLoading,
    error,
    loadData,
    handleCreateEvent,
    handleUpdateEvent,
    handleUpdateStatus,
    handleUpdatePayment,
  };
}
