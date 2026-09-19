import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json([]);

  const veiculos = await prisma.vehicle.findMany({
    where: {
      OR: [
        { placa: { contains: q, mode: "insensitive" } },
        { marca: { contains: q, mode: "insensitive" } },
        { modelo: { contains: q, mode: "insensitive" } },
        { customer: { nome: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 8,
    orderBy: { placa: "asc" },
    include: { customer: true },
  });

  return NextResponse.json(
    veiculos.map((v) => ({
      id: v.id,
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      ano: v.ano,
      customer: { id: v.customer.id, nome: v.customer.nome },
    }))
  );
}
