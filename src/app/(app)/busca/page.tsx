import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatOS } from "@/lib/format";
import { STATUS_OS_BADGE, STATUS_OS_LABELS } from "@/lib/constants";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return (
      <div>
        <PageHeader title="Buscar" />
        <Card>
          <EmptyState icon={SearchX} title="Digite algo na busca para começar" />
        </Card>
      </div>
    );
  }

  const qNumber = !Number.isNaN(Number(query)) ? Number(query) : undefined;

  const [clientes, veiculos, ordens] = await Promise.all([
    prisma.customer.findMany({
      where: {
        OR: [
          { nome: { contains: query, mode: "insensitive" } },
          { telefone: { contains: query, mode: "insensitive" } },
          { whatsapp: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.vehicle.findMany({
      where: {
        OR: [
          { placa: { contains: query, mode: "insensitive" } },
          { marca: { contains: query, mode: "insensitive" } },
          { modelo: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { customer: true },
      take: 10,
    }),
    prisma.serviceOrder.findMany({
      where: qNumber !== undefined ? { id: qNumber } : { id: -1 },
      include: { customer: true, vehicle: true },
      take: 5,
    }),
  ]);

  const total = clientes.length + veiculos.length + ordens.length;

  return (
    <div>
      <PageHeader title={`Resultados para "${query}"`} description={`${total} resultado(s) encontrado(s)`} />

      {total === 0 ? (
        <Card>
          <EmptyState icon={SearchX} title="Nada encontrado" description="Tente buscar por outro termo, placa ou nome." />
        </Card>
      ) : (
        <div className="space-y-6">
          {ordens.length > 0 && (
            <Card>
              <CardHeader title="Ordens de Serviço" />
              <div className="divide-y divide-slate-100">
                {ordens.map((os) => (
                  <Link key={os.id} href={`/ordens/${os.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-blue-600">{formatOS(os.id)}</p>
                      <p className="text-slate-500">
                        {os.customer.nome} · {os.vehicle.placa}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-900">{formatCurrency(os.valorTotal)}</span>
                      <Badge className={STATUS_OS_BADGE[os.status]}>{STATUS_OS_LABELS[os.status]}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {veiculos.length > 0 && (
            <Card>
              <CardHeader title="Veículos" />
              <div className="divide-y divide-slate-100">
                {veiculos.map((v) => (
                  <Link key={v.id} href={`/veiculos/${v.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50">
                    <div>
                      <p className="font-mono font-medium text-blue-600">{v.placa}</p>
                      <p className="text-slate-500">
                        {v.marca} {v.modelo}
                      </p>
                    </div>
                    <span className="text-slate-500">{v.customer.nome}</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {clientes.length > 0 && (
            <Card>
              <CardHeader title="Clientes" />
              <div className="divide-y divide-slate-100">
                {clientes.map((c) => (
                  <Link key={c.id} href={`/clientes/${c.id}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50">
                    <span className="font-medium text-blue-600">{c.nome}</span>
                    <span className="text-slate-500">{c.telefone}</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
