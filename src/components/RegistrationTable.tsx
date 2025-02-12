import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, DollarSign } from "lucide-react";

interface Registration {
  id: string;
  name: string;
  email: string;
  eventName: string;
  status: "pendente" | "confirmado" | "cancelado";
  paymentStatus: "não pago" | "pago";
  previousPaymentStatus?: "não pago" | "pago";
  amount: number;
  date: string;
}

interface RegistrationTableProps {
  registrations?: Registration[];
  onUpdateStatus?: (id: string, status: string) => void;
  onUpdatePayment?: (id: string, status: string) => void;
}

const defaultRegistrations: Registration[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    eventName: "Conferência de Verão 2024",
    status: "pendente",
    paymentStatus: "não pago",
    amount: 299.99,
    date: "2024-06-15",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@exemplo.com",
    eventName: "Workshop de Tecnologia",
    status: "confirmado",
    paymentStatus: "pago",
    amount: 149.99,
    date: "2024-07-01",
  },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "confirmado":
      return "bg-green-500";
    case "cancelado":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};

const getPaymentStatusBadgeColor = (status: string) => {
  return status === "pago" ? "bg-green-500" : "bg-orange-500";
};

const RegistrationTable = ({
  registrations = defaultRegistrations,
  onUpdateStatus = () => {},
  onUpdatePayment = () => {},
}: RegistrationTableProps) => {
  const handlePayment = (registration: Registration) => {
    onUpdatePayment(registration.id, "pago");
  };

  const handleCancel = (registration: Registration) => {
    // First restore the payment status if it was paid
    if (registration.paymentStatus === "pago") {
      onUpdatePayment(registration.id, "não pago");
    }
    // Then update the status to pendente (not cancelado)
    onUpdateStatus(registration.id, "pendente");
  };

  return (
    <div className="w-full bg-background rounded-md shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{registration.name}</TableCell>
              <TableCell>{registration.email}</TableCell>
              <TableCell>{registration.eventName}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(registration.status)}>
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
              <TableCell>R$ {registration.amount.toFixed(2)}</TableCell>
              <TableCell>{registration.date}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {registration.status === "pendente" &&
                    registration.paymentStatus === "pago" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateStatus(registration.id, "confirmado")
                        }
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                  {registration.paymentStatus === "não pago" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePayment(registration)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Marcar como Pago
                    </Button>
                  )}
                  {registration.status === "pendente" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(registration)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrationTable;
