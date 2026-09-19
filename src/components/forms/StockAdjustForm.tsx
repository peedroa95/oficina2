import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { adjustStock } from "@/actions/products";

export function StockAdjustForm({ productId }: { productId: number }) {
  const action = adjustStock.bind(null, productId);

  return (
    <form action={action} className="space-y-3">
      <Select label="Tipo de movimento" name="tipo" defaultValue="ENTRADA">
        <option value="ENTRADA">Adicionar estoque</option>
        <option value="SAIDA">Retirar estoque</option>
      </Select>
      <Input label="Quantidade" name="quantidade" type="number" min="1" required defaultValue={1} />
      <Input label="Motivo (opcional)" name="motivo" placeholder="Ex: compra de fornecedor, ajuste de inventário" />
      <Button type="submit" className="w-full">
        Registrar movimentação
      </Button>
    </form>
  );
}
