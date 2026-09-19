"use server";

import { prisma } from "@/lib/prisma";
import { ActionError, errorMessage, int, num, reqStr, str } from "@/lib/form";
import { redirect } from "next/navigation";

function productData(fd: FormData) {
  const precoCusto = num(fd, "precoCusto") ?? 0;
  const precoVenda = num(fd, "precoVenda") ?? 0;
  const quantidade = int(fd, "quantidade") ?? 0;
  const estoqueMinimo = int(fd, "estoqueMinimo") ?? 0;
  if (precoCusto < 0 || precoVenda < 0) throw new ActionError("Os preços não podem ser negativos.");
  if (quantidade < 0 || estoqueMinimo < 0) throw new ActionError("As quantidades não podem ser negativas.");
  return {
    nome: reqStr(fd, "nome"),
    codigo: str(fd, "codigo") ?? null,
    marca: str(fd, "marca") ?? null,
    quantidade,
    estoqueMinimo,
    precoCusto,
    precoVenda,
  };
}

export async function createProduct(formData: FormData) {
  try {
    await prisma.product.create({ data: productData(formData) });
  } catch (error) {
    redirect(`/estoque/novo?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/estoque?ok=${encodeURIComponent("Produto cadastrado com sucesso.")}`);
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const data = productData(formData);
    await prisma.product.update({
      where: { id },
      data: {
        nome: data.nome,
        codigo: data.codigo,
        marca: data.marca,
        estoqueMinimo: data.estoqueMinimo,
        precoCusto: data.precoCusto,
        precoVenda: data.precoVenda,
      },
    });
  } catch (error) {
    redirect(`/estoque/${id}/editar?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/estoque/${id}?ok=${encodeURIComponent("Produto atualizado.")}`);
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    redirect(`/estoque/${id}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/estoque?ok=${encodeURIComponent("Produto excluído.")}`);
}

export async function adjustStock(id: number, formData: FormData) {
  const tipo = reqStr(formData, "tipo");
  const quantidade = int(formData, "quantidade") ?? 0;
  const motivo = str(formData, "motivo") ?? null;

  if (quantidade <= 0) {
    redirect(`/estoque/${id}?erro=${encodeURIComponent("Informe uma quantidade maior que zero.")}`);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({ where: { id } });
      const novaQuantidade = tipo === "SAIDA" ? product.quantidade - quantidade : product.quantidade + quantidade;
      if (novaQuantidade < 0) {
        throw new ActionError("Estoque insuficiente para essa retirada.");
      }
      await tx.product.update({ where: { id }, data: { quantidade: novaQuantidade } });
      await tx.stockMovement.create({
        data: { productId: id, tipo, quantidade, motivo },
      });
    });
  } catch (error) {
    redirect(`/estoque/${id}?erro=${encodeURIComponent(errorMessage(error))}`);
  }

  redirect(`/estoque/${id}?ok=${encodeURIComponent("Estoque atualizado.")}`);
}
