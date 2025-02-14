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
import { Check, DollarSign, FileText, Ban, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import RegistrationForm from "./RegistrationForm";
import {
  getStatusBadgeColor,
  getPaymentStatusBadgeColor,
} from "@/lib/registration-utils";

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

interface RegistrationTableProps {
  registrations?: Registration[];
  onUpdateStatus?: (id: string, status: string) => void;
  onUpdatePayment?: (id: string, status: string) => void;
  showCancelButton?: boolean;
  showManualRegistration?: boolean;
}

const defaultRegistrations: Registration[] = [];

const RegistrationTable = ({
  registrations = defaultRegistrations,
  onUpdateStatus = () => {},
  onUpdatePayment = () => {},
  showCancelButton = false,
  showManualRegistration = false,
}: RegistrationTableProps) => {
  const [selectedRegistration, setSelectedRegistration] =
    React.useState<Registration | null>(null);
  const [showManualRegistrationDialog, setShowManualRegistrationDialog] =
    React.useState(false);

  const handlePayment = (registration: Registration) => {
    if (registration.paymentStatus === "pago") {
      if (window.confirm("Deseja desconfirmar o pagamento?")) {
        onUpdatePayment(registration.id, "não pago");
      }
    } else {
      onUpdatePayment(registration.id, "pago");
    }
  };

  const handleCancel = (registration: Registration) => {
    if (registration.paymentStatus === "pago") {
      if (
        window.confirm(
          "Esta inscrição está paga. Deseja estornar o valor e cancelar?",
        )
      ) {
        onUpdateStatus(registration.id, "cancelado");
        onUpdatePayment(registration.id, "não pago");
      }
    } else {
      if (window.confirm("Tem certeza que deseja cancelar esta inscrição?")) {
        onUpdateStatus(registration.id, "cancelado");
      }
    }
  };

  return (
    <div className="space-y-4">
      {showManualRegistration && (
        <div className="flex justify-end">
          <Dialog
            open={showManualRegistrationDialog}
            onOpenChange={setShowManualRegistrationDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Nova Inscrição Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">
                  Nova Inscrição Manual
                </h2>
                <RegistrationForm
                  onSubmit={(data) => {
                    // The registration will be created with pending status by default
                    setShowManualRegistrationDialog(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="w-full bg-background rounded-md shadow-sm overflow-x-auto">
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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.fullName}</TableCell>
                <TableCell>{registration.cpf}</TableCell>
                <TableCell>{registration.phone}</TableCell>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRegistration(registration)}
                      >
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
                              {registration.address}, {registration.number}
                            </p>
                            <p>{registration.neighborhood}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Menor de idade:</p>
                            <p>
                              {registration.isMinor === "sim" ? "Sim" : "Não"}
                            </p>
                            {registration.isMinor === "sim" &&
                              registration.minorDocument && (
                                <div className="mt-2">
                                  <p className="font-semibold">Documento:</p>
                                  <img
                                    src={registration.minorDocument}
                                    alt="Autorização"
                                    className="max-w-[200px] mt-1"
                                  />
                                </div>
                              )}
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
                    {registration.status === "pendente" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePayment(registration)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        {registration.paymentStatus === "pago"
                          ? "Desconfirmar Pagamento"
                          : "Marcar como Pago"}
                      </Button>
                    )}
                    {(registration.status === "pendente" ||
                      showCancelButton) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(registration)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                    {registration.status === "cancelado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onUpdateStatus(registration.id, "pendente")
                        }
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Restaurar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegistrationTable;
