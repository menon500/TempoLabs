import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
  Download,
  Ban,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import EventCreationForm from "./EventCreationForm";
import RegistrationTable, {
  getStatusBadgeColor,
  getPaymentStatusBadgeColor,
} from "./RegistrationTable";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import * as XLSX from "xlsx";
import { api } from "@/lib/api";

interface Event {
  id: string;
  name: string;
  date: string;
  price: number;
  capacity: string;
  location: {
    latitude: number;
    longitude: number;
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
  previousPaymentStatus?: "não pago" | "pago";
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

  React.useEffect(() => {
    api.events.list().then(setEvents);
    api.registrations.list().then(setRegistrations);
  }, []);

  const handleCreateEvent = async (data: any) => {
    const newEvent = await api.events.create(data);
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const handleUpdateEvent = async (data: any) => {
    const updatedEvent = await api.events.update(editingEvent?.id!, data);
    setEvents(
      events.map((event) =>
        event.id === editingEvent?.id ? updatedEvent : event,
      ),
    );
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const updatedRegistration = await api.registrations.updateStatus(
      id,
      newStatus,
    );
    setRegistrations((prevRegistrations) =>
      prevRegistrations.map((reg) =>
        reg.id === id ? updatedRegistration : reg,
      ),
    );
  };

  const handleUpdatePayment = async (id: string, newPaymentStatus: string) => {
    const updatedRegistration = await api.registrations.updatePayment(
      id,
      newPaymentStatus,
    );
    setRegistrations((prevRegistrations) =>
      prevRegistrations.map((reg) =>
        reg.id === id ? updatedRegistration : reg,
      ),
    );
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleExportRegistrations = () => {
    const ws = XLSX.utils.json_to_sheet(registrations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "registrations.xlsx");
  };

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
    .reduce((acc, reg) => acc + reg.amount, 0);

  const totalCapacity = events.reduce(
    (acc, event) => acc + parseInt(event.capacity),
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

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.slice(0, 5).map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.fullName}</TableCell>
                        <TableCell>{registration.cpf}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>{registration.eventName}</TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusBadgeColor(registration.status)}
                          >
                            {registration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentStatusBadgeColor(
                              registration.paymentStatus,
                            )}
                          >
                            {registration.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          R$ {registration.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{registration.date}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Detalhes da Inscrição
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-semibold">Endereço:</p>
                                    <p>
                                      {registration.address},{" "}
                                      {registration.number}
                                    </p>
                                    <p>{registration.neighborhood}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      Menor de idade:
                                    </p>
                                    <p>
                                      {registration.isMinor === "sim"
                                        ? "Sim"
                                        : "Não"}
                                    </p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="font-semibold">Alergias:</p>
                                    <p>
                                      {registration.hasAllergies === "sim"
                                        ? registration.allergiesNotes ||
                                          "Sim (sem detalhes)"
                                        : "Não"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                          {event.date}
                        </p>
                        <p>
                          <span className="font-medium">Preço:</span> R${" "}
                          {event.price.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Capacidade:</span>{" "}
                          {event.capacity} pessoas
                        </p>
                        <p>
                          <span className="font-medium">Local:</span>{" "}
                          {event.location.address}
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
        <DialogContent className="max-w-3xl">
          <EventCreationForm
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
