export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  price: number;
  capacity: number;
  location: {
    address: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventName: string;
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
  status: "pendente" | "confirmado" | "cancelado";
  paymentStatus: "não pago" | "pago";
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
