import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/forms/ProductForm";
import { updateProduct } from "@/actions/products";
import { notFound } from "next/navigation";

export default async function EditarProdutoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const action = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar Produto" description={product.nome} />
      <Banner erro={erro} />
      <Card className="p-5">
        <ProductForm action={action} product={product} cancelHref={`/estoque/${product.id}`} />
      </Card>
    </div>
  );
}
