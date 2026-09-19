import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import type { Customer, Vehicle } from "@/generated/prisma/client";

export function VehicleForm({
  action,
  vehicle,
  customers,
  defaultCustomerId,
  cancelHref,
}: {
  action: (formData: FormData) => void;
  vehicle?: Vehicle;
  customers: Customer[];
  defaultCustomerId?: number;
  cancelHref: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <Select label="Cliente" name="customerId" required defaultValue={vehicle?.customerId ?? defaultCustomerId ?? ""}>
        <option value="" disabled>
          Selecione o cliente
        </option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Placa"
          name="placa"
          required
          defaultValue={vehicle?.placa}
          className="uppercase"
          maxLength={8}
        />
        <Input label="Ano" name="ano" type="number" defaultValue={vehicle?.ano ?? ""} />
        <Input label="Marca" name="marca" required defaultValue={vehicle?.marca} />
        <Input label="Modelo" name="modelo" required defaultValue={vehicle?.modelo} />
        <Input label="Cor" name="cor" defaultValue={vehicle?.cor ?? ""} />
        <Input
          label="Quilometragem"
          name="quilometragem"
          type="number"
          defaultValue={vehicle?.quilometragem ?? ""}
        />
      </div>
      <Textarea label="Observações" name="observacoes" defaultValue={vehicle?.observacoes ?? ""} />
      <div className="flex justify-end gap-2 pt-2">
        <LinkButton href={cancelHref} variant="secondary">
          Cancelar
        </LinkButton>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
