import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Plus, Users, Search } from "lucide-react";
import Link from "next/link";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string }>;
}) {
  const { q, ok, erro } = await searchParams;

  const clientes = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { nome: { contains: q, mode: "insensitive" } },
            { telefone: { contains: q, mode: "insensitive" } },
            { whatsapp: { contains: q, mode: "insensitive" } },
            { cpfCnpj: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { nome: "asc" },
    include: { _count: { select: { vehicles: true, serviceOrders: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Cadastro de clientes da oficina"
        actions={
          <LinkButton href="/clientes/novo">
            <Plus className="h-4 w-4" /> Novo Cliente
          </LinkButton>
        }
      />

      <Banner ok={ok} erro={erro} />

      <form action="/clientes" method="get" className="mb-4 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="Buscar por nome, telefone ou CPF/CNPJ" className="pl-9" />
        </div>
      </form>

      <Card>
        {clientes.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum cliente encontrado"
            description={q ? "Tente buscar por outro termo." : "Cadastre o primeiro cliente da oficina."}
            action={
              !q && (
                <LinkButton href="/clientes/novo" size="sm">
                  <Plus className="h-4 w-4" /> Novo Cliente
                </LinkButton>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">Telefone</th>
                  <th className="px-5 py-3">CPF/CNPJ</th>
                  <th className="px-5 py-3">Veículos</th>
                  <th className="px-5 py-3">Ordens de Serviço</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link href={`/clientes/${cliente.id}`} className="font-medium text-blue-600 hover:underline">
                        {cliente.nome}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{cliente.telefone ?? "-"}</td>
                    <td className="px-5 py-3 text-slate-600">{cliente.cpfCnpj ?? "-"}</td>
                    <td className="px-5 py-3 text-slate-600">{cliente._count.vehicles}</td>
                    <td className="px-5 py-3 text-slate-600">{cliente._count.serviceOrders}</td>
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
