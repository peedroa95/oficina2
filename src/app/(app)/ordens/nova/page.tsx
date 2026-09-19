import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { VehicleQuickSearch } from "@/components/forms/VehicleQuickSearch";
import { openServiceOrderForVehicle, createQuickOrder } from "@/actions/serviceOrders";
import { formatKm } from "@/lib/format";
import { UserPlus, Car, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

export default async function NovaOrdemPage({
  searchParams,
}: {
  searchParams: Promise<{ veiculoId?: string; novo?: string; erro?: string }>;
}) {
  const { veiculoId, novo, erro } = await searchParams;

  if (veiculoId) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(veiculoId) },
      include: { customer: true },
    });
    if (!vehicle) notFound();

    const action = openServiceOrderForVehicle.bind(null, vehicle.id);

    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="Nova Ordem de Serviço" description="Confirme o veículo para abrir a ordem" />
        <Banner erro={erro} />
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-lg font-semibold text-slate-900">{vehicle.placa}</p>
              <p className="text-sm text-slate-600">
                {vehicle.marca} {vehicle.modelo} {vehicle.ano ? `· ${vehicle.ano}` : ""}
              </p>
              <p className="text-sm text-slate-500">
                Cliente: {vehicle.customer.nome} {vehicle.customer.telefone ? `· ${vehicle.customer.telefone}` : ""}
              </p>
              {vehicle.quilometragem && <p className="text-xs text-slate-400">Última KM: {formatKm(vehicle.quilometragem)}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <LinkButton href="/ordens/nova" variant="secondary">
              Buscar outro veículo
            </LinkButton>
            <form action={action}>
              <Button type="submit">
                Abrir Ordem de Serviço <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  if (novo) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="Novo Cliente e Veículo" description="Cadastro rápido para abrir a ordem de serviço" />
        <Banner erro={erro} />
        <Card className="p-6">
          <form action={createQuickOrder} className="space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Cliente</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nome" name="clienteNome" required className="sm:col-span-2" />
                <Input label="Telefone" name="clienteTelefone" />
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Veículo</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Placa" name="placa" required className="uppercase" maxLength={8} />
                <Input label="Ano" name="ano" type="number" />
                <Input label="Marca" name="marca" required />
                <Input label="Modelo" name="modelo" required />
                <Input label="Quilometragem" name="quilometragem" type="number" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <LinkButton href="/ordens/nova" variant="secondary">
                Cancelar
              </LinkButton>
              <Button type="submit">
                Abrir Ordem de Serviço <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nova Ordem de Serviço" description="Localize o veículo do cliente para começar" />
      <Banner erro={erro} />
      <Card className="p-6">
        <VehicleQuickSearch />
        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="mb-3 text-sm text-slate-500">Cliente ou veículo ainda não cadastrado?</p>
          <LinkButton href="/ordens/nova?novo=1" variant="secondary">
            <UserPlus className="h-4 w-4" /> Cadastrar novo cliente e veículo
          </LinkButton>
        </div>
      </Card>
    </div>
  );
}
