"use server";

import { prisma } from "@/lib/prisma";
import { ActionError, errorMessage, int, num, reqNum, reqStr, str } from "@/lib/form";
import { recalcTotals, EDITABLE_STATUSES } from "@/lib/serviceOrder";
import { formatPlaca } from "@/lib/format";
import { redirect } from "next/navigation";
import type { FormaPagamento, StatusOrdemServico } from "@/generated/prisma/enums";

export async function openServiceOrderForVehicle(vehicleId: number) {
  const vehicle = await prisma.vehicle.findUniqueOrThrow({ where: { id: vehicleId } });
  const order = await prisma.serviceOrder.create({
    data: {
      customerId: vehicle.customerId,
      vehicleId: vehicle.id,
      quilometragem: vehicle.quilometragem ?? null,
    },
  });
  redirect(`/ordens/${order.id}`);
}

export async function createQuickOrder(formData: FormData) {
  let orderId: number;
  try {
    const clienteNome = reqStr(formData, "clienteNome");
    const clienteTelefone = str(formData, "clienteTelefone") ?? null;
    const placa = formatPlaca(reqStr(formData, "placa"));
    const marca = reqStr(formData, "marca");
    const modelo = reqStr(formData, "modelo");
    const ano = int(formData, "ano");
    const quilometragem = int(formData, "quilometragem");

    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: { nome: clienteNome, telefone: clienteTelefone },
      });
      const vehicle = await tx.vehicle.create({
        data: { customerId: customer.id, placa, marca, modelo, ano: ano ?? null, quilometragem: quilometragem ?? null },
      });
      return tx.serviceOrder.create({
        data: { customerId: customer.id, vehicleId: vehicle.id, quilometragem: quilometragem ?? null },
      });
    });
    orderId = order.id;
  } catch (error) {
    redirect(`/ordens/nova?novo=1&erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}`);
}

export async function updateServiceOrderInfo(id: number, formData: FormData) {
  try {
    const desconto = num(formData, "desconto") ?? 0;
    if (desconto < 0) throw new ActionError("O desconto não pode ser negativo.");

    await prisma.$transaction(async (tx) => {
      await tx.serviceOrder.update({
        where: { id },
        data: {
          quilometragem: int(formData, "quilometragem") ?? null,
          problemaInformado: str(formData, "problemaInformado") ?? null,
          observacoes: str(formData, "observacoes") ?? null,
          formaPagamento: reqStr(formData, "formaPagamento") as FormaPagamento,
          desconto,
        },
      });
      await recalcTotals(tx, id);
    });
  } catch (error) {
    redirect(`/ordens/${id}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${id}?ok=${encodeURIComponent("Ordem de serviço atualizada.")}`);
}

async function assertEditable(id: number) {
  const order = await prisma.serviceOrder.findUniqueOrThrow({ where: { id } });
  if (!EDITABLE_STATUSES.includes(order.status)) {
    throw new ActionError("Não é possível editar itens de uma ordem finalizada, entregue ou cancelada.");
  }
}

export async function addServiceLine(orderId: number, formData: FormData) {
  try {
    await assertEditable(orderId);
    const quantidade = reqNum(formData, "quantidade");
    const valorUnitario = reqNum(formData, "valorUnitario");
    const descricao = reqStr(formData, "descricao");
    const serviceIdRaw = str(formData, "serviceId");
    if (quantidade <= 0) throw new ActionError("A quantidade deve ser maior que zero.");
    if (valorUnitario < 0) throw new ActionError("O valor não pode ser negativo.");

    await prisma.$transaction(async (tx) => {
      await tx.serviceOrderService.create({
        data: {
          serviceOrderId: orderId,
          serviceId: serviceIdRaw ? Number(serviceIdRaw) : null,
          descricao,
          quantidade,
          valorUnitario,
          subtotal: quantidade * valorUnitario,
        },
      });
      await recalcTotals(tx, orderId);
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Serviço adicionado.")}`);
}

export async function removeServiceLine(orderId: number, lineId: number) {
  try {
    await assertEditable(orderId);
    await prisma.$transaction(async (tx) => {
      await tx.serviceOrderService.delete({ where: { id: lineId } });
      await recalcTotals(tx, orderId);
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Serviço removido.")}`);
}

export async function addProductLine(orderId: number, formData: FormData) {
  try {
    await assertEditable(orderId);
    const productId = Number(reqStr(formData, "productId"));
    const quantidade = reqNum(formData, "quantidade");
    const valorUnitario = reqNum(formData, "valorUnitario");
    if (quantidade <= 0) throw new ActionError("A quantidade deve ser maior que zero.");
    if (valorUnitario < 0) throw new ActionError("O valor não pode ser negativo.");

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({ where: { id: productId } });
      await tx.serviceOrderProduct.create({
        data: {
          serviceOrderId: orderId,
          productId,
          descricao: product.nome,
          quantidade,
          valorUnitario,
          subtotal: quantidade * valorUnitario,
        },
      });
      await recalcTotals(tx, orderId);
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Peça adicionada.")}`);
}

export async function removeProductLine(orderId: number, lineId: number) {
  try {
    await assertEditable(orderId);
    await prisma.$transaction(async (tx) => {
      await tx.serviceOrderProduct.delete({ where: { id: lineId } });
      await recalcTotals(tx, orderId);
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Peça removida.")}`);
}

export async function updateStatus(orderId: number, formData: FormData) {
  try {
    const status = reqStr(formData, "status") as StatusOrdemServico;

    await prisma.$transaction(async (tx) => {
      const order = await tx.serviceOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { pecas: true },
      });

      const isFinalizing = (status === "FINALIZADA" || status === "ENTREGUE") && !order.estoqueBaixado;

      if (isFinalizing) {
        for (const linha of order.pecas) {
          const product = await tx.product.findUniqueOrThrow({ where: { id: linha.productId } });
          const nova = product.quantidade - Number(linha.quantidade);
          if (nova < 0) {
            throw new ActionError(
              `Estoque insuficiente para "${product.nome}" (disponível: ${product.quantidade}, necessário: ${Number(linha.quantidade)}).`
            );
          }
          await tx.product.update({ where: { id: product.id }, data: { quantidade: nova } });
          await tx.stockMovement.create({
            data: {
              productId: product.id,
              tipo: "SAIDA",
              quantidade: Number(linha.quantidade),
              motivo: `Uso na OS ${String(orderId).padStart(4, "0")}`,
            },
          });
        }
      }

      await tx.serviceOrder.update({
        where: { id: orderId },
        data: {
          status,
          estoqueBaixado: order.estoqueBaixado || isFinalizing,
          finalizadaEm: order.finalizadaEm ?? (isFinalizing ? new Date() : undefined),
        },
      });
    });
  } catch (error) {
    redirect(`/ordens/${orderId}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/ordens/${orderId}?ok=${encodeURIComponent("Status atualizado.")}`);
}
