"use server";

import { prisma } from "@/lib/prisma";
import { errorMessage, num, reqStr, str } from "@/lib/form";
import { ActionError } from "@/lib/form";
import { redirect } from "next/navigation";

function serviceData(fd: FormData) {
  const valorPadrao = num(fd, "valorPadrao") ?? 0;
  if (valorPadrao < 0) throw new ActionError("O valor padrão não pode ser negativo.");
  return {
    nome: reqStr(fd, "nome"),
    descricao: str(fd, "descricao") ?? null,
    valorPadrao,
  };
}

export async function createService(formData: FormData) {
  try {
    await prisma.service.create({ data: serviceData(formData) });
  } catch (error) {
    redirect(`/servicos/novo?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/servicos?ok=${encodeURIComponent("Serviço cadastrado com sucesso.")}`);
}

export async function updateService(id: number, formData: FormData) {
  try {
    await prisma.service.update({ where: { id }, data: serviceData(formData) });
  } catch (error) {
    redirect(`/servicos/${id}/editar?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/servicos?ok=${encodeURIComponent("Serviço atualizado.")}`);
}

export async function deleteService(id: number) {
  try {
    await prisma.service.delete({ where: { id } });
  } catch (error) {
    redirect(`/servicos?erro=${encodeURIComponent(errorMessage(error))}`);
    return;
  }
  redirect(`/servicos?ok=${encodeURIComponent("Serviço excluído.")}`);
}

export async function toggleServiceAtivo(id: number, ativo: boolean) {
  await prisma.service.update({ where: { id }, data: { ativo } });
  redirect(`/servicos?ok=${encodeURIComponent(ativo ? "Serviço ativado." : "Serviço desativado.")}`);
}
