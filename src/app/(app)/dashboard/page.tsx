import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { formatCurrency, formatOS } from "@/lib/format";
import { STATUS_OS_BADGE, STATUS_OS_LABELS } from "@/lib/constants";
import { startOfMonth, startOfNextMonth, startOfToday, startOfTomorrow } from "@/lib/dates";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const hoje = { gte: startOfToday(), lt: startOfTomorrow() };
  const mes = { gte: startOfMonth(), lt: startOfNextMonth() };

  const [
    servicosHoje,
    ordensAbertas,
    ordensFinalizadas,
    faturamentoDia,
    faturamentoMes,
    ordensPendentes,
    produtosAtivos,
    ultimasOrdens,
  ] = await Promise.all([
    prisma.serviceOrder.count({ where: { finalizadaEm: hoje } }),
    prisma.serviceOrder.count({ where: { status: { in: ["ABERTA", "EM_ANDAMENTO"] } } }),
    prisma.serviceOrder.count({ where: { status: { in: ["FINALIZADA", "ENTREGUE"] } } }),
    prisma.financialTransaction.aggregate({ where: { tipo: "ENTRADA", data: hoje }, _sum: { valor: true } }),
    prisma.financialTransaction.aggregate({ where: { tipo: "ENTRADA", data: mes }, _sum: { valor: true } }),
    prisma.serviceOrder.findMany({
      where: { status: { not: "CANCELADA" } },
      select: { valorTotal: true, valorPago: true },
    }),
    prisma.product.findMany({ where: { ativo: true }, select: { quantidade: true, estoqueMinimo: true } }),
    prisma.serviceOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, vehicle: true },
    }),
  ]);

  const valoresPendentes = ordensPendentes.reduce((acc, os) => {
    const restante = Number(os.valorTotal) - Number(os.valorPago);
    return acc + (restante > 0 ? restante : 0);
  }, 0);

  const produtosBaixoEstoque = produtosAtivos.filter((p) => p.quantidade <= p.estoqueMinimo).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da oficina"
        actions={
          <LinkButton href="/ordens/nova">
            <Plus className="h-4 w-4" /> Nova Ordem de Serviço
          </LinkButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Serviços realizados hoje" value={String(servicosHoje)} />
        <StatCard label="Ordens de serviço abertas" value={String(ordensAbertas)} />
        <StatCard label="Ordens finalizadas" value={String(ordensFinalizadas)} tone="success" />
        <StatCard
          label="Produtos com estoque baixo"
          value={String(produtosBaixoEstoque)}
          tone={produtosBaixoEstoque > 0 ? "warning" : "default"}
        />
        <StatCard label="Faturamento do dia" value={formatCurrency(faturamentoDia._sum.valor ?? 0)} tone="success" />
        <StatCard label="Faturamento do mês" value={formatCurrency(faturamentoMes._sum.valor ?? 0)} tone="success" />
        <StatCard
          label="Valores pendentes"
          value={formatCurrency(valoresPendentes)}
          tone={valoresPendentes > 0 ? "danger" : "default"}
        />
      </div>

      <Card>
        <CardHeader title="Últimas ordens de serviço" actions={<Link href="/ordens" className="text-sm font-medium text-blue-600 hover:underline">Ver todas</Link>} />
        {ultimasOrdens.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma ordem de serviço ainda"
            description="Abra a primeira ordem de serviço para começar."
            action={
              <LinkButton href="/ordens/nova" size="sm">
                <Plus className="h-4 w-4" /> Nova Ordem de Serviço
              </LinkButton>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">OS</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Veículo</th>
                  <th className="px-5 py-3">Placa</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimasOrdens.map((os) => (
                  <tr key={os.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/ordens/${os.id}`} className="font-medium text-blue-600 hover:underline">
                        {formatOS(os.id)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{os.customer.nome}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {os.vehicle.marca} {os.vehicle.modelo}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600">{os.vehicle.placa}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{formatCurrency(os.valorTotal)}</td>
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
