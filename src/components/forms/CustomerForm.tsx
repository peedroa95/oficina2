import { Input, Textarea } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import type { Customer } from "@/generated/prisma/client";

export function CustomerForm({
  action,
  customer,
  cancelHref,
}: {
  action: (formData: FormData) => void;
  customer?: Customer;
  cancelHref: string;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" name="nome" required defaultValue={customer?.nome} className="sm:col-span-2" />
        <Input label="CPF ou CNPJ" name="cpfCnpj" defaultValue={customer?.cpfCnpj ?? ""} />
        <Input label="Telefone" name="telefone" defaultValue={customer?.telefone ?? ""} />
        <Input label="WhatsApp" name="whatsapp" defaultValue={customer?.whatsapp ?? ""} />
        <Input label="Endereço" name="endereco" defaultValue={customer?.endereco ?? ""} />
      </div>
      <Textarea label="Observações" name="observacoes" defaultValue={customer?.observacoes ?? ""} />
      <div className="flex justify-end gap-2 pt-2">
        <LinkButton href={cancelHref} variant="secondary">
          Cancelar
        </LinkButton>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
