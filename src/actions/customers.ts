"use server";

import { prisma } from "@/lib/prisma";
import { errorMessage, reqStr, str } from "@/lib/form";
import { redirect } from "next/navigation";

function customerData(fd: FormData) {
  return {
    nome: reqStr(fd, "nome"),
    cpfCnpj: str(fd, "cpfCnpj") ?? null,
    telefone: str(fd, "telefone") ?? null,
    whatsapp: str(fd, "whatsapp") ?? null,
    endereco: str(fd, "endereco") ?? null,
    observacoes: str(fd, "observacoes") ?? null,
  };
}

export async function createCustomer(formData: FormData) {
  let id: number;
  try {
    const created = await prisma.customer.create({ data: customerData(formData) });
    id = created.id;
  } catch (error) {
    redirect(`/clientes/novo?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/clientes/${id}?ok=${encodeURIComponent("Cliente cadastrado com sucesso.")}`);
}

export async function updateCustomer(id: number, formData: FormData) {
  try {
    await prisma.customer.update({ where: { id }, data: customerData(formData) });
  } catch (error) {
    redirect(`/clientes/${id}/editar?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/clientes/${id}?ok=${encodeURIComponent("Dados do cliente atualizados.")}`);
}

export async function deleteCustomer(id: number) {
  try {
    await prisma.customer.delete({ where: { id } });
  } catch (error) {
    redirect(`/clientes/${id}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/clientes?ok=${encodeURIComponent("Cliente excluído.")}`);
}

export async function quickCreateCustomer(nome: string, telefone?: string) {
  return prisma.customer.create({ data: { nome, telefone: telefone || null } });
}
