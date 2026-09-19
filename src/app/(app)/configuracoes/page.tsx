import { getWorkshopSettings } from "@/lib/settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateWorkshopSettings } from "@/actions/settings";

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { ok, erro } = await searchParams;
  const settings = await getWorkshopSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configurações da Oficina" description="Esses dados aparecem na nota de serviço impressa" />
      <Banner ok={ok} erro={erro} />
      <Card className="p-5">
        <form action={updateWorkshopSettings} className="space-y-4">
          <Input label="Nome da oficina" name="nome" required defaultValue={settings.nome} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="CPF/CNPJ" name="cpfCnpj" defaultValue={settings.cpfCnpj ?? ""} />
            <Input label="Telefone" name="telefone" defaultValue={settings.telefone ?? ""} />
            <Input label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp ?? ""} />
            <Input label="Cidade" name="cidade" defaultValue={settings.cidade ?? ""} />
            <Input label="Estado" name="estado" defaultValue={settings.estado ?? ""} maxLength={2} className="uppercase" />
          </div>
          <Input label="Endereço" name="endereco" defaultValue={settings.endereco ?? ""} />
          <div className="flex justify-end pt-2">
            <Button type="submit">Salvar configurações</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
