"use server";

import { prisma } from "@/lib/prisma";
import { errorMessage, reqStr, str } from "@/lib/form";
import { getWorkshopSettings } from "@/lib/settings";
import { redirect } from "next/navigation";

export async function updateWorkshopSettings(formData: FormData) {
  try {
    const current = await getWorkshopSettings();
    await prisma.workshopSettings.update({
      where: { id: current.id },
      data: {
        nome: reqStr(formData, "nome"),
        cpfCnpj: str(formData, "cpfCnpj") ?? null,
        telefone: str(formData, "telefone") ?? null,
        whatsapp: str(formData, "whatsapp") ?? null,
        endereco: str(formData, "endereco") ?? null,
        cidade: str(formData, "cidade") ?? null,
        estado: str(formData, "estado") ?? null,
      },
    });
  } catch (error) {
    redirect(`/configuracoes?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/configuracoes?ok=${encodeURIComponent("Dados da oficina atualizados.")}`);
}
