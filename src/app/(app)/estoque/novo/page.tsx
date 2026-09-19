import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/forms/ProductForm";
import { createProduct } from "@/actions/products";

export default async function NovoProdutoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo Produto" description="Cadastrar uma peça ou produto no estoque" />
      <Banner erro={erro} />
      <Card className="p-5">
        <ProductForm action={createProduct} cancelHref="/estoque" />
      </Card>
    </div>
  );
}
