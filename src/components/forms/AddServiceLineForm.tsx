"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface ServiceOption {
  id: number;
  nome: string;
  valorPadrao: number;
}

export function AddServiceLineForm({
  action,
  services,
}: {
  action: (formData: FormData) => void;
  services: ServiceOption[];
}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("0");

  function onSelectService(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    const service = services.find((s) => String(s.id) === id);
    if (service) {
      setDescricao(service.nome);
      setValor(String(service.valorPadrao));
    }
  }

  return (
    <form action={action} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
      <Select name="serviceId" label="Serviço do catálogo" onChange={onSelectService} defaultValue="" className="col-span-2 sm:col-span-2">
        <option value="">Personalizado...</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nome}
          </option>
        ))}
      </Select>
      <Input
        label="Descrição"
        name="descricao"
        required
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="col-span-2 sm:col-span-2"
      />
      <Input label="Qtd" name="quantidade" type="number" step="0.5" min="0" defaultValue={1} className="col-span-1" />
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
      <div className="col-span-2 flex items-end sm:col-span-6">
        <Button type="submit" size="sm" variant="secondary">
          <Plus className="h-4 w-4" /> Adicionar serviço
        </Button>
      </div>
    </form>
  );
}
