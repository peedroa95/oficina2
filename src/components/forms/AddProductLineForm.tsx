"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface ProductOption {
  id: number;
  nome: string;
  precoVenda: number;
  quantidade: number;
}

export function AddProductLineForm({
  action,
  products,
}: {
  action: (formData: FormData) => void;
  products: ProductOption[];
}) {
  const [valor, setValor] = useState("0");
  const [selected, setSelected] = useState<ProductOption | null>(null);

  function onSelectProduct(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    const product = products.find((p) => String(p.id) === id) ?? null;
    setSelected(product);
    if (product) setValor(String(product.precoVenda));
  }

  return (
    <form action={action} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
      <Select name="productId" label="Peça / produto" required onChange={onSelectProduct} defaultValue="" className="col-span-2 sm:col-span-3">
        <option value="" disabled>
          Selecione o produto
        </option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome} (estoque: {p.quantidade})
          </option>
        ))}
      </Select>
      <Input label="Qtd" name="quantidade" type="number" step="1" min="1" defaultValue={1} className="col-span-1" />
      <Input
        label="Valor unit. (R$)"
        name="valorUnitario"
        type="number"
        step="0.01"
        min="0"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="col-span-1"
      />
      <div className="col-span-2 flex items-end sm:col-span-2">
        <Button type="submit" size="sm" variant="secondary">
          <Plus className="h-4 w-4" /> Adicionar peça
        </Button>
      </div>
      {selected && selected.quantidade <= 0 && (
        <p className="col-span-2 text-xs text-red-600 sm:col-span-6">
          Atenção: este produto está sem estoque disponível no momento.
        </p>
      )}
    </form>
  );
}
