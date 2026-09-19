import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { StockAdjustForm } from "@/components/forms/StockAdjustForm";
import { deleteProduct } from "@/actions/products";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Boxes, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProdutoDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const productId = Number(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { movimentosEstoque: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!product) notFound();

  const baixo = product.quantidade <= product.estoqueMinimo;

  return (
    <div>
      <PageHeader
        title={product.nome}
        description={[product.codigo, product.marca].filter(Boolean).join(" · ") || "Produto"}
        actions={
          <>
            <LinkButton href={`/estoque/${product.id}/editar`} variant="secondary">
              <Pencil className="h-4 w-4" /> Editar
            </LinkButton>
            <ConfirmDeleteForm action={deleteProduct.bind(null, product.id)} />
          </>
        }
      />

      <Banner ok={ok} erro={erro} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Quantidade em estoque"
          value={String(product.quantidade)}
          tone={baixo ? "danger" : "success"}
          hint={baixo ? "Abaixo do estoque mínimo" : undefined}
        />
        <StatCard label="Preço de custo" value={formatCurrency(product.precoCusto)} />
        <StatCard label="Preço de venda" value={formatCurrency(product.precoVenda)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Movimentar estoque</h3>
          {baixo && (
            <Badge className="mb-3 border-red-200 bg-red-100 text-red-700">Estoque abaixo do mínimo ({product.estoqueMinimo})</Badge>
          )}
          <StockAdjustForm productId={product.id} />
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Últimas movimentações" />
            {product.movimentosEstoque.length === 0 ? (
              <EmptyState icon={Boxes} title="Nenhuma movimentação registrada" />
            ) : (
              <div className="divide-y divide-slate-100">
                {product.movimentosEstoque.map((m) => (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{m.motivo || (m.tipo === "ENTRADA" ? "Entrada de estoque" : "Saída de estoque")}</p>
                      <p className="text-slate-500">{formatDateTime(m.createdAt)}</p>
                    </div>
                    <span className={m.tipo === "ENTRADA" ? "font-medium text-emerald-600" : "font-medium text-red-600"}>
                      {m.tipo === "ENTRADA" ? "+" : "-"}
                      {m.quantidade}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
