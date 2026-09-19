import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Field";
import { formatCurrency } from "@/lib/format";
import { Plus, Boxes, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; erro?: string }>;
}) {
  const { q, ok, erro } = await searchParams;

  const produtos = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { nome: { contains: q, mode: "insensitive" } },
            { codigo: { contains: q, mode: "insensitive" } },
            { marca: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { nome: "asc" },
  });

  const baixos = produtos.filter((p) => p.quantidade <= p.estoqueMinimo);

  return (
    <div>
      <PageHeader
        title="Estoque"
        description="Peças e produtos utilizados nas ordens de serviço"
        actions={
          <LinkButton href="/estoque/novo">
            <Plus className="h-4 w-4" /> Novo Produto
          </LinkButton>
        }
      />

      <Banner ok={ok} erro={erro} />

      {baixos.length > 0 && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {baixos.length} produto(s) com estoque baixo: {baixos.map((p) => p.nome).join(", ")}
          </span>
        </div>
      )}

      <form action="/estoque" method="get" className="mb-4 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="Buscar por nome, código ou marca" className="pl-9" />
        </div>
      </form>

      <Card>
        {produtos.length === 0 ? (
          <EmptyState icon={Boxes} title="Nenhum produto cadastrado" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Produto</th>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Quantidade</th>
                  <th className="px-5 py-3">Preço de venda</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => {
                  const baixo = p.quantidade <= p.estoqueMinimo;
                  return (
                    <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <Link href={`/estoque/${p.id}`} className="font-medium text-blue-600 hover:underline">
                          {p.nome}
                        </Link>
                        {p.marca && <p className="text-xs text-slate-500">{p.marca}</p>}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{p.codigo ?? "-"}</td>
                      <td className={cn("px-5 py-3 font-medium", baixo ? "text-red-600" : "text-slate-900")}>
                        {p.quantidade}
                      </td>
                      <td className="px-5 py-3 text-slate-900">{formatCurrency(p.precoVenda)}</td>
                      <td className="px-5 py-3">
                        {baixo ? (
                          <Badge className="border-red-200 bg-red-100 text-red-700">Estoque baixo</Badge>
                        ) : (
                          <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700">OK</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
