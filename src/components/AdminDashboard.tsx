import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Plus,
  LogOut,
  Edit,
  ClipboardList,
  CheckCircle,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
  Wallet,
  FileSpreadsheet,
  Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Dialog, DialogContent } from "./ui/dialog";
import EventCreationForm from "./EventCreationForm";
import RegistrationTable from "./RegistrationTable";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import { api } from "@/lib/api";

interface Event {
  id: string;
  name: string;
  date: string;
  price: number;
  capacity: number;
  location: {
    address: string;
  };
}

interface Registration {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  address: string;
  neighborhood: string;
  number: string;
  isMinor: "sim" | "nao";
  minorDocument?: string;
  hasAllergies: "sim" | "nao";
  allergiesNotes?: string;
  eventName: string;
  status: "pendente" | "confirmado" | "cancelado";
  paymentStatus: "não pago" | "pago";
  amount: number;
  date: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [selectedTab, setSelectedTab] = React.useState("dashboard");
  const [events, setEvents] = React.useState<Event[]>([]);
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadData();
  }, []);

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

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleExportRegistrations = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(registrations);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registrations");
      XLSX.writeFile(wb, "registrations.xlsx");
    } catch (error) {
      console.error("Error exporting registrations:", error);
      alert("Erro ao exportar inscrições. Por favor, tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadData}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === "pendente",
  );
  const confirmedRegistrations = registrations.filter(
    (reg) => reg.status === "confirmado",
  );
  const canceledRegistrations = registrations.filter(
    (reg) => reg.status === "cancelado",
  );

  const totalRevenue = registrations
    .filter((reg) => reg.paymentStatus === "pago")
    .reduce((acc, reg) => acc + (reg.amount || 0), 0);

  const totalCapacity = events.reduce(
    (acc, event) => acc + (event.capacity || 0),
    0,
  );

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      value: "dashboard",
    },
    {
      icon: ClipboardList,
      label: "Inscrições Pendentes",
      value: "pending",
      count: pendingRegistrations.length,
    },
    {
      icon: CheckCircle,
      label: "Inscrições Confirmadas",
      value: "confirmed",
      count: confirmedRegistrations.length,
    },
    {
      icon: Ban,
      label: "Inscrições Canceladas",
      value: "canceled",
      count: canceledRegistrations.length,
    },
    {
      icon: Calendar,
      label: "Eventos",
      value: "events",
      count: events.length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen p-4 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Admin</h2>
            <ThemeToggle />
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant={selectedTab === item.value ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  selectedTab === item.value
                    ? "bg-primary text-primary-foreground"
                    : "",
                )}
                onClick={() => setSelectedTab(item.value)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.count !== undefined && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-background/20"
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
            onClick={() => navigate("/")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <Users className="h-10 w-10 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total de Inscrições
                      </p>
                      <h3 className="text-2xl font-bold">
                        {registrations.length}
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <Wallet className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Receita Total
                      </p>
                      <h3 className="text-2xl font-bold">
                        R$ {totalRevenue.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-10 w-10 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Capacidade Total
                      </p>
                      <h3 className="text-2xl font-bold">{totalCapacity}</h3>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Atividades Recentes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportRegistrations}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>

                <RegistrationTable
                  registrations={registrations.slice(0, 5)}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePayment={handleUpdatePayment}
                />
              </Card>
            </div>
          )}

          {selectedTab === "pending" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Inscrições Pendentes</h2>
              </div>
              <RegistrationTable
                registrations={pendingRegistrations}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePayment={handleUpdatePayment}
                showManualRegistration
              />
            </div>
          )}

          {selectedTab === "confirmed" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Inscrições Confirmadas</h2>
              </div>
              <RegistrationTable
                registrations={confirmedRegistrations}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePayment={handleUpdatePayment}
                showCancelButton
              />
            </div>
          )}

          {selectedTab === "canceled" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Inscrições Canceladas</h2>
              </div>
              <RegistrationTable
                registrations={canceledRegistrations}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePayment={handleUpdatePayment}
              />
            </div>
          )}

          {selectedTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Eventos</h2>
                <Button onClick={() => setShowEventForm(true)}>
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
                          onClick={() => handleEditEvent(event)}
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
          )}
        </div>
      </div>

      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent>
          <EventCreationForm
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
