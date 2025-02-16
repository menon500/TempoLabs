import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import type { Event } from "@/types/api";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(2, "