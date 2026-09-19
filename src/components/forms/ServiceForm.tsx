import { Input, Textarea } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import type { Service } from "@/generated/prisma/client";

export function ServiceForm({
  action,
  service,
  cancelHref,
}: {
  action: (formData: FormData) => void;
  service?: Service;
  cancelHref: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <Input label="Nome do serviço" name="nome" required defaultValue={service?.nome} />
      <Textarea label="Descrição" name="descricao" defaultValue={service?.descricao ?? ""} />
      <Input
        label="Valor padrão (R$)"
        name="valorPadrao"
        type="number"
        step="0.01"
        min="0"
        defaultValue={service ? Number(service.valorPadrao) : 0}
      />
      <div className="flex justify-end gap-2 pt-2">
        <LinkButton href={cancelHref} variant="secondary">
          Cancelar
        </LinkButton>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
