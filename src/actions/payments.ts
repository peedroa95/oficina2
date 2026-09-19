"use server";

import { prisma } from "@/lib/prisma";
import { ActionError, errorMessage, reqNum, reqStr, str } from "@/lib/form";
import { recalcTotals } from "@/lib/serviceOrder";
import { formatOS } from "@/lib/format";
import { redirect } from "next/navigation";
import type { FormaPagamento } from "@/generated/prisma/enums";

export async function addPayment(orderId: number, formData: FormData) {
  try {
    const valor = reqNum(formData, "valor");
    if (valor <= 0) throw new ActionError("O valor do pagamento deve ser maior que zero.");
    const formaPagamento = reqStr(formData, "formaPagamento") as FormaPagamento;
    const dataStr = str(formData, "data");
    const data = dataStr ? new Date(`${dataStr}T12:00:00`) : new Date();

    await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { customer: true },
      });

      const payment = await tx.payment.create({
        data: { serviceOrderId: orderId, valor, formaPagamento, data },
      });

      await tx.financialTransaction.create({
        data: {
          tipo: "ENTRADA",
          descricao: `Pagamento ${formatOS(orderId)} - ${order.customer.nome}`,
          valor,
          data,
          categoria: "Ordem de Serviço",
          serviceOrderId: orderId,
          paymentId: payment.id,
        },
      });

      await recalcTotals(tx, orderId);
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Pagamento registrado.")}`);
}
