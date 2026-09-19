import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { deleteCustomer } from "@/actions/customers";
import { formatCurrency, formatDate, formatOS } from "@/lib/format";
import { STATUS_OS_BADGE, STATUS_OS_LABELS } from "@/lib/constants";
import { Car, ClipboardList, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClienteDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const customerId = Number(id);

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      vehicles: { orderBy: { placa: "asc" } },
      serviceOrders: { orderBy: { data: "desc" }, include: { vehicle: true } },
    },
  });

  if (!customer) notFound();

  return (
    <div>
      <PageHeader
        title={customer.nome}
        description={[customer.cpfCnpj, customer.telefone].filter(Boolean).join(" · ") || "Cliente"}
        actions={
          <>
            <LinkButton href={`/clientes/${customer.id}/editar`} variant="secondary">
              <Pencil className="h-4 w-4" /> Editar
            </LinkButton>
            <ConfirmDeleteForm action={deleteCustomer.bind(null, customer.id)} />
          </>
        }
      />

      <Banner ok={ok} erro={erro} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Dados do cliente</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">CPF/CNPJ</dt>
              <dd className="text-right text-slate-900">{customer.cpfCnpj ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Telefone</dt>
              <dd className="text-right text-slate-900">{customer.telefone ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">WhatsApp</dt>
              <dd className="text-right text-slate-900">{customer.whatsapp ?? "-"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Endereço</dt>
              <dd className="text-right text-slate-900">{customer.endereco ?? "-"}</dd>
            </div>
            {customer.observacoes && (
              <div className="pt-2">
                <dt className="mb-1 text-slate-500">Observações</dt>
                <dd className="text-slate-900">{customer.observacoes}</dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Veículos"
              actions={
                <LinkButton href={`/veiculos/novo?clienteId=${customer.id}`} size="sm" variant="secondary">
                  <Plus className="h-4 w-4" /> Novo Veículo
                </LinkButton>
              }
            />
            {customer.vehicles.length === 0 ? (
              <EmptyState icon={Car} title="Nenhum veículo cadastrado" />
            ) : (
              <div className="divide-y divide-slate-100">
                {customer.vehicles.map((v) => (
                  <Link
                    key={v.id}
                    href={`/veiculos/${v.id}`}
                    className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-blue-600">{v.placa}</p>
                      <p className="text-slate-500">
                        {v.marca} {v.modelo} {v.ano ? `· ${v.ano}` : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Ordens de Serviço anteriores" />
            {customer.serviceOrders.length === 0 ? (
              <EmptyState icon={ClipboardList} title="Nenhuma ordem de serviço" />
            ) : (
              <div className="divide-y divide-slate-100">
                {customer.serviceOrders.map((os) => (
                  <Link
                    key={os.id}
                    href={`/ordens/${os.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-blue-600">{formatOS(os.id)}</p>
                      <p className="text-slate-500">
                        {os.vehicle.placa} · {formatDate(os.data)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">{formatCurrency(os.valorTotal)}</span>
                      <Badge className={STATUS_OS_BADGE[os.status]}>{STATUS_OS_LABELS[os.status]}</Badge>
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
