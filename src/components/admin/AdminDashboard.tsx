import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Calendar,
  FileSpreadsheet,
  Ban,
} from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import EventCreationForm from "../EventCreationForm";
import RegistrationTable from "../RegistrationTable";
import { DashboardStats } from "./DashboardStats";
import { DashboardSidebar } from "./DashboardSidebar";
import { EventsList } from "./EventsList";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const {
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
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ErrorMessage message={error} onRetry={loadData} />
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          menuItems={menuItems}
        />

        <div className="flex-1 p-6">
          {selectedTab === "dashboard" && (
            <div className="space-y-6">
              <DashboardStats
                totalRegistrations={registrations.length}
                totalRevenue={totalRevenue}
                totalCapacity={totalCapacity}
              />

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
            <EventsList
              events={events}
              onCreateEvent={() => setShowEventForm(true)}
              onEditEvent={setEditingEvent}
            />
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
