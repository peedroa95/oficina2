import { FormaPagamento, StatusOrdemServico } from "@/generated/prisma/enums";

export const STATUS_OS_LABELS: Record<StatusOrdemServico, string> = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
  ENTREGUE: "Entregue",
  CANCELADA: "Cancelada",
};

export const STATUS_OS_BADGE: Record<StatusOrdemServico, string> = {
  ABERTA: "bg-blue-100 text-blue-700 border-blue-200",
  EM_ANDAMENTO: "bg-amber-100 text-amber-700 border-amber-200",
  FINALIZADA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ENTREGUE: "bg-slate-200 text-slate-700 border-slate-300",
  CANCELADA: "bg-red-100 text-red-700 border-red-200",
};

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Débito",
  CREDITO: "Crédito",
  TRANSFERENCIA: "Transferência",
  OUTRO: "Outro",
};

export const CATEGORIAS_SAIDA = [
  "Compra de peças",
  "Energia",
  "Água",
  "Aluguel",
  "Ferramentas",
  "Salários",
  "Manutenção",
  "Outros",
];

export function statusPagamento(valorTotal: number, valorPago: number): "PENDENTE" | "PARCIAL" | "PAGO" {
  if (valorPago <= 0) return "PENDENTE";
  if (valorPago < valorTotal) return "PARCIAL";
  return "PAGO";
}

export const STATUS_PAGAMENTO_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  PARCIAL: "Parcial",
  PAGO: "Pago",
};

export const STATUS_PAGAMENTO_BADGE: Record<string, string> = {
  PENDENTE: "bg-red-100 text-red-700 border-red-200",
  PARCIAL: "bg-amber-100 text-amber-700 border-amber-200",
  PAGO: "bg-emerald-100 text-emerald-700 border-emerald-200",
};
