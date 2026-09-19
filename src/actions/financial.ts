"use server";

import { prisma } from "@/lib/prisma";
import { ActionError, errorMessage, reqNum, reqStr, str } from "@/lib/form";
import { redirect } from "next/navigation";
import type { TipoTransacao } from "@/generated/prisma/enums";

export async function createManualTransaction(formData: FormData) {
  try {
    const valor = reqNum(formData, "valor");
    if (valor <= 0) throw new ActionError("O valor deve ser maior que zero.");
    const dataStr = str(formData, "data");
    const data = dataStr ? new Date(`${dataStr}T12:00:00`) : new Date();

    await prisma.financialTransaction.create({
      data: {
        tipo: reqStr(formData, "tipo") as TipoTransacao,
        descricao: reqStr(formData, "descricao"),
        categoria: reqStr(formData, "categoria"),
        valor,
        data,
      },
    });
  } catch (error) {
    redirect(`/financeiro?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/financeiro?ok=${encodeURIComponent("Lançamento registrado.")}`);
}

export async function deleteManualTransaction(id: number) {
  try {
    const transaction = await prisma.financialTransaction.findUniqueOrThrow({ where: { id } });
    if (transaction.paymentId) {
      throw new ActionError("Este lançamento veio de um pagamento de OS e não pode ser excluído aqui.");
    }
    await prisma.financialTransaction.delete({ where: { id } });
  } catch (error) {
    redirect(`/financeiro?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/financeiro?ok=${encodeURIComponent("Lançamento excluído.")}`);
}
