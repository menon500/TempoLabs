import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import EventCreationForm from "./EventCreationForm";
import RegistrationTable from "./RegistrationTable";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import * as XLSX from "xlsx";

interface AdminDashboardProps {
  isOpen?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  price: string;
  capacity: string;
  location: string;
  backgroundImage?: string;
}

const AdminDashboard = ({ isOpen = true }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [showReportDialog, setShowReportDialog] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [reportOptions, setReportOptions] = React.useState({
    includePersonalInfo: true,
    includePaymentInfo: true,
    includeEventDetails: true,
    onlyConfirmed: false,
  });

  const [events, setEvents] = React.useState<Event[]>([
    {
      id: "1",
      title: "Conferência de Verão 2024",
      description: "Uma conferência incrível",
      date: new Date("2024-06-15"),
      price: "299.99",
      capacity: "100",
      location: "São Paulo, SP",
      backgroundImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    },
    {
      id: "2",
      title: "Workshop de Tecnologia",
      description: "Workshop hands-on",
      date: new Date("2024-07-01"),
      price: "149.99",
      capacity: "50",
      location: "Rio de Janeiro, RJ",
      backgroundImage:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    },
  ]);

  const [registrations, setRegistrations] = React.useState([
    {
      id: "1",
      name: "João Silva",
      email: "joao@exemplo.com",
      eventName: "Conferência de Verão 2024",
      status: "pendente",
      paymentStatus: "não pago",
      previousPaymentStatus: "não pago",
      amount: 299.99,
      date: "2024-06-15",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@exemplo.com",
      eventName: "Workshop de Tecnologia",
      status: "pendente",
      paymentStatus: "não pago",
      previousPaymentStatus: "não pago",
      amount: 149.99,
      date: "2024-07-01",
    },
    {
      id: "3",
      name: "Roberto Oliveira",
      email: "roberto@exemplo.com",
      eventName: "Evento de Networking",
      status: "confirmado",
      paymentStatus: "pago",
      previousPaymentStatus: "não pago",
      amount: 99.99,
      date: "2024-08-30",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setRegistrations((prevRegistrations) =>
      prevRegistrations.map((reg) => {
        if (reg.id === id) {
          return {
            ...reg,
            status: newStatus,
            paymentStatus:
              newStatus === "pendente" ? "não pago" : reg.paymentStatus,
          };
        }
        return reg;
      }),
    );
  };

  const handleUpdatePayment = (id: string, newPaymentStatus: string) => {
    setRegistrations((prevRegistrations) =>
      prevRegistrations.map((reg) => {
        if (reg.id === id) {
          return {
            ...reg,
            paymentStatus: newPaymentStatus,
            previousPaymentStatus: reg.paymentStatus,
          };
        }
        return reg;
      }),
    );
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleExportReport = () => {
    let dataToExport = registrations;

    // Filter based on options
    if (reportOptions.onlyConfirmed) {
      dataToExport = dataToExport.filter((reg) => reg.status === "confirmado");
    }

    // Create the report data based on selected options
    const reportData = dataToExport.map((reg) => {
      const row: any = {};

      if (reportOptions.includePersonalInfo) {
        row["Nome"] = reg.name;
        row["Email"] = reg.email;
      }

      if (reportOptions.includeEventDetails) {
        row["Evento"] = reg.eventName;
        row["Data"] = reg.date;
      }

      if (reportOptions.includePaymentInfo) {
        row["Status"] = reg.status;
        row["Status Pagamento"] = reg.paymentStatus;
        row["Valor"] = reg.amount;
      }

      return row;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Generate and download file
    XLSX.writeFile(
      wb,
      `event-registrations-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    setShowReportDialog(false);
  };

  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === "pendente",
  );

  const confirmedRegistrations = registrations.filter(
    (reg) => reg.status === "confirmado",
  );

  const totalRevenue = registrations
    .filter((reg) => reg.paymentStatus === "pago")
    .reduce((acc, reg) => acc + reg.amount, 0);

  const totalCapacity = events.reduce(
    (acc, event) => acc + parseInt(event.capacity),
    0,
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 space-y-4">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-lg font-semibold">Painel Admin</h2>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "dashboard" && "bg-muted",
            )}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "registrations" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "registrations" && "bg-muted",
            )}
            onClick={() => setActiveTab("registrations")}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Inscrições Pendentes
          </Button>

          <Button
            variant={activeTab === "confirmed" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "confirmed" && "bg-muted",
            )}
            onClick={() => setActiveTab("confirmed")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Inscrições Confirmadas
          </Button>

          <Button
            variant={activeTab === "events" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "events" && "bg-muted",
            )}
            onClick={() => setActiveTab("events")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Eventos
          </Button>

          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === "reports" && "bg-muted",
            )}
            onClick={() => setShowReportDialog(true)}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 w-56">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "registrations" && "Inscrições Pendentes"}
            {activeTab === "confirmed" && "Inscrições Confirmadas"}
            {activeTab === "events" && "Eventos"}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {activeTab === "events" && (
              <Dialog
                open={showEventForm}
                onOpenChange={(open) => {
                  setShowEventForm(open);
                  if (!open) setEditingEvent(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    {editingEvent ? (
                      <Edit className="w-4 h-4 mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {editingEvent ? "Editar Evento" : "Criar Evento"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <EventCreationForm
                    initialData={editingEvent}
                    onSubmit={(data) => {
                      if (editingEvent) {
                        setEvents((prevEvents) =>
                          prevEvents.map((event) =>
                            event.id === editingEvent.id
                              ? { ...event, ...data }
                              : event,
                          ),
                        );
                      } else {
                        setEvents((prevEvents) => [
                          ...prevEvents,
                          { ...data, id: String(prevEvents.length + 1) },
                        ]);
                      }
                      setShowEventForm(false);
                      setEditingEvent(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Report Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4 py-4">
              <h2 className="text-lg font-semibold">Exportar Relatório</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal-info"
                    checked={reportOptions.includePersonalInfo}
                    onCheckedChange={(checked) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        includePersonalInfo: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="personal-info">Informações Pessoais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-info"
                    checked={reportOptions.includePaymentInfo}
                    onCheckedChange={(checked) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        includePaymentInfo: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="payment-info">Informações de Pagamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="event-details"
                    checked={reportOptions.includeEventDetails}
                    onCheckedChange={(checked) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        includeEventDetails: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="event-details">Detalhes do Evento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="only-confirmed"
                    checked={reportOptions.onlyConfirmed}
                    onCheckedChange={(checked) =>
                      setReportOptions((prev) => ({
                        ...prev,
                        onlyConfirmed: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="only-confirmed">
                    Apenas Inscrições Confirmadas
                  </Label>
                </div>
              </div>
              <Button onClick={handleExportReport} className="mt-4">
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Content based on active tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Revenue Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Receita Total</h3>
                  <Wallet className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  R$ {totalRevenue.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {
                    registrations.filter((reg) => reg.paymentStatus === "pago")
                      .length
                  }{" "}
                  pagamentos confirmados
                </p>
              </Card>

              {/* Confirmed Registrations Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Inscrições Confirmadas
                  </h3>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {confirmedRegistrations.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {(
                    (confirmedRegistrations.length / registrations.length) *
                    100
                  ).toFixed(1)}
                  % do total
                </p>
              </Card>

              {/* Events Overview Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Eventos Ativos</h3>
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold mb-2">{events.length}</div>
                <p className="text-sm text-muted-foreground">
                  Capacidade total: {totalCapacity} pessoas
                </p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                <RegistrationTable
                  registrations={registrations.slice(0, 5)}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePayment={handleUpdatePayment}
                />
              </div>
            </Card>
          </div>
        )}

        {activeTab === "registrations" && (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Inscrições Pendentes
              </h2>
              <p className="text-yellow-700">
                {pendingRegistrations.length} inscrições aguardando confirmação
              </p>
            </div>
            <RegistrationTable
              registrations={pendingRegistrations}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePayment={handleUpdatePayment}
            />
          </div>
        )}

        {activeTab === "confirmed" && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Inscrições Confirmadas
              </h2>
              <p className="text-green-700">
                {confirmedRegistrations.length} inscrições confirmadas
              </p>
            </div>
            <RegistrationTable
              registrations={confirmedRegistrations}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePayment={handleUpdatePayment}
            />
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <p className="text-sm">
                    Data: {event.date.toLocaleDateString()}
                  </p>
                  <p className="text-sm">Preço: R$ {event.price}</p>
                  <p className="text-sm">Capacidade: {event.capacity}</p>
                  <p className="text-sm">Local: {event.location}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
