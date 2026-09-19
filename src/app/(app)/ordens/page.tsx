import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Field";
import { formatCurrency, formatDate, formatOS } from "@/lib/format";
import { STATUS_OS_BADGE, STATUS_OS_LABELS, STATUS_PAGAMENTO_BADGE, STATUS_PAGAMENTO_LABELS, statusPagamento } from "@/lib/constants";
import { Plus, ClipboardList, Search } from "lucide-react";
import Link from "next/link";
import type { StatusOrdemServico } from "@/generated/prisma/enums";

export default async function OrdensPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; ok?: string; erro?: string }>;
}) {
  const { q, status, ok, erro } = await searchParams;

  const qNumber = q && !Number.isNaN(Number(q)) ? Number(q) : undefined;

  const ordens = await prisma.serviceOrder.findMany({
    where: {
      status: status ? (status as StatusOrdemServico) : undefined,
      OR: q
        ? [
            { vehicle: { placa: { contains: q, mode: "insensitive" } } },
            { customer: { nome: { contains: q, mode: "insensitive" } } },
            ...(qNumber !== undefined ? [{ id: qNumber }] : []),
          ]
        : undefined,
    },
    orderBy: { data: "desc" },
    include: { customer: true, vehicle: true },
    take: 200,
  });

  return (
    <div>
      <PageHeader
        title="Ordens de Serviço"
        description="Todas as ordens de serviço da oficina"
        actions={
          <LinkButton href="/ordens/nova">
            <Plus className="h-4 w-4" /> Nova Ordem de Serviço
          </LinkButton>
        }
      />

      <Banner ok={ok} erro={erro} />

      <form action="/ordens" method="get" className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="Buscar por placa, cliente ou nº da OS" className="pl-9" />
        </div>
        <Select name="status" defaultValue={status ?? ""} className="max-w-[220px]">
          <option value="">Todos os status</option>
          {Object.entries(STATUS_OS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </form>

      <Card>
        {ordens.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Nenhuma ordem de serviço encontrada" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">OS</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Veículo</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Pagamento</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {ordens.map((os) => (
                  <tr key={os.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/ordens/${os.id}`} className="font-medium text-blue-600 hover:underline">
                        {formatOS(os.id)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{formatDate(os.data)}</td>
                    <td className="px-5 py-3 text-slate-600">{os.customer.nome}</td>
                    <td className="px-5 py-3 font-mono text-slate-600">{os.vehicle.placa}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{formatCurrency(os.valorTotal)}</td>
                    <td className="px-5 py-3">
                      {(() => {
                        const sp = statusPagamento(Number(os.valorTotal), Number(os.valorPago));
                        return <Badge className={STATUS_PAGAMENTO_BADGE[sp]}>{STATUS_PAGAMENTO_LABELS[sp]}</Badge>;
                      })()}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={STATUS_OS_BADGE[os.status]}>{STATUS_OS_LABELS[os.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
