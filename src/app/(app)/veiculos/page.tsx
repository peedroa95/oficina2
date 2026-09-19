import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Plus, Car, Search } from "lucide-react";
import Link from "next/link";

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string }>;
}) {
  const { q, ok, erro } = await searchParams;

  const veiculos = await prisma.vehicle.findMany({
    where: q
      ? {
          OR: [
            { placa: { contains: q, mode: "insensitive" } },
            { marca: { contains: q, mode: "insensitive" } },
            { modelo: { contains: q, mode: "insensitive" } },
            { customer: { nome: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { placa: "asc" },
    include: { customer: true },
  });

  return (
    <div>
      <PageHeader
        title="Veículos"
        description="Cadastro de veículos vinculados aos clientes"
        actions={
          <LinkButton href="/veiculos/novo">
            <Plus className="h-4 w-4" /> Novo Veículo
          </LinkButton>
        }
      />

      <Banner ok={ok} erro={erro} />

      <form action="/veiculos" method="get" className="mb-4 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="Buscar por placa, marca, modelo ou cliente" className="pl-9" />
        </div>
      </form>

      <Card>
        {veiculos.length === 0 ? (
          <EmptyState icon={Car} title="Nenhum veículo encontrado" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Placa</th>
                  <th className="px-5 py-3">Veículo</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">KM</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/veiculos/${v.id}`} className="font-mono font-semibold text-blue-600 hover:underline">
                        {v.placa}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {v.marca} {v.modelo} {v.ano ? `· ${v.ano}` : ""}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <Link href={`/clientes/${v.customer.id}`} className="hover:underline">
                        {v.customer.nome}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{v.quilometragem ?? "-"}</td>
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
