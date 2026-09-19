import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { VehicleForm } from "@/components/forms/VehicleForm";
import { updateVehicle } from "@/actions/vehicles";
import { notFound } from "next/navigation";

export default async function EditarVeiculoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const [vehicle, customers] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: Number(id) } }),
    prisma.customer.findMany({ orderBy: { nome: "asc" } }),
  ]);
  if (!vehicle) notFound();

  const action = updateVehicle.bind(null, vehicle.id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar Veículo" description={vehicle.placa} />
      <Banner erro={erro} />
      <Card className="p-5">
        <VehicleForm action={action} vehicle={vehicle} customers={customers} cancelHref={`/veiculos/${vehicle.id}`} />
      </Card>
    </div>
  );
}
