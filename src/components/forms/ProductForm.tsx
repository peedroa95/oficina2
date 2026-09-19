import { Input } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import type { Product } from "@/generated/prisma/client";

export function ProductForm({
  action,
  product,
  cancelHref,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  cancelHref: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" name="nome" required defaultValue={product?.nome} className="sm:col-span-2" />
        <Input label="Código" name="codigo" defaultValue={product?.codigo ?? ""} />
        <Input label="Marca" name="marca" defaultValue={product?.marca ?? ""} />
        {!product && (
          <Input label="Quantidade inicial" name="quantidade" type="number" min="0" defaultValue={0} />
        )}
        <Input
          label="Estoque mínimo"
          name="estoqueMinimo"
          type="number"
          min="0"
          defaultValue={product?.estoqueMinimo ?? 0}
        />
        <Input
          label="Preço de custo (R$)"
          name="precoCusto"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? Number(product.precoCusto) : 0}
        />
        <Input
          label="Preço de venda (R$)"
          name="precoVenda"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? Number(product.precoVenda) : 0}
        />
      </div>
      {product && (
        <p className="text-xs text-slate-500">
          Para ajustar a quantidade em estoque, use as ações &quot;Adicionar&quot; ou &quot;Retirar&quot; na página do produto.
        </p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <LinkButton href={cancelHref} variant="secondary">
          Cancelar
        </LinkButton>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
