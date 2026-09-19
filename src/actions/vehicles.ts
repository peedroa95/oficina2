"use server";

import { prisma } from "@/lib/prisma";
import { errorMessage, int, reqStr, str } from "@/lib/form";
import { formatPlaca } from "@/lib/format";
import { redirect } from "next/navigation";

function vehicleData(fd: FormData) {
  return {
    customerId: Number(reqStr(fd, "customerId")),
    placa: formatPlaca(reqStr(fd, "placa")),
    marca: reqStr(fd, "marca"),
    modelo: reqStr(fd, "modelo"),
    ano: int(fd, "ano") ?? null,
    cor: str(fd, "cor") ?? null,
    quilometragem: int(fd, "quilometragem") ?? null,
    observacoes: str(fd, "observacoes") ?? null,
  };
}

export async function createVehicle(formData: FormData) {
  let id: number;
  try {
    const created = await prisma.vehicle.create({ data: vehicleData(formData) });
    id = created.id;
  } catch (error) {
    const params = new URLSearchParams({ erro: errorMessage(error) });
    const clienteId = str(formData, "customerId");
    if (clienteId) params.set("clienteId", clienteId);
    redirect(`/veiculos/novo?${params.toString()}`);
  }
  redirect(`/veiculos/${id}?ok=${encodeURIComponent("Veículo cadastrado com sucesso.")}`);
}

export async function updateVehicle(id: number, formData: FormData) {
  try {
    await prisma.vehicle.update({ where: { id }, data: vehicleData(formData) });
  } catch (error) {
    redirect(`/veiculos/${id}/editar?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/veiculos/${id}?ok=${encodeURIComponent("Dados do veículo atualizados.")}`);
}

export async function deleteVehicle(id: number) {
  try {
    await prisma.vehicle.delete({ where: { id } });
  } catch (error) {
    redirect(`/veiculos/${id}?erro=${encodeURIComponent(errorMessage(error))}`);
  }
  redirect(`/veiculos?ok=${encodeURIComponent("Veículo excluído.")}`);
}

export async function quickCreateVehicle(input: {
  customerId: number;
  placa: string;
  marca: string;
  modelo: string;
  ano?: number;
  quilometragem?: number;
}) {
  return prisma.vehicle.create({
    data: {
      customerId: input.customerId,
      placa: formatPlaca(input.placa),
      marca: input.marca,
      modelo: input.modelo,
      ano: input.ano ?? null,
      quilometragem: input.quilometragem ?? null,
    },
  });
}
