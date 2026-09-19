import type { Prisma } from "@/generated/prisma/client";

type TxClient = Prisma.TransactionClient;

export async function recalcTotals(tx: TxClient, serviceOrderId: number) {
  const [servicos, pecas, pagamentos, order] = await Promise.all([
    tx.serviceOrderService.aggregate({
      where: { serviceOrderId },
      _sum: { subtotal: true },
    }),
    tx.serviceOrderProduct.aggregate({
      where: { serviceOrderId },
      _sum: { subtotal: true },
    }),
    tx.payment.aggregate({
      where: { serviceOrderId },
      _sum: { valor: true },
    }),
    tx.serviceOrder.findUniqueOrThrow({ where: { id: serviceOrderId } }),
  ]);

  const valorServicos = Number(servicos._sum.subtotal ?? 0);
  const valorPecas = Number(pecas._sum.subtotal ?? 0);
  const desconto = Number(order.desconto);
  const valorTotal = Math.max(0, valorServicos + valorPecas - desconto);
  const valorPago = Number(pagamentos._sum.valor ?? 0);

  return tx.serviceOrder.update({
    where: { id: serviceOrderId },
    data: { valorServicos, valorPecas, valorTotal, valorPago },
  });
}

export const EDITABLE_STATUSES = ["ABERTA", "EM_ANDAMENTO"];
