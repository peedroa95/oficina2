import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { VehicleForm } from "@/components/forms/VehicleForm";
import { createVehicle } from "@/actions/vehicles";

export default async function NovoVeiculoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; clienteId?: string }>;
}) {
  const { erro, clienteId } = await searchParams;
  const customers = await prisma.customer.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo Veículo" description="Cadastrar um novo veículo" />
      <Banner erro={erro} />
      <Card className="p-5">
        <VehicleForm
          action={createVehicle}
          customers={customers}
          defaultCustomerId={clienteId ? Number(clienteId) : undefined}
          cancelHref="/veiculos"
        />
      </Card>
    </div>
  );
}
