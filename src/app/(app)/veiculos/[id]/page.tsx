import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { deleteVehicle } from "@/actions/vehicles";
import { formatCurrency, formatDate, formatKm, formatOS } from "@/lib/format";
import { STATUS_OS_BADGE, STATUS_OS_LABELS } from "@/lib/constants";
import { ClipboardList, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VeiculoDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const vehicleId = Number(id);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      customer: true,
      serviceOrders: {
        orderBy: { data: "desc" },
        include: { servicos: true },
      },
    },
  });

  if (!vehicle) notFound();

  return (
    <div>
      <PageHeader
        title={vehicle.placa}
        description={`${vehicle.marca} ${vehicle.modelo}${vehicle.ano ? ` · ${vehicle.ano}` : ""}`}
        actions={
          <>
            <LinkButton href={`/ordens/nova?veiculoId=${vehicle.id}`} variant="secondary">
              <Plus className="h-4 w-4" /> Nova OS
            </LinkButton>
            <LinkButton href={`/veiculos/${vehicle.id}/editar`} variant="secondary">
              <Pencil className="h-4 w-4" /> Editar
            </LinkButton>
            <ConfirmDeleteForm action={deleteVehicle.bind(null, vehicle.id)} />
          </>
        }
      />

      <Banner ok={ok} erro={erro} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Dados do veículo</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Cliente</dt>
              <dd className="text-right">
                <Link href={`/clientes/${vehicle.customer.id}`} className="text-blue-600 hover:underline">
                  {vehicle.customer.nome}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Cor</dt>
              <dd className="text-right text-slate-900">{vehicle.cor ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Quilometragem</dt>
              <dd className="text-right text-slate-900">{formatKm(vehicle.quilometragem)}</dd>
            </div>
            {vehicle.observacoes && (
              <div className="pt-2">
                <dt className="mb-1 text-slate-500">Observações</dt>
                <dd className="text-slate-900">{vehicle.observacoes}</dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Histórico de serviços" />
            {vehicle.serviceOrders.length === 0 ? (
              <EmptyState icon={ClipboardList} title="Nenhum serviço registrado para este veículo" />
            ) : (
              <div className="divide-y divide-slate-100">
                {vehicle.serviceOrders.map((os) => (
                  <Link
                    key={os.id}
                    href={`/ordens/${os.id}`}
                    className="block px-5 py-3 text-sm hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-blue-600">
                          {formatDate(os.data)} · {formatOS(os.id)}
                        </p>
                        <p className="text-slate-500">
                          {os.servicos.map((s) => s.descricao).join(", ") || "Sem serviços registrados"}
                        </p>
                        {os.quilometragem && <p className="text-xs text-slate-400">KM: {formatKm(os.quilometragem)}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-900">{formatCurrency(os.valorTotal)}</span>
                        <Badge className={STATUS_OS_BADGE[os.status]}>{STATUS_OS_LABELS[os.status]}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
