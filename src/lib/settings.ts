import { prisma } from "@/lib/prisma";

export async function getWorkshopSettings() {
  const existing = await prisma.workshopSettings.findFirst();
  if (existing) return existing;
  return prisma.workshopSettings.create({ data: { nome: "Minha Oficina" } });
}
